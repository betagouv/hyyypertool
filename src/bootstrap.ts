//

import { csp_headers, type Csp_Context } from ":common/csp_headers";
import env from ":common/env";
// import { sentry, type Sentry_Context } from ":common/sentry";
import { hyyyyyypertool_session } from ":common/session";
import { moncomptepro_pg_database } from ":database:moncomptepro/middleware";
import legacy from ":legacy/route";
import { moderations_router } from ":moderations/route";
import { sentry } from "@hono/sentry";
import { Hono } from "hono";
import { showRoutes } from "hono/dev";
import { logger } from "hono/logger";
import Youch from "youch";
import asserts_router from "./assets/route";
import auth_router from "./auth/route";
import { readyz } from "./health/readyz/route";
import { NotFound } from "./not-found";
import { proxy } from "./proxy/route";
import welcome_router from "./welcome/route";

const app = new Hono<Csp_Context>()
  .use("*", logger())
  .use("*", csp_headers())
  .use(
    "*",
    sentry({
      debug: env.DEPLOY_ENV === "preview",
      dsn: env.SENTRY_DNS,
      environment: env.DEPLOY_ENV,
      release: env.VERSION,
      initialScope: {
        tags: { NODE_ENV: env.NODE_ENV, HOST: env.HOST, GIT_SHA: env.GIT_SHA },
      },
    }),
  )

  // import { compress } from 'hono/compress'
  // app.use("*", compress());  `CompressionStream` is not yet supported in bun.

  .get("/healthz", ({ text }) => text(`healthz check passed`))
  .get("/livez", ({ text }) => text(`livez check passed`))
  .route("/readyz", readyz)
  .route("", proxy)

  //

  .route("", asserts_router)
  .route("", auth_router)
  .use("*", hyyyyyypertool_session)
  .route("", welcome_router)
  .use("*", moncomptepro_pg_database({ connectionString: env.DATABASE_URL }))
  .route("/moderations", moderations_router)
  .route("", legacy)
  .notFound(async ({ html, var: { nonce } }) => {
    return html(NotFound({ nonce }), 404);
  })
  .onError(async (error, { html, req, var: { sentry } }) => {
    sentry.captureException(error);
    const youch = new Youch(error, req.raw);
    return html(await youch.toHTML(), 500);
  });

//

if (env.DEPLOY_ENV === "preview") {
  showRoutes(app);
}

console.debug("- NODE_ENV " + env.NODE_ENV);
console.debug("- DEPLOY_ENV " + env.DEPLOY_ENV);
console.debug("- VERSION " + env.VERSION);
console.debug("- GIT_SHA " + env.GIT_SHA);

//

export type Router = typeof app;
export default app;
