//

import { api_ref } from ":api_ref";
import { date_to_string } from ":common/date";
import env from ":common/env.ts";
import type { Moderation, Organization, User } from ":database:moncomptepro";
import { moncomptepro_pg, schema } from ":database:moncomptepro";
import type { MCP_Moderation } from ":moncomptepro";
import { button } from ":ui/button";
import { CopyButton } from ":ui/button/copy";
import { GoogleSearchButton } from ":ui/button/search";
import { and, count, eq } from "drizzle-orm";
import { useContext } from "hono/jsx";
import lodash_sortby from "lodash.sortby";
import queryString from "query-string";
import { match } from "ts-pattern";
import { ModerationPage_Context } from "./page";

//

export async function _02() {
  const { moderation } = useContext(ModerationPage_Context);

  const domain = moderation.users.email.split("@")[1];

  return (
    <div class="mx-auto mt-6 !max-w-6xl" id="02">
      <h1>🗃️ 2. Je consulte les données relative au cas à l'étude</h1>
      <div
        hx-get={api_ref("/legacy/duplicate_warning", {})}
        hx-trigger="load"
        hx-vals={JSON.stringify({
          organization_id: moderation.organization_id,
          user_id: moderation.user_id,
        })}
      >
        Demande multiples ?
      </div>
      <hr />
      <h2>
        🤗 <span>{moderation.users.given_name}</span>{" "}
        <span class="text-gray-600">
          {match(moderation.type as MCP_Moderation["type"])
            .with("ask_for_sponsorship", () => "demande un sponsorship")
            .with(
              "non_verified_domain",
              () => "a rejoint une organisation avec un domain non vérifié  ",
            )
            .with(
              "organization_join_block",
              () => "veut rejoindre l'organisation",
            )
            .otherwise(
              (type) => `veut effectuer une action inconnue (type ${type})`,
            )}
        </span>{" "}
        « <span>{moderation.organizations.cached_libelle}</span> »
      </h2>
      <ModerationCallout moderation={moderation} />
      <FirstToolBox
        email={moderation.users.email}
        given_name={moderation.users.given_name ?? undefined}
        domain={domain}
        organization={moderation.organizations}
      />
      <div class="mt-5 block">
        <About_Organisation moderation={moderation} />
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
        hx-get={api_ref("/legacy/organizations/:id/members", {
          id: String(moderation.organization_id),
        })}
        hx-target="this"
        hx-trigger="load, users_organizations_updated from:body"
        class="fr-table"
        id="table-organisation-members"
      ></div>
      <hr />
      <h3 class="mt-2">
        #### 👨‍💻 A propos de <span>{moderation.users.given_name}</span>
      </h3>
      <ul>
        <li>
          id : <b>{moderation.user_id}</b>
        </li>
        <li>
          email : <b>{moderation.users.email}</b>
        </li>
        <li>
          prénom : <b>{moderation.users.given_name}</b>
        </li>
        <li>
          nom : <b>{moderation.users.family_name}</b>
        </li>
        <li>
          téléphone : <b>{moderation.users.phone_number}</b>
        </li>
        <li>
          poste : <b>{moderation.users.job}</b>
        </li>
        <li>
          nombre de connection : <b>{moderation.users.sign_in_count}</b>
        </li>
        <li>
          Dernière connexion :{" "}
          <b>
            {moderation.users.last_sign_in_at?.toLocaleDateString()}{" "}
            {moderation.users.last_sign_in_at?.toLocaleTimeString()}
          </b>
        </li>
        <li>
          Creation de compte :{" "}
          <b>
            {moderation.users.created_at.toLocaleDateString()}{" "}
            {moderation.users.created_at.toLocaleTimeString()}
          </b>
        </li>
        <li>
          Demande de création :{" "}
          <b>
            {moderation.created_at.toLocaleDateString()}{" "}
            {moderation.users.created_at.toLocaleTimeString()}
          </b>
        </li>
      </ul>
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

function FirstToolBox({
  email,
  domain,
  given_name,
  organization,
}: {
  email: string;
  domain: string;
  given_name: string | undefined;
  organization: Organization;
}) {
  return (
    <div class="grid  grid-cols-2 gap-1 ">
      <a
        class={button()}
        href={datapass_from_email(email)}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span>Voir les demandes DataPass déposées par {given_name}</span>
      </a>
      <div></div>
      <CopyButton text={email}>Copier l'email</CopyButton>
      <GoogleSearchButton query={email}>Rechercher l'email</GoogleSearchButton>
      <CopyButton text={domain}>Copier le domaine</CopyButton>
      <GoogleSearchButton query={domain}>
        Rechercher le domaine
      </GoogleSearchButton>
      <Search_Domain domain={domain} organization={organization} />
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
        hx-get={api_ref(`/legacy/organizations/:id/domains/internal`, {
          id: String(organization.id),
        })}
        hx-trigger="load, organisation_internal_domain_updated from:body"
        id="edit-domain"
      ></div>
      <div
        class="fr-table"
        hx-get={api_ref(`/legacy/organizations/:id/domains/external`, {
          id: String(organization.id),
        })}
        hx-trigger="load, organisation_external_domain_updated from:body"
        id="edit-domain"
      ></div>
    </div>
  );
}

export async function Duplicate_Warning({
  organization_id,
  user_id,
}: {
  organization_id: number;
  user_id: number;
}) {
  const [{ value: moderation_count }] = await moncomptepro_pg
    .select({ value: count() })
    .from(schema.moderations)
    .where(
      and(
        eq(schema.moderations.organization_id, organization_id),
        eq(schema.moderations.user_id, user_id),
      ),
    );

  if (moderation_count <= 1) return <></>;

  return (
    <div class="fr-alert fr-alert--warning">
      <h3 class="fr-alert__title">Attention : demande multiples</h3>
      <p>Il s'agit de la {moderation_count}e demande pour cette organisation</p>
    </div>
  );
}

function Search_Domain({
  domain,
  organization,
}: {
  domain: string;
  organization: Organization;
}) {
  return (
    <>
      <GoogleSearchButton query={domain}>
        « <span>{domain}</span> » sur Google
      </GoogleSearchButton>

      <a
        href={`https://annuaire-entreprises.data.gouv.fr/etablissement/${organization.siret}`}
        class={button()}
        rel="noopener noreferrer"
        target="_blank"
      >
        fiche Annuaire Entreprises
      </a>
      <a
        href={`https://lannuaire.service-public.fr/recherche?where=${organization.cached_code_postal}&whoWhat=Mairie`}
        class={button()}
        rel="noopener noreferrer"
        target="_blank"
      >
        Mairie sur Annuaire Service Public
      </a>
      <a
        href={`https://lannuaire.service-public.fr/recherche?where=${organization.cached_code_postal}`}
        class={button()}
        rel="noopener noreferrer"
        target="_blank"
      >
        Service sur Annuaire Service Public
      </a>
      <a
        href={`https://data.education.gouv.fr/api/v2/catalog/datasets/fr-en-annuaire-education/records?where=siren_siret%3D${organization.siret}`}
        class={button()}
        rel="noopener noreferrer"
        target="_blank"
      >
        Établissement sur l'annuaire Éducation Nationale
      </a>
    </>
  );
}

function About_Organisation({
  moderation,
}: {
  moderation: Moderation & { organizations: Organization; users: User };
}) {
  const domain = moderation.users.email.split("@")[1];
  return (
    <>
      <h3 class="mt-12"> 🏛 A propos de l'organisation</h3>
      <ul>
        <li>
          Dénomination : <b>{moderation.organizations.cached_libelle}</b>
        </li>
        <li>
          Activité principale de l’établissement (NAF/APE) :{" "}
          <b>{moderation.organizations.cached_libelle_activite_principale}</b>
        </li>
        <li>
          Nature juridique :{" "}
          <b>{moderation.organizations.cached_libelle_categorie_juridique}</b>
        </li>
        <li>
          Tranche d'effectif :{" "}
          <b>{moderation.organizations.cached_libelle_tranche_effectif}</b>{" "}
          (code :{" "}
          <span>{moderation.organizations.cached_tranche_effectifs}</span>) (
          <a
            href="https://www.sirene.fr/sirene/public/variable/tefen"
            target="_blank"
          >
            liste code effectif INSEE
          </a>
          )
        </li>
        <li>
          État administratif :{" "}
          <b>{moderation.organizations.cached_etat_administratif}</b> (
          <a
            href="https://www.sirene.fr/sirene/public/variable/etatAdministratifEtablissement"
            target="_blank"
          >
            liste état administratif INSEE
          </a>
          )
        </li>
      </ul>
      <ul>
        <li>
          id : <b>{moderation.organizations.id}</b>
        </li>
        <li>
          siret : <b>{moderation.organizations.siret}</b>
        </li>

        <div
          hx-get={api_ref("/legacy/leaders", {})}
          hx-trigger="load"
          hx-vals={JSON.stringify({
            siret: moderation.organizations.siret,
          })}
        >
          Recherche des dirigeants...
        </div>
      </ul>
      <br />

      <button class={button({ className: "block", intent: "warning" })}>
        🪄 Action en un click :<br /> - ajouter le domaine <b>{domain}</b> dans
        les domaines internes (si pas déjà présent)
        <br /> - marquer ce domaine comme vérifié (si pas déjà vérifié)
        <br /> - marquer les membres existants de l'orga comme
        `verified_email_domain` (si pas de vérification effectuée)
      </button>
    </>
  );
}

interface Entreprise_API_Association_Response {
  data: {
    documents_rna: {
      annee_depot: string;
      date_depot: string;
      sous_type: {
        code: string;
      };
      url: string;
    }[];
  };
}

export async function List_Leaders({ siret }: { siret: string }) {
  const siren = siret.substring(0, 9);
  const query_params = new URLSearchParams({
    context: "Modération MonComptePro",
    object: "Modération MonComptePro",
    recipient: "13002526500013",
  });
  const response = await fetch(
    `https://entreprise.api.gouv.fr/v4/djepva/api-association/associations/${siren}?${query_params}`,
    {
      headers: {
        Authorization: `Bearer ${env.ENTREPRISE_API_GOUV_TOKEN}`,
      },
    },
  );
  const { data } =
    (await response.json()) as Entreprise_API_Association_Response;
  if (!data) return <></>;
  const docs = data.documents_rna;
  const sortedDocs = lodash_sortby(docs, ["annee_depot", "date_depot"]);
  const doc = sortedDocs.findLast(({ sous_type: { code } }) => code === "LDC");

  return doc ? (
    <a href={doc.url}>Liste des dirigeants</a>
  ) : (
    <>Pas de liste des dirigeants</>
  );
}

function datapass_from_email(email: string) {
  const query = queryString.stringify({
    sorted: JSON.stringify([{ id: "updated_at", desc: false }]),
    filtered: JSON.stringify([
      { id: "team_members.email", value: email },
      { id: "status", value: [] },
    ]),
  });
  return `https://datapass.api.gouv.fr/habilitations?${query}`;
}

function ModerationCallout({ moderation }: { moderation: Moderation }) {
  if (!moderation.moderated_at) return <></>;
  return (
    <div class="fr-callout fr-callout--green-emeraude fr-icon-information-line">
      <h3 class="fr-callout__title">Modération traitée</h3>
      <p class="fr-callout__text">
        Cette modération a été marqué comme traitée le{" "}
        <b>{date_to_string(moderation.moderated_at)}</b>.
      </p>
    </div>
  );
}
