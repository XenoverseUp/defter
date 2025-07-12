import { NextRequest } from "next/server";
import { getSession } from "../auth";
import type { User } from "better-auth";

type HandlerWithAuth = (user: User, req: NextRequest, params: { [key: string]: string }) => Promise<Response>;

export function withAuth(handler: HandlerWithAuth) {
  return async function (req: NextRequest, context: { params: { [key: string]: string } }): Promise<Response> {
    const session = await getSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    return handler(session.user, req, context.params);
  };
}
