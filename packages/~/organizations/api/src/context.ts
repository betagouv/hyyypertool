//

import { hyper_ref } from "@~/app.core/html";
import { type Pagination } from "@~/app.core/schema";
import type { get_organizations_list_dto } from "@~/organizations.repository/get_organizations_list";
import { createContext } from "hono/jsx";

//

export const OrganizationTable_Context = createContext({
  $page_input: hyper_ref(),
  $search_input: hyper_ref(),
  $table: hyper_ref(),
  pagination: {} as Pagination,
  query_organizations_collection: {} as get_organizations_list_dto,
});

export const OrganizationRow_Context = createContext(
  {} as Awaited<get_organizations_list_dto>["organizations"][number],
);
