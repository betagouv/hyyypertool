//

import { zValidator } from "@hono/zod-validator";
import { hyper_ref } from "@~/app.core/html";
import { hx_include } from "@~/app.core/htmx";
import { Pagination_Schema } from "@~/app.core/schema";
import { Main_Layout } from "@~/app.layout";
import type { App_Context } from "@~/app.middleware/context";
import { Foot } from "@~/app.ui/hx_table";
import { LocalTime } from "@~/app.ui/time/LocalTime";
import { hx_urls, urls } from "@~/app.urls";
import {
  get_unverified_organizations,
  type get_unverified_organizations_dto,
} from "@~/organizations.repository/get_unverified_organizations";
import consola from "consola";
import { Hono, type Env, type InferRequestType } from "hono";
import { jsxRenderer, useRequestContext } from "hono/jsx-renderer";
import { match } from "ts-pattern";

//

type RequestType = InferRequestType<typeof urls.organizations.domains.$get>;
interface DataLayerType extends Env {
  Variables: {
    query_organizations: typeof get_unverified_organizations;
  };
}
type ContextType = App_Context & DataLayerType;

type InputType = {
  out: RequestType;
};
const usePageRequestContext = useRequestContext<ContextType, any, InputType>;

const PageInput_Schema = Pagination_Schema;
const $table = hyper_ref();
const hx_domains_query_props = {
  ...(await hx_urls.organizations.domains.$get({ query: {} })),
  "hx-include": hx_include([$table, PageInput_Schema.keyof().enum.page]),
  "hx-replace-url": true,
  "hx-select": `#${$table} > table`,
  "hx-target": `#${$table}`,
};

//

export default new Hono<ContextType>().use("/", jsxRenderer(Main_Layout)).get(
  "/",
  ({ set }, next) => {
    set("query_organizations", get_unverified_organizations);
    return next();
  },
  zValidator("query", PageInput_Schema, function hook(result, { redirect }) {
    if (result.success) return undefined;
    consola.error(result.error);
    return redirect(urls.organizations.domains.$url().pathname);
  }),
  async function GET({ render }) {
    return render(<Page />);
  },
);

//

async function Page() {
  return (
    <main
      class="fr-container my-12"
      {...hx_domains_query_props}
      hx-sync="this"
      hx-trigger={[
        `load delay:1s`,
        `every 11s [document.visibilityState === 'visible']`,
        `visibilitychange[document.visibilityState === 'visible'] from:document`,
      ].join(", ")}
    >
      <h1>Liste des domaines à vérifier</h1>
      <Table />
    </main>
  );
}

async function Table() {
  const {
    req,
    var: { query_organizations, moncomptepro_pg },
  } = usePageRequestContext();

  const pagination = match(
    Pagination_Schema.safeParse(req.query(), { path: ["req.query()"] }),
  )
    .with({ success: true }, ({ data }) => data)
    .otherwise(() => Pagination_Schema.parse({}));

  const { count, organizations } = await query_organizations(moncomptepro_pg, {
    pagination: { ...pagination, page: pagination.page - 1 },
  });

  return (
    <div class="fr-table [&>table]:table" id={$table}>
      <table>
        <thead>
          <tr>
            <th>Date de création</th>
            <th>Siret</th>
            <th>Dénomination</th>
            <th>Nombre de membres</th>
            <th>ID</th>
          </tr>
        </thead>
        <tbody>
          {organizations.map((organization) => (
            <Row key={`${organization.id}`} organization={organization} />
          ))}
        </tbody>
        <Foot
          count={count}
          hx_query_props={hx_domains_query_props}
          id={$table}
          name={PageInput_Schema.keyof().enum.page}
          pagination={pagination}
        />
      </table>
    </div>
  );
}

function Row({
  key,
  organization,
}: {
  key?: string;
  organization: get_unverified_organizations_dto["organizations"][number];
}) {
  return (
    <tr key={key}>
      <td>
        <LocalTime date={organization.created_at} />
      </td>
      <td>{organization.siret}</td>
      <td>{organization.cached_libelle}</td>
      <td>{organization.member_count}</td>
      <td>{organization.id}</td>
    </tr>
  );
}
