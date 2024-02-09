//

import type { MCP_Moderation } from ":moncomptepro";
import * as schema from "../drizzle/schema";
import type { MonComptePro_PgDatabase } from "../moncomptepro_pg";

//

export async function insert_database(db: MonComptePro_PgDatabase) {
  try {
    const raphael = await insert_raphael(db);
    console.log(`🌱 INSERT user Raphael Dubigny`);
    const jeanbon = await insert_jeanbon(db);
    console.log(`🌱 INSERT user Jean Bon`);

    //

    const dinum = await insert_dinum(db);
    console.log(`🌱 INSERT organization DINUM`);
    const abracadabra = await insert_abracadabra(db);
    console.log(`🌱 INSERT organization Abracadabra`);

    //

    const raphael_dinum = await insert_users_organizations(db, {
      organization_id: dinum.id,
      user_id: raphael.id,
    });
    console.log(
      `🌱 ${raphael_dinum.command} ${raphael_dinum.rowCount} Raphael join DINUM`,
    );

    //

    const jeanbon_dinum = await insert_moderation(db, {
      organization_id: dinum.id,
      type: "organization_join_block" as MCP_Moderation["type"],
      user_id: jeanbon.id,
    });
    console.log(
      `🌱 ${jeanbon_dinum.command} ${jeanbon_dinum.rowCount} Jean wants to join DINUM`,
    );

    const jeanbon_abracadabra = await insert_moderation(db, {
      organization_id: abracadabra.id,
      type: "organization_join_block" as MCP_Moderation["type"],
      user_id: jeanbon.id,
    });
    console.log(
      `🌱 ${jeanbon_abracadabra.command} ${jeanbon_abracadabra.rowCount} Jean wants to join Abracadabra`,
    );
  } catch (err) {
    console.error("Something went wrong...");
    console.error(err);
  }
}

//

function insert_moderation(
  db: MonComptePro_PgDatabase,
  insert_moderation: typeof schema.moderations.$inferInsert,
) {
  return db.insert(schema.moderations).values(insert_moderation);
}

function insert_users_organizations(
  db: MonComptePro_PgDatabase,
  insert_users_organizations: typeof schema.users_organizations.$inferInsert,
) {
  return db
    .insert(schema.users_organizations)
    .values(insert_users_organizations);
}

async function insert_jeanbon(db: MonComptePro_PgDatabase) {
  const insert = await db
    .insert(schema.users)
    .values({
      created_at: new Date("2018-07-13 15:35:15"),
      email: "jeanbon@yopmail.com",
      family_name: "Bon",
      given_name: "Jean",
      job: "Boucher",
      phone_number: "0123456789",
      updated_at: new Date("2023-06-22 14:34:34"),
      verify_email_sent_at: new Date("2023-06-22 14:34:34"),
    })
    .returning();

  return insert.at(0)!;
}

async function insert_raphael(db: MonComptePro_PgDatabase) {
  const insert = await db
    .insert(schema.users)
    .values({
      created_at: new Date("2018-07-13 15:35:15"),
      email: "rdubigny@beta.gouv.fr",
      family_name: "Dubigny",
      given_name: "Raphael",
      job: "Chef",
      phone_number: "0123456789",
      updated_at: new Date("2023-06-22 14:34:34"),
      verify_email_sent_at: new Date("2023-06-22 14:34:34"),
    })
    .returning();

  return insert.at(0)!;
}

//

async function insert_abracadabra(db: MonComptePro_PgDatabase) {
  const insert = await db
    .insert(schema.organizations)
    .values({
      authorized_email_domains: ["yopmail.com"],
      cached_activite_principale:
        "90.02Z - Activités de soutien au spectacle vivant",
      cached_categorie_juridique:
        "Société à responsabilité limitée (sans autre indication)",
      cached_etat_administratif: "A",
      cached_libelle_tranche_effectif: "10 à 19 salariés, en 2019",
      cached_libelle: "Abracadabra",
      cached_nom_complet: "Abracadabra (ABRACADABRA)",
      cached_tranche_effectifs: "11",
      created_at: new Date("2022-08-08T15:43:15.501Z"),
      external_authorized_email_domains: [],
      siret: "51935970700022",
      trackdechets_email_domains: [],
      updated_at: new Date("2022-08-08T15:43:15.501Z"),
      organization_info_fetched_at: new Date("2022-08-08T15:43:15.501Z"),
      verified_email_domains: [],
    })
    .returning();
  return insert.at(0)!;
}

async function insert_dinum(db: MonComptePro_PgDatabase) {
  const insert = await db
    .insert(schema.organizations)
    .values({
      authorized_email_domains: ["beta.gouv.fr", "modernisation.gouv.fr"],
      cached_activite_principale: "84.11Z - Administration publique générale",
      cached_categorie_juridique: "Service central d'un ministère",
      cached_code_officiel_geographique: "75107",
      cached_etat_administratif: "A",
      cached_libelle_tranche_effectif: "100 à 199 salariés, en 2021",
      cached_libelle: "DINUM",
      cached_nom_complet: "Direction interministerielle du numerique (DINUM)",
      cached_tranche_effectifs: "22",
      created_at: new Date("2018-07-13 15:35:15"),
      external_authorized_email_domains: ["prestataire.modernisation.gouv.fr"],
      siret: "13002526500013",
      trackdechets_email_domains: [],
      updated_at: new Date("2023-06-22 14:34:34"),
      verified_email_domains: ["beta.gouv.fr", "modernisation.gouv.fr"],
    })
    .returning();
  return insert.at(0)!;
}
