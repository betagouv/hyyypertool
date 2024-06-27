//

import { hyper_ref } from "@~/app.core/html";
import type { Pagination } from "@~/app.core/schema";
import type { MonComptePro_Pg_Context } from "@~/app.middleware/moncomptepro_pg";
import { urls } from "@~/app.urls";
import { get_organizations_list } from "@~/organizations.repository/get_organizations_list";
import { useRequestContext } from "hono/jsx-renderer";
import { Table } from "./Table";
import { OrganizationTable_Context } from "./context";
import { SearchParams_Schema, type SearchParams } from "./query";

//

const $table = hyper_ref();
const $page_input = hyper_ref();
const $search_input = hyper_ref();

//

export default async function Page({
  pagination,
  search,
}: {
  pagination: Pagination;
  search: SearchParams;
}) {
  const {
    var: { moncomptepro_pg },
  } = useRequestContext<MonComptePro_Pg_Context>();
  const { page, page_size } = pagination;
  const { q: siret } = search;
  const query_organizations_collection = get_organizations_list(
    moncomptepro_pg,
    {
      search: { siret },
      pagination: { page: page - 1, take: page_size },
    },
  );

  return (
    <main class="fr-container my-12">
      <h1>Liste des organisations</h1>
      <label class="fr-label" for={$search_input}>
        SIRET
      </label>
      <input
        class="fr-input"
        hx-get={urls.organizations.$url().pathname}
        hx-replace-url="true"
        hx-select={`#${$table} > table`}
        hx-target={`#${$table}`}
        hx-trigger="input changed delay:500ms, search"
        id={$search_input}
        name={SearchParams_Schema.keyof().Enum.q}
        placeholder="Rechercher par SIRET"
        type="text"
        value={siret}
      />
      <OrganizationTable_Context.Provider
        value={{
          $page_input,
          $search_input,
          $table,
          pagination,
          query_organizations_collection,
        }}
      >
        <Table />
      </OrganizationTable_Context.Provider>
    </main>
  );
}
