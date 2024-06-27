//

import {
  create_red_diamond_user,
  create_unicorn_organization,
} from "@~/moncomptepro.database/seed/unicorn";
import {
  add_moderation,
  empty_database,
  migrate,
  pg,
} from "@~/moncomptepro.database/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { get_duplicate_moderations } from "./get_duplicate_moderations";

//

beforeAll(migrate);
beforeEach(empty_database);

test("returns duplicate moderations", async () => {
  const unicorn_organization_id = await create_unicorn_organization(pg);
  const red_diamond_user_id = await create_red_diamond_user(pg);
  const [{ id: first_moderation_id }] = await add_moderation({
    organization_id: unicorn_organization_id,
    user_id: red_diamond_user_id,
    type: "🤶",
  });
  const [{ id: second_moderation_id }] = await add_moderation({
    organization_id: unicorn_organization_id,
    user_id: red_diamond_user_id,
    type: "🤶",
  });

  const emails = await get_duplicate_moderations(pg, {
    organization_id: unicorn_organization_id,
    user_id: red_diamond_user_id,
  });

  expect(emails).toEqual([
    {
      id: first_moderation_id,
      moderated_at: null,
      ticket_id: null,
    },
    {
      id: second_moderation_id,
      moderated_at: null,
      ticket_id: null,
    },
  ]);
});
