//

import type { MonComptePro_Pg_Context } from "@~/app.middleware/moncomptepro_pg";
import { get_emails_by_organization_id } from "@~/users.repository/get_emails_by_organization_id";
import { useRequestContext } from "hono/jsx-renderer";
import { dedent } from "ts-dedent";
import { usePageRequestContext } from "../context";

export const label = "Vous possédez déjà un compte MonComptePro";

export default async function template() {
  const {
    var: { moderation },
  } = usePageRequestContext();

  const {
    var: { moncomptepro_pg },
  } = useRequestContext<MonComptePro_Pg_Context>();

  const members_email = await get_emails_by_organization_id(moncomptepro_pg, {
    organization_id: moderation.organization.id,
    family_name: moderation.user.family_name ?? "",
  });

  return dedent`
    Bonjour,

    Votre demande pour rejoindre l'organisation « ${moderation.organization.cached_libelle} » a été prise en compte sur https://app.moncomptepro.beta.gouv.fr.

    Vous possédez déjà un compte MonComptePro :

    - ${members_email.map(({ email }) => email).join("\n- ")}

    Merci de bien vouloir vous connecter avec le compte déjà existant.

    Je reste à votre disposition pour tout complément d'information.

    Excellente journée,
    L’équipe MonComptePro.
  `;
}
