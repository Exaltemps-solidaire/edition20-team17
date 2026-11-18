export type ReponseDiagnostic = "oui" | "non";
export type EcranSuivant = "diagnostic" | "renvoi-soignant";

export function ecranApresQualification(reponse: ReponseDiagnostic): EcranSuivant {
  return reponse === "oui" ? "diagnostic" : "renvoi-soignant";
}
