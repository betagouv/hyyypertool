//

import env from "@~/app.core/config";
import { cache_immutable } from "@~/app.middleware/cache_immutable";
import zammad_attachment_router from "@~/zammad.api";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { rewriteAssetRequestPath } from "./rewrite";

//

export default new Hono()
  .use("*", cache_immutable)
  .use(
    "/node_modules/*",
    serveStatic({
      rewriteRequestPath: rewriteAssetRequestPath,
    }),
  )
  .use(
    "/public/*",
    serveStatic({
      rewriteRequestPath: rewriteAssetRequestPath,
    }),
  )
  .get("/bundle/config.js", async ({ text }) => {
    const { ASSETS_PATH, VERSION } = env;
    return text(
      `export default ${JSON.stringify({ ASSETS_PATH, VERSION })}`,
      200,
      {
        "content-type": "text/javascript",
      },
    );
  })
  .get("/bundle/env.js", async ({ text }) => {
    const { VERSION } = env;
    return text(`export default ${JSON.stringify({ VERSION })}`, 200, {
      "content-type": "text/javascript",
    });
  })
  .get("/bundle/lit.js", async () => {
    const {
      outputs: [output],
    } = await Bun.build({
      entrypoints: [Bun.resolveSync(`lit`, process.cwd())],
      minify: env.NODE_ENV === "production",
    });
    return new Response(output);
  })
  .get("/bundle/lit/*", async ({ req }) => {
    const url = new URL(req.url);
    const filename = decodeURI(rewriteAssetRequestPath(url.pathname)).replace(
      "/bundle/lit/",
      "",
    );

    const {
      outputs: [output],
    } = await Bun.build({
      entrypoints: [Bun.resolveSync(`lit/${filename}`, process.cwd())],
      minify: env.NODE_ENV === "production",
    });

    return new Response(output);
  })
  .route("/zammad", zammad_attachment_router);