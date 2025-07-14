import { withAuth } from "@/lib/middleware/with-auth";

export const GET = withAuth(async (user, req, { id }) => {});
