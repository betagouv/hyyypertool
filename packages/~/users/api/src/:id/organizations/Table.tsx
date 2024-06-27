import { type Pagination } from "@~/app.core/schema";
import type { MonComptePro_Pg_Context } from "@~/app.middleware/moncomptepro_pg";
import { Foot } from "@~/app.ui/hx_table";
import { notice } from "@~/app.ui/notice";
import { hx_urls, urls } from "@~/app.urls";
import { get_organisations_by_user_id } from "@~/organizations.repository/get_organisations_by_user_id";
import { useContext, type PropsWithChildren } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";
import {
  UserOrganizationRow_Context,
  UserOrganizationTable_Context,
} from "./context";

//

export async function UserOrganizationTable() {
  const { pagination, user_id, query_organizations_collection } = useContext(
    UserOrganizationTable_Context,
  );
  const { organizations, count } = await query_organizations_collection;

  const hx_organizations_query_props = hx_urls.users[":id"].organizations.$get({
    param: { id: user_id.toString() },
    query: {},
  });

  if (count === 0) {
    const { base, container, body, title } = notice();
    return (
      <div class={base()}>
        <div class={container()}>
          <div class={body()}>
            <p class={title()}>
              🥹 Aucune organisation n'a été trouvée pour cet utilisateur.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div class="fr-table [&>table]:table">
      <table>
        <thead>
          <tr>
            <th class="break-words">Siret</th>
            <th class="break-words">Libellé</th>
            <th class="max-w-32 break-words">Domain email vérifié</th>
            <th class="max-w-32 break-words">Domain email authorizé</th>
            <th class="max-w-32 break-words">Domain email externe authorizé</th>
            <th class="max-w-32 break-words">Code géographique officiel</th>

            <th>Lien</th>
          </tr>
        </thead>

        <tbody>
          {organizations.map((organization) => (
            <UserOrganizationRow_Context.Provider value={organization}>
              <Row />
            </UserOrganizationRow_Context.Provider>
          ))}
        </tbody>

        <Foot
          count={count}
          hx_query_props={hx_organizations_query_props}
          pagination={pagination}
        />
      </table>
    </div>
  );
}

//

function Row() {
  const {
    authorized_email_domains,
    cached_code_officiel_geographique,
    cached_libelle,
    external_authorized_email_domains,
    id,
    siret,
    verified_email_domains,
  } = useContext(UserOrganizationRow_Context);

  return (
    <tr>
      <td>{siret}</td>
      <td>{cached_libelle}</td>
      <td class="break-words">{verified_email_domains.join(", ")}</td>
      <td class="break-words">{authorized_email_domains.join(", ")}</td>
      <td class="break-words">
        {external_authorized_email_domains.join(", ")}
      </td>
      <td>{cached_code_officiel_geographique}</td>
      <td>
        <a
          class="p-3"
          href={
            urls.organizations[":id"].$url({ param: { id: id.toString() } })
              .pathname
          }
        >
          ➡️
        </a>
      </td>
    </tr>
  );
}

export async function UserOrganizationTable_Provider({
  value: { pagination, user_id },
  children,
}: PropsWithChildren<{
  value: { pagination: Pagination; user_id: number };
}>) {
  const {
    var: { moncomptepro_pg },
  } = useRequestContext<MonComptePro_Pg_Context>();

  const query_organizations_collection = get_organisations_by_user_id(
    moncomptepro_pg,
    { user_id, pagination: { ...pagination, page: pagination.page - 1 } },
  );

  return (
    <UserOrganizationTable_Context.Provider
      value={{ query_organizations_collection, user_id, pagination }}
    >
      {children}
    </UserOrganizationTable_Context.Provider>
  );
}
