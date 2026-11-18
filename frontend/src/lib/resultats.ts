import { THEMES, type Scores, type Theme } from "./score";

export function estPrioritaire(score: number): boolean {
  return score >= 4;
}

export function trierThemesParScore(
  scores: Scores,
): { id: Theme; label: string; score: number }[] {
  return THEMES.map((theme) => ({ ...theme, score: scores[theme.id] })).sort(
    (a, b) => b.score - a.score,
  );
}
