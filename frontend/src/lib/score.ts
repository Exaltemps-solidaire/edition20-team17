export type Theme = "douleur" | "fertilite" | "traitements" | "droits";

export const THEMES: { id: Theme; label: string }[] = [
  { id: "douleur", label: "La douleur au quotidien" },
  { id: "fertilite", label: "La fertilité et la grossesse" },
  { id: "traitements", label: "Les traitements et la chirurgie" },
  { id: "droits", label: "Mes droits (ALD, travail, RQTH)" },
];

export type Scores = Record<Theme, number>;

export function scoresInitiaux(): Scores {
  return { douleur: 3, fertilite: 3, traitements: 3, droits: 3 };
}

export function clamperScore(valeur: number): number {
  return Math.min(5, Math.max(1, Math.round(valeur)));
}
