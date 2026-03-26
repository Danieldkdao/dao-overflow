import { drizzle } from "drizzle-orm/neon-http";
import postgres from "postgres";
import { envServer } from "@/data/env/server";
import * as schema from "./schema";

const sql = postgres(envServer.DATABASE_URL);
export const db = drizzle({ client: sql, schema });
