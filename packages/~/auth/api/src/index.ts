//

import { zValidator } from "@hono/zod-validator";
import env from "@~/app.core/config";
import { AuthError } from "@~/app.core/error";
import type { App_Context } from "@~/app.middleware/context";
import { type AgentConnect_UserInfo } from "@~/app.middleware/session";
import { urls } from "@~/app.urls";
import { Hono } from "hono";
import { generators } from "openid-client";
import { z } from "zod";
import { agentconnect, type Oidc_Context } from "./agentconnect";

//

export default new Hono<Oidc_Context & App_Context>()
  .onError((error, c) => {
    try {
      const session = c.get("session");
      session.deleteSession();
    } catch {
      // do not break with missing session
    }

    throw new AuthError("AgentConnect OIDC Error", { cause: error });
  })

  //

  .use("*", agentconnect())
  .post("/login", async function POST(c) {
    const session = c.get("session");
    const { req, redirect, get } = c;

    const client = get("oidc");

    const code_verifier = generators.codeVerifier();
    const state = generators.state();
    const nonce = generators.nonce();

    const redirect_uri = get_redirect_uri(req.url);

    session.set("verifier", code_verifier);
    session.set("state", state);
    session.set("nonce", nonce);

    const redirectUrl = client.authorizationUrl({
      acr_values: "eidas1",
      nonce,
      redirect_uri,
      scope: env.AGENTCONNECT_OIDC_SCOPE,
      state,
    });

    return redirect(redirectUrl);
  })
  .get(`/fake/login/callback`, ({ notFound, redirect, var: { session } }) => {
    if (env.NODE_ENV !== "development") return notFound();

    session.set("userinfo", {
      sub: "f52c691e7cc33e3116172d1115eee5e6016f0036095e9a514c86d741f364e88f",
      uid: "1",
      given_name: "Jean",
      usual_name: "User",
      email: "user@yopmail.com",
      siret: "21440109300015",
      phone_number: "0123456789",
      idp_id: "71144ab3-ee1a-4401-b7b3-79b44f7daeeb",
      idp_acr: "eidas1",
      aud: "6925fb8143c76eded44d32b40c0cb1006065f7f003de52712b78985704f39950",
      exp: 1707821864,
      iat: 1707821804,
      iss: "https://fca.integ01.dev-agentconnect.fr/api/v2",
    });
    session.set("idtoken", "");

    return redirect(urls.moderations.$url().pathname);
  })
  .get(
    `/login/callback`,
    zValidator(
      "query",
      z.object({
        code: z.string().trim(),
        state: z.string(),
      }),
    ),
    async function oidc_callback(c) {
      const session = c.get("session");
      const { redirect, req, get } = c;

      req.valid("query"); // secure request query

      const client = get("oidc");
      const params = client.callbackParams(req.url);

      const redirect_uri = get_redirect_uri(req.url);

      const tokenSet = await client.grant({
        grant_type: "authorization_code",
        code: params.code,
        redirect_uri,
        scope: env.AGENTCONNECT_OIDC_SCOPE,
      });

      const userinfo = await client.userinfo<AgentConnect_UserInfo>(
        tokenSet.access_token ?? "",
      );
      session.set("userinfo", userinfo);
      session.set("idtoken", tokenSet.id_token ?? "");

      return redirect(urls.moderations.$url().pathname);
    },
  )
  .get("/logout", ({ redirect, req, set, var: { oidc, session } }) => {
    const id_token_hint = session.get("idtoken");

    const post_logout_redirect_uri = get_logout_redirect_uri(req.url);

    const logoutUrl = oidc.endSessionUrl({
      id_token_hint,
      post_logout_redirect_uri,
    });

    session.deleteSession();
    set("userinfo", undefined as any);

    return redirect(logoutUrl);
  });

//

function get_redirect_uri(url: string) {
  const _url = new URL(url);
  const redirect_uri = `${env.HOST ? env.HOST : _url.origin}${urls.auth.login.callback.$url().pathname}`;
  return redirect_uri;
}

function get_logout_redirect_uri(url: string) {
  const _url = new URL(url);
  const redirect_uri = `${env.HOST ? env.HOST : _url.origin}`;
  return redirect_uri;
}
