//

import { zValidator } from "@hono/zod-validator";
import { Entity_Schema, Pagination_Schema } from "@~/app.core/schema";
import type { MonComptePro_Pg_Context } from "@~/app.middleware/moncomptepro_pg";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { z } from "zod";
import organization_member_router from "./:user_id";
import { MembersTable_Provider, Table } from "./Table";

//

export default new Hono<MonComptePro_Pg_Context>()
  //
  .route("/:user_id", organization_member_router)
  //

  .use("/", jsxRenderer())
  .get(
    "/",
    zValidator("param", Entity_Schema),
    zValidator("query", Pagination_Schema.extend({ describedby: z.string() })),
    async function GET({ render, req }) {
      const { id: organization_id } = req.valid("param");
      const { describedby, page, page_size } = req.valid("query");

      return render(
        <MembersTable_Provider
          value={{
            describedby,
            pagination: { page, page_size },
            organization_id,
          }}
        >
          <Table />
        </MembersTable_Provider>,
      );
    },
  );
