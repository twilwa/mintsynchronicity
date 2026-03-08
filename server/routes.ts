import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistSchema } from "@shared/schema";
import { fromError } from "zod-validation-error";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/waitlist", async (req, res) => {
    const parsed = insertWaitlistSchema.safeParse(req.body);
    if (!parsed.success) {
      const validationError = fromError(parsed.error);
      return res.status(400).json({ message: validationError.toString() });
    }

    try {
      const entry = await storage.addToWaitlist(parsed.data);
      const count = await storage.getWaitlistCount();
      return res.status(201).json({ entry, count });
    } catch (error: any) {
      if (error.code === "23505") {
        const count = await storage.getWaitlistCount();
        return res.status(200).json({ message: "You're already on the waitlist!", count });
      }
      return res.status(500).json({ message: "Something went wrong. Please try again." });
    }
  });

  app.get("/api/waitlist/count", async (_req, res) => {
    const count = await storage.getWaitlistCount();
    return res.json({ count });
  });

  return httpServer;
}