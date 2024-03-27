//

import { NotFoundError } from "@~/app.core/error";
import { Htmx_Events } from "@~/app.core/htmx";
import type { MonComptePro_Pg_Context } from "@~/app.middleware/moncomptepro_pg";
import { button } from "@~/app.ui/button";
import { fieldset } from "@~/app.ui/form";
import { OpenInZammad } from "@~/app.ui/zammad/components/OpenInZammad";
import { SearchInZammad } from "@~/app.ui/zammad/components/SearchInZammad";
import { hx_urls, urls } from "@~/app.urls";
import {
  get_duplicate_moderations,
  type get_duplicate_moderations_dto,
} from "@~/moderations.repository/get_duplicate_moderations";
import { schema } from "@~/moncomptepro.database";
import {
  get_user_by_id,
  type get_user_by_id_dto,
} from "@~/users.repository/get_user_by_id";
import { get_zammad_mail } from "@~/zammad.lib";
import { to } from "await-to-js";
import { eq } from "drizzle-orm";
import { raw } from "hono/html";
import { createContext, useContext } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";

//

export async function Duplicate_Warning({
  moderation_id,
  organization_id,
  user_id,
}: {
  moderation_id: number;
  organization_id: number;
  user_id: number;
}) {
  const {
    var: { moncomptepro_pg },
  } = useRequestContext<MonComptePro_Pg_Context>();
  const moderations = await get_duplicate_moderations(moncomptepro_pg, {
    organization_id,
    user_id,
  });

  const moderation_count = moderations.length;

  if (moderation_count <= 1) return <></>;
  const user = await get_user_by_id(moncomptepro_pg, { id: user_id });
  if (!user) return <p>Utilisateur introuvable</p>;

  const moderation_tickets = await get_moderation_tickets(moderations);

  return (
    <Duplicate_Warning.Context.Provider
      value={{ moderation_id, moderations, moderation_tickets, user }}
    >
      <Alert />
    </Duplicate_Warning.Context.Provider>
  );
}

Duplicate_Warning.Context = createContext({
  moderation_id: NaN,
  moderation_tickets: {} as get_moderation_tickets_dto,
  moderations: {} as get_duplicate_moderations_dto,
  user: {} as NonNullable<Awaited<get_user_by_id_dto>>,
});

//

async function Alert() {
  const { moderations, moderation_tickets, user } = useContext(
    Duplicate_Warning.Context,
  );
  const moderation_count = moderations.length;

  return (
    <div class="fr-alert fr-alert--warning">
      <h3 class="fr-alert__title">Attention : demande multiples</h3>
      <p>Il s'agit de la {moderation_count}e demande pour cette organisation</p>
      <SearchInZammad search={user.email}>
        Trouver les echanges pour l'email « {user.email} » dans Zammad
      </SearchInZammad>
      <ul>
        {moderation_tickets.map(({ moderation, zammad_ticket }) => (
          <li key={moderation.id.toString()}>
            <a
              href={
                urls.moderations[":id"].$url({
                  param: { id: moderation.id.toString() },
                }).pathname
              }
            >
              Moderation#{moderation.id}
            </a>{" "}
            {moderation.moderated_at ? "✔️" : "❌"}:{" "}
            {moderation.ticket_id && zammad_ticket ? (
              <OpenInZammad ticket_id={moderation.ticket_id}>
                Ouvrir Ticket#{moderation.ticket_id} dans Zammad
              </OpenInZammad>
            ) : (
              "Pas de ticket"
            )}
          </li>
        ))}
      </ul>

      <MarkModerationAsProcessed />
    </div>
  );
}

async function MarkModerationAsProcessed() {
  const { moderation_id } = useContext(Duplicate_Warning.Context);
  const { base, element } = fieldset();
  const moderation = await get_moderation(moderation_id);

  if (moderation.moderated_at) return raw``;

  return (
    <form
      _={`
      on submit
        wait for ${Htmx_Events.enum.afterOnLoad}
        wait 2s
        go back
      `}
      {...hx_urls.moderations[":id"].$procedures.processed.$patch({
        param: { id: moderation_id.toString() },
      })}
      hx-swap="none"
    >
      <fieldset class={base()}>
        <div class={element({ class: "text-right" })}>
          <button class={button({ intent: "danger" })} type="submit">
            Marquer la modération comme traité
          </button>
        </div>
      </fieldset>
    </form>
  );
}

//

function get_moderation_tickets(moderations: get_duplicate_moderations_dto) {
  return Promise.all(
    moderations.map(async (moderation) => {
      if (!moderation.ticket_id) return { moderation };
      const [, zammad_ticket] = await to(
        get_zammad_mail({ ticket_id: moderation.ticket_id }),
      );
      return { moderation, zammad_ticket };
    }),
  );
}
type get_moderation_tickets_dto = Awaited<
  ReturnType<typeof get_moderation_tickets>
>;

//

async function get_moderation(moderation_id: number) {
  const {
    var: { moncomptepro_pg },
  } = useRequestContext<MonComptePro_Pg_Context>();

  const moderation = await moncomptepro_pg.query.moderations.findFirst({
    columns: { moderated_at: true },
    where: eq(schema.moderations.id, moderation_id),
  });
  if (!moderation) throw new NotFoundError("Moderation not found.");
  return moderation;
}
