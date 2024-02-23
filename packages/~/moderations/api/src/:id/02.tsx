//

import { hx_trigger_from_body } from "@~/app.core/htmx";
import { button } from "@~/app.ui/button";
import { hx_urls } from "@~/app.urls";
import { api_ref } from "@~/app.urls/legacy";
import type { Organization } from "@~/moncomptepro.database";
import { ORGANISATION_EVENTS } from "@~/organizations.lib/event";
import { useContext } from "hono/jsx";
import { ModerationPage_Context } from "./page";

//

export async function _02() {
  const { moderation, domain } = useContext(ModerationPage_Context);

  return (
    <div class="mx-auto mt-6 !max-w-6xl" id="02">
      <h1>🏛 A propos de l’organisation</h1>
      <hr />
      <div class="mt-5 block">
        <button
          class={button({ className: "block", intent: "warning" })}
          {...hx_urls.legacy.organizations[":id"].verify[":domain"].$patch({
            param: {
              id: moderation.organizations.id.toString(),
              domain: domain,
            },
          })}
          hx-swap="none"
        >
          🪄 Action en un click :<br /> - ajouter le domaine <b>{domain}</b>{" "}
          dans les domaines internes (si pas déjà présent)
          <br /> - marquer ce domaine comme vérifié (si pas déjà vérifié)
          <br /> - marquer les membres existants de l'orga comme
          `verified_email_domain` (si pas de vérification effectuée)
        </button>
      </div>
      <div>
        <div class="my-3">
          <Edit_Domain organization={moderation.organizations} />
        </div>
      </div>
      <br />
      <hr />
      <br />
      <h3>Membres enregistrés dans cette organisation :</h3>
      <div
        {...hx_urls.legacy.organizations[":id"].members.$get({
          param: {
            id: moderation.organization_id.toString(),
          },
          query: {},
        })}
        hx-target="this"
        hx-trigger={`load, ${ORGANISATION_EVENTS.Enum.MEMBERS_UPDATED} from:body`}
        class="fr-table"
        id="table-organisation-members"
      ></div>
      <div class="grid grid-cols-2 gap-1">
        <button
          class={button({ className: "block", intent: "warning" })}
          {...hx_urls.legacy.organizations[":id"].members[":user_id"].$post({
            param: {
              id: moderation.organization_id.toString(),
              user_id: moderation.user_id.toString(),
            },
            form: { is_external: "false" },
          })}
          hx-swap="none"
        >
          🪄 Action en un click :<br />- ajouter {moderation.users.given_name} à
          l'organisation EN TANT QU'INTERNE (si pas déjà dans l'orga)
          <br />
          - lui envoyer un mail avec la liste des personnes présente dans
          l'organisation (le cas échéant et si pas déjà envoyé)
          <br />- envoyer un mail au membre existant de l'organisation pour les
          prévenir de l'arrivée de {moderation.users.given_name} (le cas échéant
          et si pas déjà envoyé)
        </button>
        <button
          class={button({ className: "block", intent: "warning" })}
          {...hx_urls.legacy.organizations[":id"].members[":user_id"].$post({
            param: {
              id: moderation.organization_id.toString(),
              user_id: moderation.user_id.toString(),
            },
            form: { is_external: "true" },
          })}
          hx-swap="none"
        >
          🪄 Action en un click :<br />- ajouter {moderation.users.given_name} à
          l'organisation EN TANT QUE EXTERNE (si pas déjà dans l'orga)
          <br />- envoyer un mail au membre existant de l'organisation pour les
          prévenir de l'arrivée de {moderation.users.given_name} (le cas échéant
          et si pas déjà envoyé)
        </button>
      </div>
      <hr />
      <h3 class="mt-2">
        <a
          href={api_ref("/legacy/users/:id", {
            id: moderation.user_id.toString(),
          })}
        >
          #### 👨‍💻 A propos de <span>{moderation.users.given_name}</span>
        </a>
      </h3>
      <b>{moderation.users.given_name}</b> est enregistré(e) dans les
      organisations suivantes :
      <div class="fr-table max-w-full overflow-x-auto">
        <div
          hx-get={api_ref("/legacy/users/:id/organizations", {
            id: String(moderation.user_id),
          })}
          hx-target="this"
          hx-trigger="load"
          class="fr-table"
          id="table-user-organisations"
        ></div>
      </div>
    </div>
  );
}

export async function Edit_Domain({
  organization,
}: {
  organization: Organization;
}) {
  return (
    <div class="grid grid-cols-2">
      <div
        class="fr-table"
        {...hx_urls.legacy.organizations[":id"].domains.internal.$get({
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
      ></div>
      <div
        class="fr-table"
        {...hx_urls.legacy.organizations[":id"].domains.external.$get({
          param: {
            id: organization.id.toString(),
          },
        })}
        hx-trigger={[
          "load",
          `${ORGANISATION_EVENTS.Enum.EXTERNAL_DOMAIN_UPDATED} from:body`,
        ].join(", ")}
      ></div>
    </div>
  );
}
