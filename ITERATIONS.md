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
- **Temps restant annoncé au début** : 40 minutes, demandé le 2026-11-18 à 17:20.
- **Bilan** :
  - Codage réel : 3 minutes (pas de dépassement).
  - ✂️ Remarque taille non bloquante : le périmètre couvre 3 écrans nouveaux (qualification, renvoi soignant, diagnostic & ressenti), au-delà de la règle « un écran nouveau au plus ». Accepté tel quel car chaque écran est un simple état de vue dans la page unique déjà en place (même patron que l'itération 1), le codage est resté largement sous le budget (3 min), et le plan avait déjà été validé par le développeur à l'itération précédente.
  - Critères d'acceptation : les 3 satisfaits — NON mène au renvoi soignant et arrête le parcours ; OUI mène à l'écran Diagnostic & ressenti (cases à cocher + choix de ressenti, fidèles au prototype plutôt qu'au résumé "champ texte + jauge" du plan) ; la saisie reste en mémoire tant que le composant ne se démonte pas (état React porté par `Home`).
  - Reporté : aucun.
  - Bloqué par le harnais : rien — `npm test` passait (root + frontend), aucun secret détecté, le hook de signal n'a pas refusé l'appel.
  - Incident hors code : un `podman pull` de test a déclenché la limite de débit Docker Hub anonyme (`toomanyrequests`) ; sans conséquence car `node:24-alpine` et `nginx:1.27-alpine` étaient déjà en cache local depuis l'itération 1, donc le build de l'itération n'a pas eu besoin de Docker Hub.
  - Démo Playwright (`npm run demo`, hors DoD) : échec environnemental, pas applicatif — `chrome-headless-shell` installé mais `libnspr4.so` manquant sur cette machine. Signalé, non bloquant pour la publication.
  - **Modifications** :
    - `frontend/src/lib/qualification.ts` + `qualification.test.ts` : logique pure d'aiguillage OUI/NON (2 tests) — sert le critère 1.
    - `frontend/src/app/page.tsx` : ajout des écrans `EcranQualification`, `EcranRenvoiSoignant`, `EcranDiagnosticRessenti`, et de l'état de conversation (`vue`, `mentionsChoisies`, `ressentisChoisis`) dans `Home` — sert les critères 1, 2 et 3.
    - `frontend/src/app/page.module.css` : styles chatbot (en-tête, bulles, choix, encadré d'orientation, cases à cocher, grille de ressentis).
    - `e2e/demo.spec.ts` : étapes « je démarre le questionnaire, je réponds oui, je vois l'écran diagnostic & ressenti ».
  - Déploiement : images reconstruites et poussées (`localhost:5000/team17/{frontend,api}:dev`), `podman compose up -d --force-recreate` relancé. Vérifié localement : `localhost:8080/` (200, contenu à jour), `/health` et `/sante` (200), `localhost:8081/health` (200).
  - Signal PM Lab : version 2 enregistrée avec succès (`./scripts/signaler-version.sh 2`).
  - Vérification développeur en attente : `$URL_PUBLIQUE/health` et `$URL_PUBLIQUE/sante` depuis le navigateur (non bloquant pour le signal, déjà envoyé).

---

## Itération 3 : l'écran Diagnostic & ressenti accueille un texte libre et un aperçu photo

**⚠️ Demande nouvelle du développeur, insérée avant les itérations déjà planifiées** (2026-11-18, ~17:37, temps restant annoncé : ~30 minutes). Décale les anciennes itérations 3 et 4 (jauges/score, résultats) en 4 et 5.

**❗️ Point de vigilance tranché avec le développeur** : l'itération 1 excluait explicitement l'upload de photo « pour tout le hackathon ». Le développeur confirme vouloir une version allégée — aperçu local uniquement, sans envoi ni stockage (pas de bucket S3, pas de route API) — pour rester dans le budget. Le stockage réel reste hors périmètre.

- **Dans le périmètre** :
  - Sur l'écran « Diagnostic & ressenti », un champ texte libre (« décrivez avec vos mots ce que le médecin vous a dit ») en complément des cases à cocher existantes.
  - Juste avant la section ressenti, un sélecteur de photo qui affiche un aperçu local de l'image choisie (pas d'envoi au serveur). Les fichiers non-image sont rejetés avec un message.
- **Hors périmètre** : l'envoi/stockage réel de la photo (bucket S3, route API) ; toute utilisation de la photo au-delà de l'aperçu.
- **Critères d'acceptation** :
  - Étant donné l'écran « Diagnostic & ressenti », quand on saisit un texte libre, alors il reste affiché tant qu'on ne quitte pas l'écran.
  - Étant donné ce même écran, quand on choisit une image locale, alors son aperçu s'affiche avant la section ressenti.
  - Étant donné un fichier qui n'est pas une image, quand on le sélectionne, alors un message de rejet s'affiche et aucun aperçu n'apparaît.
- **Codage estimé** : 6 minutes.
- **Tests unitaires prévus** : 1 à 2, sur la fonction de validation du type de fichier (logique pure).
- **Temps restant annoncé au début** : ~30 minutes, demandé le 2026-11-18 à 17:37.
- **Bilan** :
  - Codage réel : 1 minute (pas de dépassement).
  - Critères d'acceptation : les 3 satisfaits — le texte libre reste affiché via l'état React de `Home` ; le sélecteur de photo affiche un aperçu local (`URL.createObjectURL`, aucun envoi réseau) juste avant la section ressenti ; un fichier non-image déclenche le message de rejet sans aperçu.
  - Reporté : aucun. Le stockage réel de la photo (bucket S3 + route API) reste explicitement hors périmètre, comme tranché avec le développeur avant codage.
  - Bloqué par le harnais : rien — `npm test` passait (root + frontend, 2 nouveaux tests sur `estImageValide`), aucune borne de déployabilité, le hook de signal n'a pas refusé l'appel.
  - Démo Playwright : même limite environnementale que l'itération précédente (`libnspr4.so` manquant), non bloquant. Étape « je décris la situation avec mes mots » ajoutée au script malgré tout.
  - **Modifications** :
    - `frontend/src/lib/media.ts` + `media.test.ts` : validation du type de fichier (2 tests) — sert le critère 3.
    - `frontend/src/app/page.tsx` : champ texte libre et sélecteur de photo (aperçu local) ajoutés à `EcranDiagnosticRessenti`, état `description`/`apercuPhoto`/`erreurPhoto` porté par `Home` — sert les critères 1 et 2.
    - `frontend/src/app/page.module.css` : styles du bloc texte libre et du bloc photo.
    - `e2e/demo.spec.ts` : étape « je décris la situation avec mes mots ».
  - Déploiement : image frontend reconstruite et poussée, `podman compose up -d --force-recreate`. Vérifié localement : `localhost:8080/` (200), `/health` et `/sante` (200).
  - Signal PM Lab : version 3 enregistrée avec succès (`./scripts/signaler-version.sh 3`).
  - Vérification développeur en attente : `$URL_PUBLIQUE/health` et `$URL_PUBLIQUE/sante` depuis le navigateur (non bloquant, déjà signalé).

## Itération 4 : la photo choisie s'affiche par son nom, sans aperçu image

**⚠️ Correctif demandé par le développeur** (2026-11-18, temps restant annoncé : ~25 minutes), sur l'écran livré à l'itération 3. Décale « jauges/score » en itération 5 et « résultats » en itération 6.

- **Dans le périmètre** : remplacer l'aperçu visuel de la photo (balise `<img>`) par le simple nom du fichier choisi, sur l'écran « Diagnostic & ressenti ».
- **Hors périmètre** : tout le reste de l'écran (texte libre, cases à cocher, ressentis) ne change pas.
- **Critères d'acceptation** :
  - Étant donné une image choisie, quand elle est sélectionnée, alors son nom de fichier s'affiche (plus d'aperçu visuel).
  - Étant donné un fichier non-image choisi, quand il est sélectionné, alors le message de rejet s'affiche toujours et aucun nom n'apparaît.
- **Codage estimé** : 2 minutes.
- **Tests unitaires prévus** : aucun nouveau (pas de nouvelle logique métier ; `estImageValide` déjà testé en itération 3 reste inchangé).
- **Temps restant annoncé au début** : ~25 minutes, demandé le 2026-11-18 à 17:45.
- **Bilan** :
  - Codage réel : 1 minute (pas de dépassement).
  - Critères d'acceptation : les 2 satisfaits — le nom du fichier s'affiche à la place de l'aperçu (état renommé `nomPhoto`, stocke `fichier.name` au lieu d'un `URL.createObjectURL`) ; le rejet d'un fichier non-image fonctionne toujours à l'identique.
  - Reporté : aucun.
  - Bloqué par le harnais : rien — `npm test` passait (root + frontend, aucun test cassé), aucune borne de déployabilité.
  - **Modifications** :
    - `frontend/src/app/page.tsx` : état `nomPhoto` (remplace l'ancien `apercuPhoto`), `choisirPhoto` stocke `fichier.name` au lieu de créer une URL d'objet ; affichage texte au lieu de `<img>`.
    - `frontend/src/app/page.module.css` : `.photoNom` remplace `.photoApercu`.
  - Déploiement : image frontend reconstruite et poussée, `podman compose up -d --force-recreate`. Vérifié localement : `localhost:8080/` (200), `/health` et `/sante` (200).
  - Signal PM Lab : version 4 enregistrée avec succès (`./scripts/signaler-version.sh 4`).
  - Vérification développeur en attente : `$URL_PUBLIQUE/health` et `$URL_PUBLIQUE/sante` depuis le navigateur (non bloquant, déjà signalé).

## Itération 5 : le niveau d'interrogation se règle par thème et produit un score

- **Dans le périmètre** :
  - Écran « Niveau d'interrogation » : une jauge 1 à 5 par thème (douleur, fertilité, traitements, droits), valeur par défaut neutre.
  - Calcul du score par thème à partir des jauges (logique pure, testable) — pas d'affichage de résultat pour l'instant.
- **Hors périmètre** : l'écran de résultats et les ressources (itération 6).
- **Critères d'acceptation** :
  - Étant donné l'écran « Diagnostic & ressenti », quand on continue, alors l'écran « Niveau d'interrogation » affiche les 4 thèmes avec une jauge 1-5 chacun.
  - Étant donné des valeurs choisies sur les jauges, quand on les change, alors la valeur affichée se met à jour immédiatement.
  - Étant donné 4 valeurs de jauge, quand le score est calculé, alors chaque thème a un score 1-5 correct (fonction pure testée).
- **Codage estimé** : 7 minutes.
- **Tests unitaires prévus** : 1 à 2, sur la fonction de calcul de score.
- **Temps restant annoncé au début** : 30 minutes, demandé le 2026-11-18 à 17:49.
- **Bilan** :
  - Codage réel : 1 minute (pas de dépassement).
  - Critères d'acceptation : les 3 satisfaits — l'écran « Niveau d'interrogation » affiche les 4 thèmes avec une jauge 1-5 chacun (valeur par défaut 3) ; cliquer une étape met à jour l'affichage immédiatement ; `clamperScore` (testée) garantit un score toujours compris entre 1 et 5.
  - Reporté : aucun. L'écran de résultats reste en itération 6, comme prévu.
  - Bloqué par le harnais : rien — `npm test` passait (root + frontend, 3 nouveaux tests sur `clamperScore`), aucune borne de déployabilité.
  - Démo Playwright : même limite environnementale que les itérations précédentes (`libnspr4.so` manquant), non bloquant. Étapes « je continue vers le niveau d'interrogation » et « je règle mon niveau d'interrogation sur la douleur » ajoutées malgré tout.
  - **Modifications** :
    - `frontend/src/lib/score.ts` + `score.test.ts` : thèmes, score initial, `clamperScore` (3 tests) — sert le critère 3.
    - `frontend/src/app/page.tsx` : ajout de `EcranNiveauInterrogation`, bouton « Continuer → » sur l'écran Diagnostic & ressenti, état `scores` porté par `Home` — sert les critères 1 et 2.
    - `frontend/src/app/page.module.css` : styles des jauges par thème.
    - `e2e/demo.spec.ts` : étapes « je continue… » et « je règle mon niveau d'interrogation… ».
  - Déploiement : image frontend reconstruite et poussée, `podman compose up -d --force-recreate`. Vérifié localement : `localhost:8080/` (200), `/health` et `/sante` (200).
  - Signal PM Lab : version 5 enregistrée avec succès (`./scripts/signaler-version.sh 5`).
  - Vérification développeur en attente : `$URL_PUBLIQUE/health` et `$URL_PUBLIQUE/sante` depuis le navigateur (non bloquant, déjà signalé).

## Itération 6 : les résultats affichent les ressources selon le score

- **Dans le périmètre** : écran « Résultats & ressources » — guide « Le diagnostic, et maintenant ? » toujours en premier, puis les thèmes triés par score, avec un comportement simplifié selon le score (4-5 → ressource mise en avant, < 4 → mention plus discrète). Le détail à 3 comportements du prototype (4-5 / 3 / <3) sera réduit si le temps restant après l'itération 5 est trop court (✂️ à confirmer alors).
- **Hors périmètre** : personnalisation fine du texte par thème au-delà du prototype.
- **Critères d'acceptation** (3 au plus, à préciser au début de l'itération selon le temps restant réel) :
  - Étant donné les scores calculés en itération 5, quand on arrive sur l'écran résultats, alors le guide général est visible en premier.
  - Étant donné un thème à score élevé, quand on consulte les résultats, alors sa ressource est mise en avant visuellement.
- **Codage estimé** : 7 minutes.
- **Temps restant annoncé au début** : 24 minutes, demandé le 2026-11-18 à 17:54.
- **Bilan** :
  - Codage réel : 1 minute (pas de dépassement).
  - Critères d'acceptation : les 2 satisfaits — le guide général apparaît toujours en premier ; les thèmes à score ≥ 4 (`estPrioritaire`, testée) sont mis en avant (bordure orange, bandeau « Priorité haute »), les autres en affichage plus discret, le tout trié par score décroissant (`trierThemesParScore`, testée).
  - Reporté : aucun.
  - Bloqué par le harnais : rien — `npm test` passait (root + frontend, 3 nouveaux tests sur `estPrioritaire`/`trierThemesParScore`), aucune borne de déployabilité.
  - Démo Playwright : même limite environnementale que les itérations précédentes, non bloquant. Étape « je vois mes ressources, la douleur mise en avant » ajoutée.
  - **Modifications** :
    - `frontend/src/lib/resultats.ts` + `resultats.test.ts` : `estPrioritaire`, `trierThemesParScore` (3 tests) — sert les critères 1 et 2.
    - `frontend/src/app/page.tsx` : ajout de `EcranResultats`, bouton « Voir mes ressources → » sur l'écran Niveau d'interrogation, mapping statique thème→ressource.
    - `frontend/src/app/page.module.css` : styles des cartes de résultats (guide, prioritaire, discret).
    - `e2e/demo.spec.ts` : étape « je vois mes ressources… ».
  - Déploiement : image frontend reconstruite et poussée, `podman compose up -d --force-recreate`. Vérifié localement : `localhost:8080/` (200), `/health` et `/sante` (200).
  - Signal PM Lab : version 6 enregistrée avec succès (`./scripts/signaler-version.sh 6`).
  - Vérification développeur en attente : `$URL_PUBLIQUE/health` et `$URL_PUBLIQUE/sante` depuis le navigateur (non bloquant, déjà signalé).
  - ⚠️ Parcours complet livré (accueil → qualification → diagnostic & ressenti → niveau d'interrogation → résultats). Avec ~24 minutes annoncées à ce début d'itération et le temps déjà consommé par la publication, il reste très peu de marge : recommandation de consacrer la suite à la stabilisation pour le pitch plutôt qu'à une itération 7 nouvelle (✂️ à confirmer avec le développeur).

## Si le temps le permet encore

Stabilisation finale avant le pitch (corrections visuelles, vérification de bout en bout du script de démo, pas de nouvelle fonctionnalité).
