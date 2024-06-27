//

import { schema, type MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import { and, asc, eq } from "drizzle-orm";

//

export async function get_duplicate_moderations(
  pg: MonComptePro_PgDatabase,
  {
    organization_id,
    user_id,
  }: {
    organization_id: number;
    user_id: number;
  },
) {
  return pg
    .select({
      id: schema.moderations.id,
      moderated_at: schema.moderations.moderated_at,
      ticket_id: schema.moderations.ticket_id,
    })
    .from(schema.moderations)
    .where(
      and(
        eq(schema.moderations.organization_id, organization_id),
        eq(schema.moderations.user_id, user_id),
      ),
    )
    .orderBy(asc(schema.moderations.created_at));
}

export type get_duplicate_moderations_dto = Awaited<
  ReturnType<typeof get_duplicate_moderations>
>;
