//

import type { Pagination } from "@~/app.core/schema";
import { schema, type MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import { and, desc, count as drizzle_count, eq } from "drizzle-orm";

//

export async function get_unverified_organizations(
  pg: MonComptePro_PgDatabase,
  { pagination = { page: 0, page_size: 10 } }: { pagination?: Pagination },
) {
  const { page, page_size: take } = pagination;

  const where = and();

  return pg.transaction(async function moderation_count(tx) {
    const member_count_by_organization = tx
      .select({
        organization_id: schema.users_organizations.organization_id,
        member_count: drizzle_count(schema.users_organizations.user_id).as(
          "member_count",
        ),
      })
      .from(schema.users_organizations)
      .groupBy(schema.users_organizations.organization_id)
      .as("member_count_by_organization");
    const organizations = await tx
      .select({
        cached_libelle: schema.organizations.cached_libelle,
        created_at: schema.organizations.created_at,
        id: schema.organizations.id,
        siret: schema.organizations.siret,
        member_count: member_count_by_organization.member_count,
      })
      .from(schema.organizations)
      .fullJoin(
        member_count_by_organization,
        eq(
          member_count_by_organization.organization_id,
          schema.organizations.id,
        ),
      )
      .groupBy(
        schema.organizations.id,
        member_count_by_organization.member_count,
      )
      .limit(take)
      .offset(page * take)
      .where(where)
      .orderBy(desc(member_count_by_organization.member_count));

    const [{ value: count }] = await tx
      .select({ value: drizzle_count() })
      .from(schema.organizations)
      .where(where);
    return { organizations, count };
  });
}

export type get_unverified_organizations_dto = Awaited<
  ReturnType<typeof get_unverified_organizations>
>;
