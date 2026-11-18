export type Profil = {
  id: string;
  nom: string;
  role: string;
};

export const PROFILS: Profil[] = [
  { id: "nouvelle-diagnostiquee", nom: "Camille", role: "Patiente nouvellement diagnostiquée" },
  { id: "diagnostiquee-longtemps", nom: "Inès", role: "Patiente diagnostiquée depuis longtemps" },
];

export function trouverProfil(id: string): Profil | undefined {
  return PROFILS.find((profil) => profil.id === id);
}
