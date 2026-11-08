import { describe, expect, it } from "vitest";
import { parseEditTarget } from "./edit-targets";

describe("parseEditTarget", () => {
  it("splits a valid target into step and target", () => {
    expect(parseEditTarget("details:jobTitle")).toEqual({ step: "details", target: "details:jobTitle" });
    expect(parseEditTarget("social:linkedin")?.step).toBe("social");
  });

  it("rejects empty, malformed or unknown-step values", () => {
    expect(parseEditTarget(null)).toBeNull();
    expect(parseEditTarget("details")).toBeNull();
    expect(parseEditTarget("billing:card")).toBeNull();
  });
});
