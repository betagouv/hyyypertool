//

import { date_to_string } from ":common/date";
import { hx_include } from ":common/htmx";
import type { Pagination } from ":common/schema";
import type { moncomptepro_pg_Context } from ":database:moncomptepro/middleware";
import { app_hc } from ":hc";
import { button } from ":ui/button";
import { row } from ":ui/table";
import { useRequestContext } from "hono/jsx-renderer";
import { get_unverified_domain_emails_list } from "./repository";

//

const DOMAIN_EMAIL_TABLE_ID = "domain-email-table";

//

const hx_domain_email_query_props = {
  "hx-get": app_hc.unverified_domain_emails.$url().pathname,
  "hx-include": hx_include([]),
  "hx-replace-url": true,
  "hx-select": `#${DOMAIN_EMAIL_TABLE_ID} > table`,
  "hx-target": `#${DOMAIN_EMAIL_TABLE_ID}`,
};

//

export function DomainEmail_Page({ pagination }: { pagination: Pagination }) {
  return (
    <main
      class="fr-container my-12"
      {...hx_domain_email_query_props}
      hx-sync="this"
      hx-trigger={[
        `every 11s [document.visibilityState === 'visible']`,
        `visibilitychange[document.visibilityState === 'visible'] from:document`,
      ].join(", ")}
    >
      <DomainEmail_Table pagination={pagination} />
    </main>
  );
}

//

async function DomainEmail_Table({ pagination }: { pagination: Pagination }) {
  const {
    var: { moncomptepro_pg },
  } = useRequestContext<moncomptepro_pg_Context>();
  const { page, page_size } = pagination;
  const { count, organizations } = await get_unverified_domain_emails_list(
    moncomptepro_pg,
    {
      pagination: { page: page - 1, take: page_size },
    },
  );

  return (
    <div class="fr-table [&>table]:table" id={DOMAIN_EMAIL_TABLE_ID}>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Siret</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {organizations.map((organizations) => (
            <Row organization={organizations} />
          ))}
        </tbody>
        <Foot count={count} pagination={pagination} />
      </table>
    </div>
  );
}

function Foot({
  count,
  pagination,
}: {
  count: number;
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
        <td colspan={6}>
          <button
            class={button({ class: "fr-btn--tertiary-no-outline" })}
            disabled={page <= 1}
            {...hx_domain_email_query_props}
            hx-vals={JSON.stringify({ page: page - 1 } as Pagination)}
          >
            Précédent
          </button>
          <input
            class="fr-input inline-block w-auto"
            {...hx_domain_email_query_props}
            // id={MODERATION_TABLE_PAGE_ID}
            name={"page" as keyof Pagination}
            value={page}
          />{" "}
          <span> of {last_page}</span>
          <button
            class={button({ class: "fr-btn--tertiary-no-outline" })}
            disabled={page >= last_page}
            {...hx_domain_email_query_props}
            hx-vals={JSON.stringify({ page: page + 1 } as Pagination)}
          >
            Suivant
          </button>
        </td>
      </tr>
    </tfoot>
  );
}

function Row({
  organization,
}: {
  organization: {
    authorized_email_domains: string[] | null;
    cached_libelle: string | null;
    id: number | null;
    member_count: number;
    siret: string | null;
    verified_email_domains: string[] | null;
  };
}) {
  // console.log(organization);
  return (
    <tr
      _={`on click set the window's location to '${
        app_hc.legacy.organization[":id"].$url({
          param: { id: organization.id!.toString() },
        }).pathname
      }'`}
      class={row({ is_clickable: true })}
      aria-selected="false"
    >
      <td>{organization.id}</td>
      <td>{organization.siret}</td>
      <td>{date_to_string(organization.created_at)}</td>

      <td class="break-words">{organization.siret}</td>
      <td>{organization.id}</td>
      <td>➡️</td>
    </tr>
  );
}
