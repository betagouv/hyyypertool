//

import { Pagination_Schema, type Pagination } from "@~/app.core/schema";
import { button } from "../button";

//

export function Foot({
  count,
  hx_query_props,
  id,
  name,
  pagination,
}: {
  count: number;
  hx_query_props: {};
  id?: string | undefined;
  name?: string | undefined;
  pagination: Pagination;
}) {
  const { page, page_size } = pagination;
  const last_page = Math.floor(count / page_size) + 1;
  const page_index = page - 1;

  return (
    <tfoot>
      <tr>
        <th colspan={2} class="whitespace-nowrap" scope="row">
          Showing {page_index * page_size}-{page_index * page_size + page_size}{" "}
          of {count}
        </th>
        <td colspan={3}>
          <button
            class={button({ class: "fr-btn--tertiary-no-outline" })}
            disabled={page <= 1}
            {...hx_query_props}
            hx-vals={JSON.stringify({ page: page - 1 } as Pagination)}
          >
            Précédent
          </button>
          <input
            {...hx_query_props}
            id={id}
            class="fr-input inline-block w-auto"
            name={name ?? Pagination_Schema.keyof().Enum.page}
            value={page}
          />{" "}
          <span> of {last_page}</span>
          <button
            class={button({ class: "fr-btn--tertiary-no-outline" })}
            disabled={page >= last_page}
            {...hx_query_props}
            hx-vals={JSON.stringify({ page: page + 1 } as Pagination)}
          >
            Suivant
          </button>
        </td>
        <td>
          <button class={button({ type: "tertiary" })} {...hx_query_props}>
            Rafraichir
          </button>
        </td>
      </tr>
    </tfoot>
  );
}
