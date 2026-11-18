import { describe, expect, it } from "vitest";
import { estPrioritaire, trierThemesParScore } from "./resultats";

describe("estPrioritaire", () => {
  it("considère 4 et 5 comme prioritaires", () => {
    expect(estPrioritaire(4)).toBe(true);
    expect(estPrioritaire(5)).toBe(true);
  });

  it("ne considère pas 3 comme prioritaire", () => {
    expect(estPrioritaire(3)).toBe(false);
  });
});

describe("trierThemesParScore", () => {
  it("trie les thèmes du score le plus élevé au plus bas", () => {
    const tries = trierThemesParScore({
      douleur: 2,
      fertilite: 5,
      traitements: 3,
      droits: 1,
    });
    expect(tries.map((t) => t.id)).toEqual(["fertilite", "traitements", "douleur", "droits"]);
  });
});
