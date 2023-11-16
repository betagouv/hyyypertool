//

import { www } from ":www";
import staticPlugin from "@elysiajs/static";
import "@kitajs/html/register";
import Elysia from "elysia";
import { autoroutes } from "elysia-autoroutes";
import pkg from "../package.json";

//

new Elysia()
  .get("/healthz", () => `healthz check passed`)
  .get("/livez", () => `livez check passed`)
  .get("/readyz", () => `readyz check passed`)
  .use(www)
  .use(
    autoroutes({
      routesDir: "./www",
    }),
  )
  .use(staticPlugin())
  //
  .use(
    staticPlugin({
      assets: "node_modules/@gouvfr/dsfr",
      prefix: "/public/@gouvfr/dsfr",
    }),
  )
  .use(
    staticPlugin({
      assets: "node_modules/animate.css",
      prefix: "/public/animate.css",
    }),
  )
  .use(
    staticPlugin({
      assets: "node_modules/htmx.org",
      prefix: "/public/htmx.org",
    }),
  )
  .use(
    staticPlugin({
      assets: "node_modules/hyperscript.org",
      prefix: "/public/hyperscript.org",
    }),
  )
  //
  .listen(Bun.env.PORT!, (srv) => {
    console.log(
      `${pkg.name}: http://${srv.hostname}:${srv.port}\n` +
        `- Environment: ${Bun.env.NODE_ENV}\n` +
        `- Version: v${pkg.version}`,
    );
  });
