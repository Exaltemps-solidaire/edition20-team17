import { describe, expect, it } from "vitest";
import { estImageValide } from "./media";

describe("estImageValide", () => {
  it("accepte un type MIME image", () => {
    expect(estImageValide("image/png")).toBe(true);
  });

  it("rejette un type MIME non-image", () => {
    expect(estImageValide("application/pdf")).toBe(false);
  });
});
