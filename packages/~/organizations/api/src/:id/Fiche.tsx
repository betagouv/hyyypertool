//

import { LocalTime } from "@~/app.ui/time/LocalTime";
import type { Organization } from "@~/moncomptepro.database";

//

export function Fiche({ organization }: { organization: Organization }) {
  return (
    <ul>
      <li>
        Creation de l'organisation :{" "}
        <b>
          <LocalTime date={organization.created_at} />
        </b>
      </li>
      <li>
        Dernière mise à jour :{" "}
        <b>
          <LocalTime date={organization.updated_at} />
        </b>
      </li>
      <li>
        Dénomination : <b>{organization.cached_libelle}</b>
      </li>
      <li>
        Nom complet : <b>{organization.cached_nom_complet}</b>
      </li>
      <li>
        NAF/APE : <b>{organization.cached_activite_principale}</b>
      </li>
      <li>
        Tranche d'effectif :{" "}
        <b>{organization.cached_libelle_tranche_effectif}</b> (code :{" "}
        {organization.cached_tranche_effectifs}) (
        <a
          href="https://www.sirene.fr/sirene/public/variable/tefen"
          rel="noopener noreferrer"
          target="_blank"
        >
          liste code effectif INSEE
        </a>
        )
      </li>
      <li>
        État administratif : <b>{organization.cached_etat_administratif}</b> (
        <a
          href="https://www.sirene.fr/sirene/public/variable/etatAdministratifEtablissement"
          rel="noopener noreferrer"
          target="_blank"
        >
          liste état administratif INSEE
        </a>
        )
      </li>
      <li>
        id : <b>{organization.id}</b>
      </li>
      <li>
        siret : <b>{organization.siret}</b> (
        <a
          href={`https://annuaire-entreprises.data.gouv.fr/entreprise/${organization.siret}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          Voir la fiche annuaire entreprise de cette organisation
        </a>
        )
      </li>
    </ul>
  );
}
