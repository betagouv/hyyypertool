//

import { zValidator } from "@hono/zod-validator";
import { Entity_Schema, Pagination_Schema } from "@~/app.core/schema";
import { Main_Layout } from "@~/app.layout";
import type { App_Context } from "@~/app.middleware/context";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import user_page_route from "./:id/index";
import domains_router from "./domaines";
import leaders_router from "./leaders";
import Organizations_Page, {
  SEARCH_SIRET_INPUT_ID,
  Search_Schema,
} from "./page";

//

export default new Hono<App_Context>()
  .route("/leaders", leaders_router)
  .route("/domains", domains_router)
  .route("/:id", user_page_route)
  .use("/", jsxRenderer(Main_Layout))
  .get(
    "/",
    zValidator(
      "query",
      Pagination_Schema.merge(Search_Schema).merge(Entity_Schema.partial()),
    ),
    function GET({ render, req }) {
      const { page, [SEARCH_SIRET_INPUT_ID]: siret } = req.valid("query");

      return render(
        <Organizations_Page
          pagination={{
            page: page,
            page_size: 10,
          }}
          search={{ [SEARCH_SIRET_INPUT_ID]: siret ?? "" }}
        />,
      );
    },
  );
