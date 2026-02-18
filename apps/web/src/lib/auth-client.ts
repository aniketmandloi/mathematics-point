import { env } from "@mathematics-point/env/web";
import { polarClient } from "@polar-sh/better-auth";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_SERVER_URL,
  plugins: [
    polarClient(),
    inferAdditionalFields({
      user: {
        role: { type: "string", input: false },
        phone: { type: "string", required: false },
        classLevel: { type: "string", required: false },
        targetExam: { type: "string", required: false },
        bio: { type: "string", required: false },
      },
    }),
  ],
});
