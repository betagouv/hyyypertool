//

import { date_to_string } from ":common/date";
import { hx_include } from ":common/htmx";
import type { Pagination } from ":common/schema";
import { z_coerce_boolean } from ":common/z.coerce.boolean";
import type { Moderation, Organization } from ":database:moncomptepro";
import type { moncomptepro_pg_Context } from ":database:moncomptepro/middleware";
import { app_hc } from ":hc";
import { button } from ":ui/button";
import { useRequestContext } from "hono/jsx-renderer";
import { z } from "zod";
import { moderation_type_to_emoji } from "./moderation_type_to_emoji";
import { get_moderations_list } from "./repository";

//

export const MODERATION_TABLE_ID = "moderation_table";
export const MODERATION_TABLE_PAGE_ID = "moderation_table_page";
export const SEARCH_SIRET_INPUT_ID = "search_siret";
export const SEARCH_EMAIL_INPUT_ID = "search_email";
export const PROCESSED_REQUESTS_INPUT_ID = "processed_requests";
export const NON_VERIFIED_DOMAIN_INPUT_ID = "non_verified_domain";

export const Search_Schema = z.object({
  [SEARCH_SIRET_INPUT_ID]: z.string().default(""),
  [SEARCH_EMAIL_INPUT_ID]: z.string().default(""),
  [PROCESSED_REQUESTS_INPUT_ID]: z.string().pipe(z_coerce_boolean).default(""),
  [NON_VERIFIED_DOMAIN_INPUT_ID]: z.string().pipe(z_coerce_boolean).default(""),
});
export type Search = z.infer<typeof Search_Schema>;

//

export function Moderations_Page({
  pagination,
  search,
}: {
  pagination: Pagination;
  search: Search;
}) {
  return (
    <main class="fr-container my-12" hx-sync="this">
      <Filter search={search} />
      <ModerationList_Table pagination={pagination} search={search} />
    </main>
  );
}

//

function Filter({ search }: { search: Search }) {
  return (
    <form
      hx-get={app_hc.moderations.$url().pathname}
      hx-include={hx_include([
        MODERATION_TABLE_PAGE_ID,
        NON_VERIFIED_DOMAIN_INPUT_ID,
        PROCESSED_REQUESTS_INPUT_ID,
        SEARCH_EMAIL_INPUT_ID,
        SEARCH_SIRET_INPUT_ID,
      ])}
      hx-replace-url="true"
      hx-select={`#${MODERATION_TABLE_ID} > table`}
      hx-target={`#${MODERATION_TABLE_ID}`}
      hx-trigger={[
        `input from:#${NON_VERIFIED_DOMAIN_INPUT_ID}`,
        `input from:#${PROCESSED_REQUESTS_INPUT_ID}`,
        `keyup changed delay:500ms from:#${SEARCH_EMAIL_INPUT_ID}`,
        `keyup changed delay:500ms from:#${SEARCH_SIRET_INPUT_ID}`,
      ].join(", ")}
      hx-vals={JSON.stringify({ page: 0 } as Pagination)}
    >
      <div class="fr-input-group ">
        <label class="fr-label" for={SEARCH_SIRET_INPUT_ID}>
          Siret
        </label>
        <input
          class="fr-input"
          id={SEARCH_SIRET_INPUT_ID}
          name={SEARCH_SIRET_INPUT_ID}
          placeholder="Recherche par SIRET"
          value={search[SEARCH_SIRET_INPUT_ID]}
        />
      </div>
      <div class="fr-input-group ">
        <label class="fr-label" for={SEARCH_EMAIL_INPUT_ID}>
          Email
        </label>
        <input
          class="fr-input"
          id={SEARCH_EMAIL_INPUT_ID}
          name={SEARCH_EMAIL_INPUT_ID}
          placeholder="Recherche par Email"
          value={search[SEARCH_EMAIL_INPUT_ID]}
        />
      </div>
      <div class="fr-fieldset__element">
        <div class="fr-checkbox-group">
          <input
            _="on click set @value to my checked"
            id={PROCESSED_REQUESTS_INPUT_ID}
            name={PROCESSED_REQUESTS_INPUT_ID}
            value={search[PROCESSED_REQUESTS_INPUT_ID] ? "true" : "false"}
            checked={search[PROCESSED_REQUESTS_INPUT_ID]}
            type="checkbox"
          />
          <label class="fr-label" for={PROCESSED_REQUESTS_INPUT_ID}>
            Voir les demandes traitées
          </label>
        </div>
      </div>
      <div class="fr-fieldset__element">
        <div class="fr-checkbox-group">
          <input
            _="on click set @value to my checked"
            id={NON_VERIFIED_DOMAIN_INPUT_ID}
            name={NON_VERIFIED_DOMAIN_INPUT_ID}
            value={search[NON_VERIFIED_DOMAIN_INPUT_ID] ? "true" : "false"}
            checked={search[NON_VERIFIED_DOMAIN_INPUT_ID]}
            type="checkbox"
          />
          <label class="fr-label" for={NON_VERIFIED_DOMAIN_INPUT_ID}>
            Cacher les {moderation_type_to_emoji("non_verified_domain")}
          </label>
        </div>
      </div>
    </form>
  );
}

async function ModerationList_Table({
  pagination,
  search,
}: {
  pagination: Pagination;
  search: Search;
}) {
  const {
    var: { moncomptepro_pg },
  } = useRequestContext<moncomptepro_pg_Context>();
  const { page, page_size } = pagination;
  const {
    search_email,
    search_siret,
    processed_requests,
    non_verified_domain,
  } = search;
  const { count, moderations } = await get_moderations_list(moncomptepro_pg, {
    search: {
      email: search_email,
      siret: search_siret,
      show_archived: processed_requests,
      hide_non_verified_domain: non_verified_domain,
    },
    pagination: { page, take: page_size },
  });

  return (
    <div class="fr-table [&>table]:table" id={MODERATION_TABLE_ID}>
      <table>
        <thead>
          <tr>
            <th>Statut</th>
            <th>Date de création</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Organisation cible</th>
            <th>ID</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {moderations.map(({ moderations, users, organizations }) => {
            return (
              <Row moderation={{ ...moderations, users, organizations }} />
            );
          })}
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
  const last_page = Math.floor(count / page_size);

  return (
    <tfoot>
      <tr>
        <th colspan={2} class="whitespace-nowrap" scope="row">
          Showing {page * page_size}-{page * page_size + page_size} of {count}
        </th>
        <td colspan={6}>
          <button
            class={button({ class: "fr-btn--tertiary-no-outline" })}
            disabled={page <= 0}
            hx-get={app_hc.moderations.$url().pathname}
            hx-include={hx_include([
              PROCESSED_REQUESTS_INPUT_ID,
              SEARCH_EMAIL_INPUT_ID,
              SEARCH_SIRET_INPUT_ID,
            ])}
            hx-replace-url="true"
            hx-select={`#${MODERATION_TABLE_ID} > table`}
            hx-target={`#${MODERATION_TABLE_ID}`}
            hx-vals={JSON.stringify({ page: page - 1 } as Pagination)}
          >
            Précédent
          </button>
          <input
            class="fr-input inline-block w-auto"
            hx-get={app_hc.moderations.$url().pathname}
            hx-include={hx_include([
              PROCESSED_REQUESTS_INPUT_ID,
              SEARCH_EMAIL_INPUT_ID,
              SEARCH_SIRET_INPUT_ID,
            ])}
            hx-replace-url="true"
            hx-select={`#${MODERATION_TABLE_ID} > table`}
            hx-target={`#${MODERATION_TABLE_ID}`}
            id={MODERATION_TABLE_PAGE_ID}
            name={"page" as keyof Pagination}
            value={page}
          />{" "}
          <span> of {last_page}</span>
          <button
            class={button({ class: "fr-btn--tertiary-no-outline" })}
            disabled={page >= last_page}
            hx-get={app_hc.moderations.$url().pathname}
            hx-include={hx_include([
              PROCESSED_REQUESTS_INPUT_ID,
              SEARCH_EMAIL_INPUT_ID,
              SEARCH_SIRET_INPUT_ID,
            ])}
            hx-replace-url="true"
            hx-select={`#${MODERATION_TABLE_ID} > table`}
            hx-target={`#${MODERATION_TABLE_ID}`}
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
  moderation,
}: {
  moderation: Moderation & {
    users: User;
    organizations: Organization;
  };
}) {
  const { users, organizations } = moderation;
  return (
    <tr aria-selected="false" style={text_color(moderation.created_at)}>
      <td title={moderation.type}>
        {moderation_type_to_emoji(moderation.type)}
      </td>
      <td>{date_to_string(moderation.created_at)}</td>
      <td
        class="max-w-32 overflow-hidden text-ellipsis"
        title={users.family_name ?? ""}
      >
        {users.family_name}
      </td>
      <td class="break-words">{users.given_name}</td>
      <td class="max-w-48 overflow-hidden text-ellipsis" title={users.email}>
        {users.email}
      </td>
      <td class="break-words">{organizations.siret}</td>
      <td>{moderation.id}</td>
      <td>
        <a
          href={
            app_hc.legacy.moderations[":id"].$url({
              param: { id: moderation.id.toString() },
            }).pathname
          }
        >
          ➡️
        </a>
      </td>
    </tr>
  );
}

// \from https://youmightnotneed.com/date-fns#getDayOfYear
// Might want to use https://date-fns.org/v3.3.1/docs/getDayOfYear
const DAY_IN_MS = 1000 * 60 * 60 * 24;
const getDayOfYear = (date: Date) =>
  (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
    Date.UTC(date.getFullYear(), 0, 0)) /
  DAY_IN_MS;

function text_color(date: Date) {
  const diff = getDayOfYear(new Date()) - getDayOfYear(date);
  const hue = Math.floor(diff * 111).toString(10);
  const saturation = "75%";
  const lightness = "33%";
  return `color : hsl(${hue},${saturation},${lightness});`;
}
