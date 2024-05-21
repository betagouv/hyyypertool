//

import { zValidator } from "@hono/zod-validator";
import { HTTPError } from "@~/app.core/error";
import type { Htmx_Header } from "@~/app.core/htmx";
import { Entity_Schema } from "@~/app.core/schema";
import { z_coerce_boolean } from "@~/app.core/schema/z_coerce_boolean";
import { z_email_domain } from "@~/app.core/schema/z_email_domain";
import type { MonComptePro_Pg_Context } from "@~/app.middleware/moncomptepro_pg";
import type { UserInfo_Context } from "@~/app.middleware/vip_list.guard";
import { MODERATION_EVENTS } from "@~/moderations.lib/event";
import { member_join_organization } from "@~/moderations.lib/usecase/member_join_organization";
import { schema } from "@~/moncomptepro.database";
import { send_moderation_processed_email } from "@~/moncomptepro.lib/index";
import { Verification_Type_Schema } from "@~/moncomptepro.lib/verification_type";
import { add_verified_domain } from "@~/organizations.lib/usecase/add_verified_domain";
import { to } from "await-to-js";
import consola from "consola";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { P, match } from "ts-pattern";
import { z } from "zod";
import { comment_message } from "./comment_message";

//

export const FORM_SCHEMA = z.object({
  add_domain: z.enum(["AS_INTERNAL", "AS_EXTERNAL"]).optional(),
  add_member: z.enum(["AS_INTERNAL", "AS_EXTERNAL", "NOPE"]).default("NOPE"),
  send_notitfication: z.string().default("false").pipe(z_coerce_boolean),
  verification_type: Verification_Type_Schema.optional(),
});

//

export default new Hono<MonComptePro_Pg_Context & UserInfo_Context>().patch(
  "/",
  zValidator("param", Entity_Schema),
  zValidator("form", FORM_SCHEMA),
  async ({
    text,
    req,
    notFound,
    var: { moncomptepro_pg, userinfo, sentry },
  }) => {
    const { id } = req.valid("param");
    const { add_domain, add_member, send_notitfication, verification_type } =
      req.valid("form");

    const moderation = await moncomptepro_pg.query.moderations.findFirst({
      columns: { comment: true, organization_id: true, user_id: true },
      with: { users: { columns: { email: true } } },
      where: eq(schema.moderations.id, id),
    });
    console.log({
      add_domain,
      add_member,
      send_notitfication,
      verification_type,
    });

    if (1) return text("OK", 200);
    if (!moderation) return notFound();

    const {
      comment,
      organization_id,
      user_id,
      users: { email },
    } = moderation;
    const domain = z_email_domain.parse(email, { path: ["data.email"] });

    if (add_domain) {
      const [error] = await to(
        add_verified_domain(
          { pg: moncomptepro_pg },
          { organization_id, domain },
        ),
      );

      match(error)
        .with(P.instanceOf(HTTPError), () => {
          consola.error(error);
          sentry.captureException(error, {
            data: { domain, organization_id: id },
          });
        })
        .with(P.instanceOf(Error), () => {
          consola.error(error);
          throw error;
        });
    }

    if (add_member !== "NOPE") {
      const is_external = match(add_member)
        .with("AS_INTERNAL", () => false)
        .with("AS_EXTERNAL", () => true)
        .exhaustive();

      const [error] = await to(
        member_join_organization(
          { pg: moncomptepro_pg },
          { is_external, moderation_id: id },
        ),
      );

      match(error)
        .with(P.instanceOf(HTTPError), () => {
          consola.error(error);
          sentry.captureException(error, {
            data: { domain, organization_id: id },
          });
        })
        .with(P.instanceOf(Error), () => {
          consola.error(error);
          throw error;
        });
    }

    if (send_notitfication) {
      await send_moderation_processed_email({ organization_id, user_id });
    }

    await moncomptepro_pg
      .update(schema.moderations)
      .set({
        comment: [
          ...(comment ? [comment] : []),
          comment_message({
            type: "VALIDATED",
            created_by: userinfo.email,
          }),
        ].join("\n"),
        moderated_at: new Date(),
        moderated_by: userinfo.email,
      })
      .where(eq(schema.moderations.id, id));

    return text("OK", 200, {
      "HX-Trigger": [MODERATION_EVENTS.Enum.MODERATION_UPDATED].join(", "),
    } as Htmx_Header);
  },
);
