//

import { hx_trigger_from_body } from "@~/app.core/htmx";
import { Loader } from "@~/app.ui/loader/Loader";
import { hx_urls } from "@~/app.urls";
import { ORGANISATION_EVENTS } from "@~/organizations.lib/event";
import { useContext } from "hono/jsx";
import { ModerationPage_Context } from "./context";

//

export function Domain_Organization() {
  const { moderation } = useContext(ModerationPage_Context);
  return (
    <section>
      <h3>🌐 Domaines de l'organisation</h3>

      <div class="grid grid-cols-2 gap-6">
        <Edit_Internal_Domain organization={moderation.organizations} />
        <Edit_External_Domain organization={moderation.organizations} />
      </div>
    </section>
  );
}

function Edit_Internal_Domain() {
  const {
    moderation: { organizations: organization },
  } = useContext(ModerationPage_Context);
  return (
    <div
      {...hx_urls.organizations[":id"].domains.internal.$get({
        param: {
          id: organization.id.toString(),
        },
      })}
      hx-trigger={[
        "load",
        ...hx_trigger_from_body([
          ORGANISATION_EVENTS.Enum.INTERNAL_DOMAIN_UPDATED,
        ]),
      ].join(", ")}
    >
      <center>
        <Loader />
      </center>
    </div>
  );
}

function Edit_External_Domain() {
  const {
    moderation: { organizations: organization },
  } = useContext(ModerationPage_Context);
  return (
    <div
      {...hx_urls.organizations[":id"].domains.external.$get({
        param: {
          id: organization.id.toString(),
        },
      })}
      hx-trigger={[
        "load",
        ...hx_trigger_from_body([
          ORGANISATION_EVENTS.Enum.EXTERNAL_DOMAIN_UPDATED,
        ]),
      ].join(", ")}
    >
      <center>
        <Loader />
      </center>
    </div>
  );
}
