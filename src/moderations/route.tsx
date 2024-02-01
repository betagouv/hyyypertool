//

import { vip_list_guard, type UserInfo_Context } from ":auth/vip_list.guard";
import type { Csp_Context } from ":common/csp_headers";
import env from ":common/env";
import { Pagination_Schema } from ":common/schema";
import { Moderations_Page, Search_Schema } from ":moderations/page";
import {
  Main_Layout,
  userinfo_to_username,
  type Main_Layout_Props,
} from ":ui/layout/main";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { moderation_router } from "./:id/route";

//

const moderations_page_route = new Hono<UserInfo_Context & Csp_Context>()
  .use("/", jsxRenderer(Main_Layout, { docType: true }))
  .get(
    "/",
    zValidator("query", Search_Schema.merge(Pagination_Schema).partial()),
    function GET({ render, req, var: { nonce, userinfo } }) {
      const {
        hide_join_organization,
        hide_non_verified_domain,
        page,
        processed_requests,
        search_email,
        search_siret,
      } = req.valid("query");
      const username = userinfo_to_username(userinfo);
      return render(
        <Moderations_Page
          pagination={{
            page: page ?? 1,
            page_size: 10,
          }}
          search={{
            hide_join_organization: hide_join_organization ?? false,
            hide_non_verified_domain: hide_non_verified_domain ?? false,
            processed_requests: processed_requests ?? false,
            search_email: search_email ?? "",
            search_siret: search_siret ?? "",
          }}
        />,
        { nonce, username } as Main_Layout_Props,
      );
    },
  );

//
export const moderations_router = new Hono()
  .use("*", vip_list_guard({ vip_list: env.ALLOWED_USERS.split(",") }))
  .route("", moderations_page_route)
  .route("/:id", moderation_router);
