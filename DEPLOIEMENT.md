# Déploiement — Endo'chat (ENDOmind)

Endo'chat oriente une patiente nouvellement diagnostiquée vers la ressource ENDOmind adaptée à sa
situation, via un questionnaire guidé. Il ne pose pas de diagnostic et ne remplace pas un soignant.

## Services

- `frontend/` : export statique Next.js, servi par nginx. **C'est le service exposé au public**
  (port 80 dans le conteneur, publié en 8080). Sert `/`, `/health`, `/sante`.
- `api/` : service Node minimal (port 8081, publié en 8081). Sert `/health` et `/sante`. Ne porte
  encore aucune route métier.

## Services externes

Aucun pour l'instant : l'écran de choix de profil et l'accueil n'appellent ni base de données, ni
API externe, ni modèle d'IA. Les profils sont des données en dur (`frontend/src/lib/profils.ts`).

## Fragile / inachevé

- Le bouton « Démarrer le questionnaire » mène à un écran de patience : le questionnaire du
  chatbot (qualification, ressenti, score, ressources) n'est pas encore implémenté — prévu dans
  les itérations suivantes (`ITERATIONS.md`).
- Le service `api` ne sert que `/health` et `/sante` ; aucune route `/api/v1/...` n'existe encore.

## Contacts

- Équipe : Équipe 17 (« Gregs Angels »), code `WPXE3X`.
- Association : ENDOmind.
