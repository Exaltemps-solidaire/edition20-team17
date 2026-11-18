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
});
