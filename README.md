# SCHOOLONE

« Tout pour l'enfant, en un seul endroit. »

Application mobile complète dédiée aux enfants, parents, élèves, enseignants, écoles et vendeurs — scolarité, marketplace de fournitures, cantine, transport, activités et assistant IA éducatif. Le cahier des charges complet se trouve dans [`docs/CAHIER_DES_CHARGES.txt`](./docs/CAHIER_DES_CHARGES.txt).

## Stack

- [Expo](https://expo.dev) + React Native
- TypeScript (strict)
- [Expo Router](https://docs.expo.dev/router/introduction/) (navigation par fichiers)
- [Supabase](https://supabase.com) (PostgreSQL, Auth, Storage, RLS)
- [Zustand](https://github.com/pmndrs/zustand) (état global)
- React Hook Form + Zod (formulaires/validation, à brancher au fur et à mesure des écrans)

## État d'avancement — Phase 1

La Phase 1 (architecture, navigation, design system, auth, base de données, rôles, RLS, splash screen, cache, offline) est posée :

- **Navigation par rôle** (`app/`) : groupes `(auth)`, `(parent)`, `(student)`, `(teacher)`, `(school)`, `(seller)`, `(delivery)`, `(admin)`, chacun protégé par `useRoleGuard`.
- **Authentification** réelle via Supabase (connexion, inscription, mot de passe oublié, déconnexion) — jetons stockés dans le keychain/keystore sécurisé (`expo-secure-store`), jamais dans un cache non chiffré.
- **Démarrage** (`src/services/startupService.ts`) : connectivité → session → profil → permissions (rôle) → enfants (si parent) → redirection. Splash premium animé pendant le chargement réel, jamais de délai artificiel.
- **Cache & offline** (`src/services/cacheService.ts`, `offlineService.ts`) : stratégie cache-first, bannière hors-ligne, resynchronisation à la reconnexion.
- **Design system** de base (`src/components`) : Button, Input, Card, Badge, Avatar, EmptyState, LoadingState, ErrorState, SkeletonLoader, SearchBar, Toast.
- **Base de données** (`supabase/migrations/0001_init.sql`) : tables issues du cahier des charges (profils, écoles/classes, devoirs/notes, marketplace, commandes/paiements/livraison, cantine/transport/activités, documents, notifications, assistant IA, audit) avec RLS activée partout et policies pour les données sensibles (mineurs, devoirs/notes, documents, paiements).
- **i18n** FR/EN extensible (`src/i18n`) et thème clair/sombre (`src/theme`).

Les écrans secondaires de chaque rôle (Enfants, Boutique, Devoirs détaillés, etc.) affichent un état honnête « à venir » tant que leur fonctionnalité n'est pas implémentée — aucune donnée factice ni bouton non fonctionnel, conformément aux règles du projet.

Les phases suivantes (marketplace, listes scolaires, scanner IA, cantine/transport, assistant IA, paiements/livraison, admin/analytics, tests, i18n complète) restent à construire sur cette base.

## Démarrer le projet

```bash
npm install
cp .env.example .env   # renseignez EXPO_PUBLIC_SUPABASE_URL et EXPO_PUBLIC_SUPABASE_ANON_KEY
npm run start           # puis 'a' (Android), 'i' (iOS) ou 'w' (web)
```

### Base de données Supabase

Appliquez le schéma avec la CLI Supabase :

```bash
supabase link --project-ref <votre-project-ref>
supabase db push
```

Le fichier `supabase/migrations/0001_init.sql` crée les tables, active la RLS sur l'ensemble du schéma et pose les policies d'accès (un mineur n'est jamais visible publiquement, chaque utilisateur ne voit que les données de son propre rôle).

## Scripts

- `npm run start` / `android` / `ios` / `web` — lancer Expo
- `npm run typecheck` — vérification TypeScript stricte
- `npm run lint` — lint Expo
