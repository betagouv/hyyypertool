//

import { hx_include } from "@~/app.core/htmx";
import { Foot } from "@~/app.ui/hx_table";
import { LocalTime } from "@~/app.ui/time/LocalTime";
import { hx_urls, urls } from "@~/app.urls";
import { useContext } from "hono/jsx";
import { OrganizationRow_Context, OrganizationTable_Context } from "./context";

//

export async function Table() {
  const {
    $page_input,
    $search_input,
    $table,
    pagination,
    query_organizations_collection,
  } = useContext(OrganizationTable_Context);

  const hx_organizations_query_props = {
    ...hx_urls.organizations.$get({
      query: {},
    }),
    "hx-include": hx_include([$page_input, $search_input]),
    "hx-replace-url": true,
    "hx-select": `#${$table} > table`,
    "hx-target": `#${$table}`,
  };

  const { organizations, count } = await query_organizations_collection;

  return (
    <div id={$table} class="fr-table [&>table]:table">
      <table>
        <thead>
          <tr>
            <th>Date de création</th>
            <th class="break-words">Libellé</th>
            <th class="break-words">Siret</th>
            <th class="max-w-32 break-words">Domain email authorizé</th>
            <th class="max-w-32 break-words">Domain email externe authorizé</th>
            <th class="max-w-32 break-words">Domain email vérifié</th>

            <th class="max-w-32 break-words">Code géographique officiel</th>

            <th>ID</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {organizations.map((organization) => (
            <OrganizationRow_Context.Provider value={organization}>
              <Row />
            </OrganizationRow_Context.Provider>
          ))}
        </tbody>

        <Foot
          count={count}
          hx_query_props={hx_organizations_query_props}
          id={$page_input}
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
    created_at,
    external_authorized_email_domains,
    id,
    siret,
    verified_email_domains,
  } = useContext(OrganizationRow_Context);

  return (
    <tr>
      <td>
        <LocalTime date={created_at} />
      </td>
      <td class="max-w-32 break-words">{cached_libelle}</td>
      <td>{siret}</td>
      <td class="max-w-32 break-words">
        {authorized_email_domains.join(", ")}
      </td>
      <td class="max-w-32 break-words">
        {external_authorized_email_domains.join(", ")}
      </td>
      <td class="max-w-32 break-words">{verified_email_domains.join(", ")}</td>

      <td>{cached_code_officiel_geographique}</td>

      <td>{id}</td>
      <td>
        <a
          class="p-3"
          href={
            urls.organizations[":id"].$url({
              param: {
                id: id.toString(),
              },
            }).pathname
          }
        >
          ➡️
        </a>
      </td>
    </tr>
  );
}
