//

import "@hono/sentry";
import { NotAuthorized } from "@~/app.layout/NotAuthorized";
import type { Env } from "hono";
import { createMiddleware } from "hono/factory";
import type { Csp_Context } from "./csp_headers";
import type { AgentConnect_UserInfo, Session_Context } from "./session";

//

export interface UserInfo_Context extends Env {
  Variables: {
    userinfo: AgentConnect_UserInfo;
  };
}

//

export function vip_list_guard({ vip_list }: { vip_list: string[] }) {
  return createMiddleware<UserInfo_Context & Session_Context & Csp_Context>(
    async function vip_list_guard_middleware(
      { html, redirect, req, set, var: { sentry, session, nonce } },
      next,
    ) {
      const userinfo = session.get("userinfo");

      if (!userinfo) {
        return redirect("/");
      }

      sentry.setUser({
        email: userinfo.email,
        id: userinfo.sub,
        username: userinfo.given_name,
        ip_address: req.header("x-forwarded-for") ?? "",
      });

      const is_allowed = vip_list.includes(userinfo.email);
      if (!is_allowed) {
        return html(NotAuthorized({ nonce }));
      }

      set("userinfo", userinfo);

      await next();

      sentry.setUser(null);

      return Promise.resolve();
    },
  );
}
