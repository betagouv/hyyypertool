//

import env from "@~/app.core/config";
import {
  Pool,
  drizzle,
  schema,
  type MonComptePro_PgDatabase,
} from "@~/moncomptepro.database";
import { setDatabaseConnection } from "@~/moncomptepro.lib/sdk";
import type { Env, MiddlewareHandler } from "hono";

//

export function moncomptepro_pg_database({
  connectionString,
}: {
  connectionString: string;
}): MiddlewareHandler<MonComptePro_Pg_Context> {
  const connection = new Pool({ connectionString: connectionString });
  setDatabaseConnection(connection);
  return async function moncomptepro_pg_middleware({ set }, next) {
    const moncomptepro_pg = drizzle(connection, {
      schema,
      logger: env.DEPLOY_ENV === "preview",
    });

    set("moncomptepro_pg", moncomptepro_pg);

    await next();
  };
}

//

export interface MonComptePro_Pg_Context extends Env {
  Variables: {
    moncomptepro_pg: MonComptePro_PgDatabase;
  };
}
