import { describe, expect, it } from "vitest";
import { ecranApresQualification } from "./qualification";

describe("ecranApresQualification", () => {
  it("oriente vers l'écran diagnostic quand la réponse est oui", () => {
    expect(ecranApresQualification("oui")).toBe("diagnostic");
  });

  it("oriente vers le renvoi soignant quand la réponse est non", () => {
    expect(ecranApresQualification("non")).toBe("renvoi-soignant");
  });
});
