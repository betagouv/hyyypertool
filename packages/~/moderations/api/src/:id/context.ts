//

import { NotFoundError } from "@~/app.core/error";
import { schema, type MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import { and, eq } from "drizzle-orm";
import { createContext } from "hono/jsx";

//

export const RESPONSE_MESSAGE_SELECT_ID = "response-message";
export const RESPONSE_TEXTAREA_ID = "response";
export const EMAIL_SUBJECT_INPUT_ID = "mail-subject";
export const EMAIL_TO_INPUT_ID = "mail-to";

//
export const ModerationPage_Context = createContext({
  moderation: {} as get_moderation_dto,
  domain: "",
  organization_member: {} as get_organization_member_dto,
});

//

export async function get_organization_member(
  { pg }: { pg: MonComptePro_PgDatabase },
  { user_id, organization_id }: { user_id: number; organization_id: number },
) {
  return pg.query.users_organizations.findFirst({
    columns: { is_external: true, verification_type: true },
    where: and(
      eq(schema.users_organizations.user_id, user_id),
      eq(schema.users_organizations.organization_id, organization_id),
    ),
  });
}
type get_organization_member_dto = Awaited<
  ReturnType<typeof get_organization_member>
>;

//

export async function get_moderation(
  { pg }: { pg: MonComptePro_PgDatabase },
  { moderation_id }: { moderation_id: number },
) {
  const moderation = await pg.query.moderations.findFirst({
    where: eq(schema.moderations.id, moderation_id),
    with: {
      organizations: {
        columns: {
          authorized_email_domains: true,
          cached_code_postal: true,
          cached_etat_administratif: true,
          cached_libelle_activite_principale: true,
          cached_libelle_categorie_juridique: true,
          cached_libelle_tranche_effectif: true,
          cached_libelle: true,
          cached_tranche_effectifs: true,
          external_authorized_email_domains: true,
          id: true,
          siret: true,
        },
      },
      users: {
        columns: {
          created_at: true,
          email: true,
          family_name: true,
          given_name: true,
          id: true,
          job: true,
          last_sign_in_at: true,
          phone_number: true,
          sign_in_count: true,
        },
      },
    },
  });

  if (!moderation) throw new NotFoundError("Moderation not found.");
  return moderation;
}
type get_moderation_dto = Awaited<ReturnType<typeof get_moderation>>;
