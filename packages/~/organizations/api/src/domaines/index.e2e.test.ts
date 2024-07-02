//

import { set_config } from "@~/app.middleware/set_config";
import { set_moncomptepro_pg } from "@~/app.middleware/set_moncomptepro_pg";
import { set_nonce } from "@~/app.middleware/set_nonce";
import { set_userinfo } from "@~/app.middleware/set_userinfo";
import { empty_database, migrate, pg } from "@~/moncomptepro.database/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { Hono } from "hono";
import app from "./index";

//

beforeAll(migrate);
beforeEach(empty_database);

//

test("GET /organizations/domains", async () => {
  const response = await new Hono()
    .use(set_config({}))
    .use(set_moncomptepro_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({}))
    .route("/", app)
    .request("/");
  expect(response.status).toBe(200);
});
