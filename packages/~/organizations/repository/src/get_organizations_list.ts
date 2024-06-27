//

import { schema, type MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import { and, desc, count as drizzle_count, ilike } from "drizzle-orm";

//

export function get_organizations_list(
  pg: MonComptePro_PgDatabase,
  {
    search,
    pagination = { page: 0, take: 10 },
  }: {
    search: {
      siret?: string;
    };
    pagination?: { page: number; take: number };
  },
) {
  const { page, take } = pagination;
  const { siret } = search;

  const where = and(ilike(schema.organizations.siret, `%${siret ?? ""}%`));

  return pg.transaction(async function organization_with_count() {
    const organizations = await pg
      .select({
        authorized_email_domains: schema.organizations.authorized_email_domains,
        cached_code_officiel_geographique:
          schema.organizations.cached_code_officiel_geographique,
        cached_libelle: schema.organizations.cached_libelle,
        created_at: schema.organizations.created_at,
        external_authorized_email_domains:
          schema.organizations.external_authorized_email_domains,
        id: schema.organizations.id,
        siret: schema.organizations.siret,
        verified_email_domains: schema.organizations.verified_email_domains,
      })
      .from(schema.organizations)
      .where(where)
      .orderBy(desc(schema.organizations.created_at))
      .limit(take)
      .offset(page * take);
    const [{ value: count }] = await pg
      .select({ value: drizzle_count() })
      .from(schema.organizations)
      .where(where);
    return { organizations, count };
  });
}

export type get_organizations_list_dto = ReturnType<
  typeof get_organizations_list
>;
