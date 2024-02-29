//

import {
  date_to_dom_string,
  date_to_string,
} from "@~/app.core/date/date_format";
import { hx_include } from "@~/app.core/htmx";
import type { Pagination } from "@~/app.core/schema";
import type { MonComptePro_Pg_Context } from "@~/app.middleware/moncomptepro_pg";
import { button } from "@~/app.ui/button";
import { row } from "@~/app.ui/table";
import { hx_urls, urls } from "@~/app.urls";
import {
  moderation_type_to_emoji,
  moderation_type_to_title,
} from "@~/moderations.lib/moderation_type.mapper";
import { get_moderations_list } from "@~/moderations.repository/get_moderations_list";
import type { Moderation, Organization, User } from "@~/moncomptepro.database";
import { useContext } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";
import Moderations_Context, {
  MODERATION_TABLE_ID,
  Page_Query,
  type Search,
} from "./context";

//

const page_query_keys = Page_Query.keyof();
const MODERATION_TABLE_PAGE_ID = "moderation_table_page";

const hx_moderations_query_props = {
  ...hx_urls.moderations.$get({ query: {} }),
  "hx-include": hx_include([
    MODERATION_TABLE_PAGE_ID,
    page_query_keys.enum.hide_join_organization,
    page_query_keys.enum.hide_non_verified_domain,
    page_query_keys.enum.processed_requests,
    page_query_keys.enum.search_email,
    page_query_keys.enum.search_siret,
    page_query_keys.enum.day,
  ]),
  "hx-replace-url": true,
  "hx-select": `#${MODERATION_TABLE_ID} > table`,
  "hx-target": `#${MODERATION_TABLE_ID}`,
};

export function Moderations_Page({
  pagination,
  search,
}: {
  pagination: Pagination;
  search: Search;
}) {
  const {
    var: { moncomptepro_pg },
  } = useRequestContext<MonComptePro_Pg_Context>();
  const { page, page_size } = pagination;
  const {
    day: date,
    hide_join_organization,
    hide_non_verified_domain,
    processed_requests,
    search_email,
    search_siret,
  } = search;
  const query_moderations_list = get_moderations_list(moncomptepro_pg, {
    search: {
      created_at: date,
      email: search_email,
      siret: search_siret,
      show_archived: processed_requests,
      hide_non_verified_domain,
      hide_join_organization,
    },
    pagination: { page: page - 1, take: page_size },
  });
  return (
    <Moderations_Context.Provider
      value={{
        pagination,
        query_moderations_list,
      }}
    >
      <main
        class="fr-container my-12"
        {...hx_moderations_query_props}
        hx-sync="this"
        hx-trigger={[
          `every 11s [document.visibilityState === 'visible']`,
          `visibilitychange[document.visibilityState === 'visible'] from:document`,
        ].join(", ")}
      >
        <h1>Liste des moderations</h1>
        <Filter search={search} />
        <ModerationList_Table />
      </main>
    </Moderations_Context.Provider>
  );
}

//

function Filter({ search }: { search: Search }) {
  const on_search_show_processed_requests = `
  on keyup
    if no my value
      return false
    end

    set #${page_query_keys.enum.processed_requests}.checked to "checked"
    set #${page_query_keys.enum.processed_requests}.value to "true"
  `;
  return (
    <form
      {...hx_moderations_query_props}
      hx-trigger={[
        `input from:#${page_query_keys.enum.day}`,
        `input from:#${page_query_keys.enum.hide_join_organization}`,
        `input from:#${page_query_keys.enum.hide_non_verified_domain}`,
        `input from:#${page_query_keys.enum.processed_requests}`,
        `keyup changed delay:500ms from:#${page_query_keys.enum.search_email}`,
        `keyup changed delay:500ms from:#${page_query_keys.enum.search_siret}`,
      ].join(", ")}
      hx-vals={JSON.stringify({ page: 1 } as Pagination)}
    >
      <div className="grid grid-cols-2 gap-6">
        <div class="fr-input-group ">
          <label class="fr-label" for={page_query_keys.enum.search_email}>
            Email
          </label>
          <input
            _={on_search_show_processed_requests}
            class="fr-input"
            id={page_query_keys.enum.search_email}
            name={page_query_keys.enum.search_email}
            placeholder="Recherche par Email"
            value={search.search_email}
          />
        </div>
        <div class="fr-input-group ">
          <label class="fr-label" for={page_query_keys.enum.search_siret}>
            Siret
          </label>
          <input
            _={on_search_show_processed_requests}
            class="fr-input"
            id={page_query_keys.enum.search_siret}
            name={page_query_keys.enum.search_siret}
            placeholder="Recherche par SIRET"
            value={search.search_siret}
          />
        </div>
      </div>
      <div class="fr-fieldset__element">
        <div class="fr-checkbox-group">
          <input
            _="on click set @value to my checked"
            id={page_query_keys.enum.processed_requests}
            name={page_query_keys.enum.processed_requests}
            value={search.processed_requests ? "true" : "false"}
            checked={search.processed_requests}
            type="checkbox"
          />
          <label class="fr-label" for={page_query_keys.enum.processed_requests}>
            Voir les demandes traitées
          </label>
        </div>
      </div>
      <div class="fr-fieldset__element">
        <div class="fr-checkbox-group">
          <input
            _="on click set @value to my checked"
            id={page_query_keys.enum.hide_non_verified_domain}
            name={page_query_keys.enum.hide_non_verified_domain}
            value={search.hide_non_verified_domain ? "true" : "false"}
            checked={search.hide_non_verified_domain}
            type="checkbox"
          />
          <label
            class="fr-label"
            for={page_query_keys.enum.hide_non_verified_domain}
          >
            Cacher les {moderation_type_to_emoji("non_verified_domain")}{" "}
            {moderation_type_to_title("non_verified_domain")}
          </label>
        </div>
      </div>
      <div class="fr-fieldset__element">
        <div class="fr-checkbox-group">
          <input
            _="on click set @value to my checked"
            id={page_query_keys.enum.hide_join_organization}
            name={page_query_keys.enum.hide_join_organization}
            value={search.hide_join_organization ? "true" : "false"}
            checked={search.hide_join_organization}
            type="checkbox"
          />
          <label
            class="fr-label"
            for={page_query_keys.enum.hide_join_organization}
          >
            Cacher les
            {moderation_type_to_emoji("organization_join_block")}{" "}
            {moderation_type_to_title("organization_join_block")}
          </label>
        </div>
      </div>
      <div class="fr-fieldset__element">
        <div class="fr-input-group">
          <label class="fr-label" for={page_query_keys.enum.day}>
            Filtrer par jours
          </label>
          <input
            class="fr-input"
            id={page_query_keys.enum.day}
            max={date_to_dom_string(new Date())}
            name={page_query_keys.enum.day}
            type="date"
            value={date_to_dom_string(search.day)}
          />
        </div>
      </div>
    </form>
  );
}

async function ModerationList_Table() {
  const { pagination, query_moderations_list } =
    useContext(Moderations_Context);
  const { count, moderations } = await query_moderations_list;
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
          {moderations.map(({ moderations, users, organizations }) => (
            <Row
              key={moderations.id.toString()}
              moderation={{ ...moderations, users, organizations }}
            />
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
            {...hx_moderations_query_props}
            hx-vals={JSON.stringify({ page: page - 1 } as Pagination)}
          >
            Précédent
          </button>
          <input
            class="fr-input inline-block w-auto"
            {...hx_moderations_query_props}
            id={MODERATION_TABLE_PAGE_ID}
            name={page_query_keys.enum.page}
            value={page}
          />{" "}
          <span> of {last_page}</span>
          <button
            class={button({ class: "fr-btn--tertiary-no-outline" })}
            disabled={page >= last_page}
            {...hx_moderations_query_props}
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
  key,
  moderation,
}: {
  key?: string;
  moderation: Moderation & {
    users: User;
    organizations: Organization;
  };
}) {
  const { users, organizations } = moderation;
  return (
    <tr
      key={key}
      _={`on click set the window's location to '${
        urls.moderations[":id"].$url({
          param: { id: moderation.id.toString() },
        }).pathname
      }'`}
      class={row({ is_clickable: true })}
      aria-selected="false"
      style={text_color(moderation.created_at)}
    >
      <td title={moderation.type}>
        {moderation_type_to_emoji(moderation.type)}
        {moderation_type_to_title(moderation.type)}
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
        {moderation.moderated_at ? (
          <time
            datetime={moderation.moderated_at.toISOString()}
            title={moderation.moderated_at.toString()}
          >
            ✅
          </time>
        ) : (
          "➡️"
        )}
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
