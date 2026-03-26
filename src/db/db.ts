import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { envServer } from "@/data/env/server";
import * as schema from "./schema";

const sql = postgres(envServer.DATABASE_URL);
export const db = drizzle({ client: sql, schema });
