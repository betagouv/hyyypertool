//

import { type UserInfo_Context } from ":auth/vip_list.guard";
import type { Csp_Context } from ":common/csp_headers";
import { Pagination_Schema } from ":common/schema";
import {
  Main_Layout,
  userinfo_to_username,
  type Main_Layout_Props,
} from ":ui/layout/main";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { DomainEmail_Page } from "./page";

//

const domain_emails_page_route = new Hono<UserInfo_Context & Csp_Context>()
  .use("/", jsxRenderer(Main_Layout, { docType: true }))
  .get(
    "/",
    zValidator("query", Pagination_Schema.partial()),
    function GET({ render, req, var: { nonce, userinfo } }) {
      const { page } = req.valid("query");
      const username = userinfo_to_username(userinfo);
      return render(
        <DomainEmail_Page
          pagination={{
            page: page ?? 1,
            page_size: 10,
          }}
        />,
        { nonce, username } as Main_Layout_Props,
      );
    },
  );

//
export const domain_email_router = new Hono()
  .route("", domain_emails_page_route);
