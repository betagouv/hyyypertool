//

import { ASSETS_PATH } from ":assets/config";
import env from ":common/env.ts";
import { version } from ":package.json";
import { html } from "hono/html";
import type { Child } from "hono/jsx";

//

export function Root_Layout({ children }: { children?: Child }) {
  return html`
    <html lang="fr" data-fr-scheme="system" hx-ext="debug,chunked-transfer">
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#000091" />

        <link
          rel="apple-touch-icon"
          href="${ASSETS_PATH}/node_modules/@gouvfr/dsfr/dist/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          href="${ASSETS_PATH}/node_modules/@gouvfr/dsfr/dist/favicon/favicon.svg"
          type="image/svg+xml"
        />
        <link
          rel="shortcut icon"
          href="${ASSETS_PATH}/node_modules/@gouvfr/dsfr/dist/favicon/favicon.ico"
          type="image/x-icon"
        />
        <link
          rel="manifest"
          href="${ASSETS_PATH}/node_modules/@gouvfr/dsfr/dist/favicon/manifest.webmanifest"
          crossorigin="use-credentials"
        />

        <!--  -->

        <link
          rel="stylesheet"
          href="${ASSETS_PATH}/node_modules/animate.css/source/_vars.css"
        />

        <!--  -->

        <link
          rel="stylesheet"
          href="${ASSETS_PATH}/node_modules/@gouvfr/dsfr/dist/dsfr/dsfr.css"
        />

        <!--  -->

        <link
          rel="stylesheet"
          href="${ASSETS_PATH}/public/assets/tailwind.css"
        />

        <!--  -->

        <script type="importmap" type="application/json">
          {
            "imports": {
              ":common/env.ts": "${ASSETS_PATH}/bundle/env.js",
              "lit": "${ASSETS_PATH}/bundle/lit.js",
              "lit/": "${ASSETS_PATH}/bundle/lit/"
            }
          }
        </script>

        <title>
          H${Array.from({ length: Math.max(3, Math.random() * 5) })
            .fill("y")
            .join("") + "pertool"}
        </title>
      </head>
      <body class="flex min-h-screen flex-col" hx-ext="include-vals">
        <div class="flex flex-1 flex-col">${children}</div>
        <footer class="container mx-auto flex flex-row justify-between p-2">
          <div>© ${new Date().getFullYear()} 🇫🇷</div>
          <a
            href=${`https://github.com/betagouv/hyyypertool/tree/${
              env.VERSION === version ? "v" : ""
            }${env.VERSION}`}
            rel="noopener noreferrer"
            target="_blank"
            safe
          >
            v${env.VERSION}
          </a>
        </footer>
      </body>

      <!--  -->

      <script
        type="module"
        src="${ASSETS_PATH}/node_modules/htmx.org/dist/htmx.js"
      ></script>

      <meta
        name="htmx-config"
        content='{"historyEnabled":true,"defaultSettleDelay":0}'
      />

      ${env.DEPLOY_ENV === "preview"
        ? html`<script
            type="module"
            src="${ASSETS_PATH}/node_modules/htmx.org/dist/ext/debug.js"
          ></script>`
        : ""}

      <script
        type="module"
        src="${ASSETS_PATH}/node_modules/htmx.org/dist/ext/include-vals.js"
      ></script>
      <script
        type="module"
        src="${ASSETS_PATH}/node_modules/htmx.org/dist/ext/sse.js"
      ></script>
      <script
        type="module"
        src="${ASSETS_PATH}/node_modules/htmx.ext...chunked-transfer/dist/index.js"
      ></script>

      <!--  -->

      <script
        type="module"
        src="${ASSETS_PATH}/node_modules/hyperscript.org/dist/_hyperscript.min.js"
      ></script>
    </html>
  `;
}
