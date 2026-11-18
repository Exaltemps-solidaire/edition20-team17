# Plan d'itérations — Endo'chat (ENDOmind)

**Plan validé le 2026-11-18** (confirmé par le développeur au début de l'itération 1).

- **Source du plan** : proposé par l'agent (aucun plan d'itérations trouvé dans la passation : ni fichier `cadrage/*iteration*`, ni clé `iterations` dans `passation.json`).
- **Temps restant annoncé** : 60 minutes, demandé le 2026-11-18. Reconfirmé à 60 minutes au début de l'itération 1 (2026-11-18).
- **Durée d'un tour de test PM Lab** : 5 minutes.
- **Capacité estimée** : une itération dure au moins codage (≤10 min) + publication (~5 min) + tour de test (5 min), soit 13 à 20 min selon la taille du codage. Avec 60 minutes, ~3 itérations tiennent si le codage reste court (5-7 min chacune) ; 3 itérations pleines (10 min de codage) consommeraient tout le temps sans marge de stabilisation.
- **✂️ Hors périmètre pour tout le hackathon** (déjà exclu par la passation, confirmé pour ne pas gonfler les itérations) : connexion/compte, suivi dans le temps, alerte situation sensible (identifiée mais non implémentée), recherche hors ressources ENDOmind, upload de photo du diagnostic (le prototype n'en montre pas clairement l'usage et ce n'est pas dans le scénario validé), choix vouvoiement/tutoiement (on garde le tutoiement du prototype sans le woter).
- **⚠️ Point d'attention** : `passation/cadrage/5-hypotheses.md` est vide (« Pas encore produit »). Les critères d'acceptation ci-dessous sont donc dérivés directement du scénario de `3-solution.md` / du PRD, pas d'un document d'hypothèses dédié.

---

## Itération 1 : le squelette est publié et montre l'écran d'accueil + le choix de profil

- **Dans le périmètre** :
  - `.env.example` et `DEPLOIEMENT.md` à la racine (contrat de déployabilité).
  - Écran « Qui êtes-vous ? » au lancement : liste de profils d'exemple (patiente nouvellement diagnostiquée, patiente diagnostiquée depuis longtemps), bouton pour en changer.
  - Écran d'accueil qui met en avant le chatbot Endo'chat (bouton pour l'ouvrir), données en dur.
  - Déploiement sur l'URL publique selon `docs/guidelines-deploiement.md`.
- **Hors périmètre** : toute logique de conversation du chatbot (question suivante).
- **Critères d'acceptation** :
  - Étant donné l'application démarrée, quand on arrive sur `/`, alors l'écran « Qui êtes-vous ? » propose au moins deux profils et un bouton pour choisir.
  - Étant donné un profil choisi, quand on arrive sur l'accueil, alors le chatbot Endo'chat est visible et cliquable.
  - Étant donné l'application déployée, quand on appelle `/health` et `/sante` sur le port 8080, alors les deux répondent 200.
- **Hypothèse de l'équipe couverte** : aucune (`5-hypotheses.md` vide) — couvre la mise en place du contrat de déployabilité, prérequis à toute démonstration.
- **Codage estimé** : 10 minutes.
- **Fichiers prévus** : `.env.example`, `DEPLOIEMENT.md`, `frontend/src/app/page.tsx` (ou équivalent), un composant « Qui êtes-vous ? », un composant accueil/chatbot teaser.
- **Tests unitaires prévus** : 1 à 3, sur la sélection de profil (ex. le profil choisi est bien celui affiché ensuite).
- **Étapes ajoutées à la démo** (`e2e/demo.spec.ts`) : ouvrir l'app, choisir un profil, voir l'accueil avec le chatbot visible.
- **Bilan** :
  - Codage réel : 3 minutes (pas de dépassement).
  - Critères d'acceptation : les 2 premiers satisfaits (écran de choix de profil, chatbot visible et cliquable). Le 3e (`/health`/`/sante` sur 8080) vérifié localement (200 sur les deux) ; vérification depuis `$URL_PUBLIQUE` laissée au développeur (DoD point 5, non bloquant).
  - Reporté : aucun.
  - Bloqué par le harnais : rien — `npm test` passait, aucun secret détecté.
  - Incident hors code : le premier démarrage de la plateforme (`gitlab-ci-local`) a échoué après 16 min à cause d'une limite de débit Docker Hub sur l'image `temporalio/ui`, qui a empêché `postgres.internal`, le registre et S3 de démarrer. Un second lancement a réussi (Temporal/IdP/Analytics non nécessaires à cette itération).
  - **Modifications** :
    - `.env.example` : liste la seule variable lue à ce stade (`PORT`), pour le contrat de déployabilité.
    - `DEPLOIEMENT.md` : page de déploiement (services, rien d'externe encore, ce qui est inachevé).
    - `frontend/src/lib/profils.ts` + `profils.test.ts` : logique de profils en dur et ses tests — sert le critère 1.
    - `frontend/src/app/page.tsx`, `page.module.css`, `globals.css`, `layout.tsx` : écran « Qui êtes-vous ? » et accueil avec le chatbot Endo'chat — sert les critères 1 et 2.
    - `frontend/nginx.conf` : repris du gabarit de la plateforme, CSP adaptée (adresses injoignables retirées, `script-src` ajouté pour l'hydration Next.js) — nécessaire pour que l'accueil s'affiche une fois déployé.
    - `api/Dockerfile`, `frontend/Dockerfile` : images de base qualifiées en `docker.io/library/...`.
    - `podman-compose.yml` : déploiement des deux services sur 8080/8081.
    - `e2e/demo.spec.ts` : étapes « je choisis mon profil » et « je vois le chatbot ».

---

## Itération 2 : le flux de qualification fonctionne (OUI → questions, NON → renvoi soignant)

- **Dans le périmètre** :
  - Écran chatbot « Êtes-vous diagnostiquée ? » avec boutons OUI / NON.
  - Branche NON → écran de renvoi vers un soignant / une filière de soins (contenu statique, fin du parcours).
  - Branche OUI → écran « Diagnostic & ressenti » affiché (champ texte pour ce que le médecin a dit, jauge de ressenti), sans suite pour l'instant.
- **Hors périmètre** : le niveau d'interrogation (itération suivante), le calcul de score, les ressources finales.
- **Critères d'acceptation** :
  - Étant donné l'écran « Êtes-vous diagnostiquée ? », quand on répond NON, alors l'écran de renvoi soignant s'affiche et le parcours s'arrête là.
  - Étant donné l'écran « Êtes-vous diagnostiquée ? », quand on répond OUI, alors l'écran « Diagnostic & ressenti » s'affiche avec son champ texte et sa jauge.
  - Étant donné l'écran « Diagnostic & ressenti », quand on saisit une réponse, alors la saisie est conservée en mémoire (pas de rechargement qui l'efface) pour l'étape suivante.
- **Hypothèse de l'équipe couverte** : aucune (`5-hypotheses.md` vide) — couvre la valeur mesurée n°1 du plan de livraison de l'équipe (« les deux branches OUI/NON fonctionnent et mènent chacune à un écran distinct »).
- **Codage estimé** : 7 minutes.
- **Fichiers prévus** : composant écran « Êtes-vous diagnostiquée ? », composant « renvoi soignant », composant « Diagnostic & ressenti », état de conversation partagé (~1 fichier).
- **Tests unitaires prévus** : 1 à 2, sur l'aiguillage OUI/NON (logique pure, pas le rendu).
- **Étapes ajoutées à la démo** : répondre OUI à la qualification, voir l'écran Diagnostic & ressenti ; rejouer en répondant NON pour voir le renvoi soignant.
- **Bilan** : _à remplir en fin d'itération_

---

## À venir (à détailler au fil de l'eau, selon le temps restant réel après l'itération 2)

1. Niveau d'interrogation : jauge 1 à 5 sélectionnable, calcul du score à partir des réponses.
2. Résultats & ressources selon le score : trois comportements (4-5 → ressources directes, 3 → résumé + approfondissement, < 3 → « Souhaites-tu en savoir plus ? »), guide « Le diagnostic, et maintenant ? » systématiquement proposé.
3. Si le temps le permet encore : stabilisation finale avant le pitch (corrections visuelles, vérification de bout en bout du script de démo, pas de nouvelle fonctionnalité).
