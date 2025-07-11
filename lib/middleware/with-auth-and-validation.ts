import { getSession } from "@/lib/auth";
import type { NextRequest } from "next/server";
import type { ZodType, infer as zInfer } from "zod";

type ValidationSchemas<PS extends ZodType<unknown> | undefined, BS extends ZodType<unknown> | undefined> = {
  params?: PS;
  body?: BS;
};

type ValidatedData<PS extends ZodType<unknown> | undefined, BS extends ZodType<unknown> | undefined> = {
  params: PS extends ZodType<unknown> ? zInfer<PS> : undefined;
  body: BS extends ZodType<unknown> ? zInfer<BS> : undefined;
};

type Handler<PS extends ZodType<unknown> | undefined = undefined, BS extends ZodType<unknown> | undefined = undefined> =
  BS extends ZodType<unknown>
    ? (
        user: any,
        req: NextRequest,
        validated: { params: PS extends ZodType<unknown> ? zInfer<PS> : undefined; body: zInfer<BS> },
      ) => Promise<Response>
    : (
        user: any,
        req: NextRequest,
        validated: { params: PS extends ZodType<unknown> ? zInfer<PS> : undefined; body: undefined },
      ) => Promise<Response>;

export function withAuthAndValidation<
  PS extends ZodType<unknown> | undefined = undefined,
  BS extends ZodType<unknown> | undefined = undefined,
>(schemas: ValidationSchemas<PS, BS>, handler: Handler<PS, BS>) {
  return async function (req: NextRequest, context: { params: { [key: string]: string } }): Promise<Response> {
    const session = await getSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }
    const user = session.user;

    let validatedParams: any = context.params;
    if (schemas.params) {
      const paramsResult = schemas.params.safeParse(context.params);
      if (!paramsResult.success) {
        return new Response(
          JSON.stringify({
            error: "Invalid URL parameters",
            details: paramsResult.error.issues,
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
      validatedParams = paramsResult.data;
    }

    let validatedBody: any = undefined;
    if (schemas.body) {
      let bodyJson: unknown;
      try {
        bodyJson = await req.json();
      } catch {
        return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const bodyResult = schemas.body.safeParse(bodyJson);
      if (!bodyResult.success) {
        return new Response(
          JSON.stringify({
            error: "Invalid request body",
            details: bodyResult.error.issues,
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
      validatedBody = bodyResult.data;
    }

    // @ts-ignore
    if (schemas.body) return handler(user, req, { params: validatedParams, body: validatedBody as zInfer<BS> });
    else return handler(user, req, { params: validatedParams, body: undefined });
  };
}
