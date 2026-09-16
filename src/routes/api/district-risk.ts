import { createFileRoute } from "@tanstack/react-router";
import { DISTRICT_RISK } from "@/lib/district-risk.data";

export const Route = createFileRoute("/api/district-risk")({
  server: {
    handlers: {
      GET: async () => Response.json(DISTRICT_RISK),
    },
  },
});
