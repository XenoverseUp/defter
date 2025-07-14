import type { AppType } from "@/app/api/[[...hono]]/route";
import { hc } from "hono/client";

const client = hc<AppType>("http://localhost:3000/");

export const api = client.api;
