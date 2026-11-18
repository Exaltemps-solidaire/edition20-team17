import { describe, expect, it } from "vitest";
import { PROFILS, trouverProfil } from "./profils";

describe("trouverProfil", () => {
  it("retrouve un profil existant par son identifiant", () => {
    expect(trouverProfil(PROFILS[0].id)).toEqual(PROFILS[0]);
  });

  it("retourne undefined pour un identifiant inconnu", () => {
    expect(trouverProfil("inconnu")).toBeUndefined();
  });

  it("propose au moins deux profils", () => {
    expect(PROFILS.length).toBeGreaterThanOrEqual(2);
  });
});
