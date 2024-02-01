//

import { vip_list_guard } from ":auth/vip_list.guard";
import env from ":common/env";
import { Hono } from "hono";
import { domain_email_router } from "./domain_email/route";

//

export default new Hono()
  .use("*", vip_list_guard({ vip_list: env.ALLOWED_USERS.split(",") }))
  .route("/domain_emails", domain_email_router);
// .route("/:id", organization_router)
