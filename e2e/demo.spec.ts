import { expect, test } from "@playwright/test";

// Démo du cas passant, de bout en bout. Chaque itération ajoute ses étapes (test.step).
test("Démo : le cas passant", async ({ page }) => {
  await test.step("J'ouvre l'application", async () => {
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
  });

  await test.step("Je choisis mon profil", async () => {
    await page.getByText("Qui êtes-vous ?").waitFor();
    await page.getByRole("button", { name: /Patiente nouvellement diagnostiquée/ }).click();
  });

  await test.step("Je vois le chatbot Endo'chat sur l'accueil", async () => {
    await expect(
      page.getByText("Trouvez la ressource qui vous correspond en quelques questions"),
    ).toBeVisible();
  });

  await test.step("Je démarre le questionnaire et réponds oui au diagnostic", async () => {
    await page.getByRole("button", { name: "Démarrer le questionnaire →" }).click();
    await page.getByRole("button", { name: "Oui, j'ai été diagnostiquée" }).click();
  });

  await test.step("Je vois l'écran diagnostic & ressenti", async () => {
    await expect(
      page.getByText("Qu'est-ce que le médecin vous a dit", { exact: false }),
    ).toBeVisible();
  });

  await test.step("Je décris la situation avec mes mots", async () => {
    await page.getByPlaceholder("Ce que le médecin m'a dit...").fill("Tout va bien se passer.");
  });

  await test.step("Je continue vers le niveau d'interrogation", async () => {
    await page.getByRole("button", { name: "Continuer →" }).click();
    await expect(
      page.getByText("Pour chaque thème, indiquez à quel point vous vous interrogez", {
        exact: false,
      }),
    ).toBeVisible();
  });

  await test.step("Je règle mon niveau d'interrogation sur la douleur", async () => {
    await page.getByRole("button", { name: "La douleur au quotidien : 5" }).click();
  });

  await test.step("Je vois mes ressources, la douleur mise en avant", async () => {
    await page.getByRole("button", { name: "Voir mes ressources →" }).click();
    await expect(page.getByText("Priorité haute")).toBeVisible();
  });
});
