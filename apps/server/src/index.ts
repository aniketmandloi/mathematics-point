import crypto from "node:crypto";
import fastifyCors from "@fastify/cors";
import { createContext } from "@mathematics-point/api/context";
import {
  appRouter,
  type AppRouter,
} from "@mathematics-point/api/routers/index";
import { handleCheckoutCompleted } from "@mathematics-point/api/webhook-handlers";
import { auth } from "@mathematics-point/auth";
import { env } from "@mathematics-point/env/server";
import {
  fastifyTRPCPlugin,
  type FastifyTRPCPluginOptions,
} from "@trpc/server/adapters/fastify";
import Fastify from "fastify";

const baseCorsConfig = {
  origin: env.CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  maxAge: 86400,
};

const fastify = Fastify({
  logger: true,
});

fastify.register(fastifyCors, baseCorsConfig);

// Custom JSON parser that preserves raw body for webhook verification
fastify.addContentTypeParser(
  "application/json",
  { parseAs: "string" },
  (req, body, done) => {
    try {
      (req as any).rawBody = body;
      const json = JSON.parse(body as string);
      done(null, json);
    } catch (err) {
      done(err as Error, undefined);
    }
  },
);

// Auth routes
fastify.route({
  method: ["GET", "POST"],
  url: "/api/auth/*",
  async handler(request, reply) {
    try {
      const url = new URL(request.url, `http://${request.headers.host}`);
      const headers = new Headers();
      Object.entries(request.headers).forEach(([key, value]) => {
        if (value) headers.append(key, value.toString());
      });
      const req = new Request(url.toString(), {
        method: request.method,
        headers,
        body: request.body ? JSON.stringify(request.body) : undefined,
      });
      const response = await auth.handler(req);
      reply.status(response.status);
      response.headers.forEach((value, key) => reply.header(key, value));
      reply.send(response.body ? await response.text() : null);
    } catch (error) {
      fastify.log.error({ err: error }, "Authentication Error:");
      reply.status(500).send({
        error: "Internal authentication error",
        code: "AUTH_FAILURE",
      });
    }
  },
});

// Polar webhook — Standard Webhooks (SVix) signature verification
function verifyWebhookSignature(
  payload: string,
  headers: { id: string; timestamp: string; signature: string },
  secret: string,
): boolean {
  const toSign = `${headers.id}.${headers.timestamp}.${payload}`;
  const secretKey = secret.startsWith("whsec_") ? secret.slice(6) : secret;
  const secretBytes = Buffer.from(secretKey, "base64");
  const computed = crypto
    .createHmac("sha256", secretBytes)
    .update(toSign)
    .digest("base64");

  return headers.signature.split(" ").some((sig) => {
    const sigValue = sig.startsWith("v1,") ? sig.slice(3) : sig;
    try {
      return crypto.timingSafeEqual(
        Buffer.from(computed),
        Buffer.from(sigValue),
      );
    } catch {
      return false;
    }
  });
}

fastify.post("/api/webhooks/polar", async (request, reply) => {
  const rawBody = (request as any).rawBody as string;
  if (!rawBody) {
    return reply.status(400).send({ error: "Missing body" });
  }

  const webhookId = request.headers["webhook-id"] as string;
  const webhookTimestamp = request.headers["webhook-timestamp"] as string;
  const webhookSignature = request.headers["webhook-signature"] as string;

  if (!webhookId || !webhookTimestamp || !webhookSignature) {
    return reply.status(400).send({ error: "Missing webhook headers" });
  }

  const isValid = verifyWebhookSignature(
    rawBody,
    { id: webhookId, timestamp: webhookTimestamp, signature: webhookSignature },
    env.POLAR_WEBHOOK_SECRET,
  );

  if (!isValid) {
    fastify.log.warn("Invalid Polar webhook signature");
    return reply.status(401).send({ error: "Invalid signature" });
  }

  const event = request.body as {
    type: string;
    data: {
      id: string;
      status: string;
      metadata: Record<string, string>;
    };
  };

  fastify.log.info(
    { type: event.type, status: event.data?.status },
    "Polar webhook received",
  );

  if (event.type === "checkout.updated" && event.data.status === "succeeded") {
    const { transactionId, courseId, userId } = event.data.metadata;

    if (!transactionId || !courseId || !userId) {
      fastify.log.warn("Webhook missing metadata");
      return reply.status(200).send({ received: true });
    }

    try {
      await handleCheckoutCompleted({
        transactionId,
        courseId,
        userId,
        polarCheckoutId: event.data.id,
      });

      fastify.log.info(
        { transactionId, courseId, userId },
        "Payment completed, student enrolled",
      );
    } catch (error) {
      fastify.log.error({ err: error }, "Error processing payment webhook");
      return reply.status(500).send({ error: "Processing failed" });
    }
  }

  return reply.status(200).send({ received: true });
});

// tRPC routes
fastify.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: {
    router: appRouter,
    createContext,
    onError({ path, error }) {
      console.error(`Error in tRPC handler on path '${path}':`, error);
    },
  } satisfies FastifyTRPCPluginOptions<AppRouter>["trpcOptions"],
});

fastify.get("/", async () => {
  return "OK";
});

fastify.listen({ port: 3000, host: "0.0.0.0" }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log("Server running on port 3000");
});
