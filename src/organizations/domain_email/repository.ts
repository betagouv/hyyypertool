//

import { schema } from ":database:moncomptepro";
import {
  and,
  arrayContained,
  desc,
  count as drizzle_count,
  eq,
  not,
} from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

//

export function get_unverified_domain_emails_list(
  pg: NodePgDatabase<typeof schema>,
  {
    pagination = { page: 0, take: 10 },
  }: {
    pagination?: { page: number; take: number };
  },
) {
  const { page, take } = pagination;

  const where = and(
    not(
      arrayContained(
        schema.organizations.authorized_email_domains,
        schema.organizations.verified_email_domains,
      ),
    ),
  );

  return pg.transaction(async function moderation_count() {
    const members = pg
      .select({
        member_count: drizzle_count().as("member_count"),
        organization_id: schema.users_organizations.organization_id,
      })
      .from(schema.users_organizations)
      .groupBy(schema.users_organizations.organization_id)
      .as("org_with_count");

    const organizations = await pg
      .select({
        authorized_email_domains: schema.organizations.authorized_email_domains,
        cached_libelle: schema.organizations.cached_libelle,
        id: schema.organizations.id,
        member_count: members.member_count,
        siret: schema.organizations.siret,
        verified_email_domains: schema.organizations.verified_email_domains,
      })
      .from(schema.organizations)
      .where(where)
      .fullJoin(members, eq(schema.organizations.id, members.organization_id))
      .orderBy(desc(members.member_count))
      .limit(take)
      .offset(page * take);
    const [{ value: count }] = await pg
      .select({ value: drizzle_count() })
      .from(schema.organizations)
      .fullJoin(
        schema.users_organizations,
        eq(schema.organizations.id, schema.users_organizations.organization_id),
      )
      .where(where);
    return { organizations, count };
  });
}
