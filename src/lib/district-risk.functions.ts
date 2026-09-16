import { createServerFn } from "@tanstack/react-start";
import { DISTRICT_RISK } from "./district-risk.data";

export const getDistrictRisk = createServerFn({ method: "GET" }).handler(
  async () => DISTRICT_RISK,
);
