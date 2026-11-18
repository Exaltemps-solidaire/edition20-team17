import { describe, expect, it } from "vitest";
import { clamperScore } from "./score";

describe("clamperScore", () => {
  it("ramène une valeur trop basse à 1", () => {
    expect(clamperScore(0)).toBe(1);
  });

  it("ramène une valeur trop haute à 5", () => {
    expect(clamperScore(7)).toBe(5);
  });

  it("arrondit une valeur intermédiaire", () => {
    expect(clamperScore(3.6)).toBe(4);
  });
});
