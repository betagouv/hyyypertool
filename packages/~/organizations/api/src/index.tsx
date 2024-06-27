//

import { zValidator } from "@hono/zod-validator";
import { Main_Layout, userinfo_to_username } from "@~/app.layout";
import type { Csp_Context } from "@~/app.middleware/csp_headers";
import type { UserInfo_Context } from "@~/app.middleware/vip_list.guard";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import user_page_route from "./:id/index";
import leaders_router from "./leaders";
import Organizations_Page from "./page";
import query from "./query";

//

export default new Hono<Csp_Context & UserInfo_Context>()
  .route("/leaders", leaders_router)
  .route("/:id", user_page_route)
  .use("/", jsxRenderer(Main_Layout))
  .get(
    "/",
    zValidator("query", query),
    function GET({ render, req, var: { nonce, userinfo } }) {
      const { page_size, page, q } = req.valid("query");

      const username = userinfo_to_username(userinfo);

      return render(
        <Organizations_Page
          pagination={{
            page,
            page_size,
          }}
          search={{ q }}
        />,
        {
          nonce,
          username,
        },
      );
    },
  );
