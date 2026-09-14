# CAHIER DES CHARGES — LENNY-FOURNITURE

« Tout pour l'enfant, en un seul endroit. »

Version 1.0 — Spécifications fonctionnelles et techniques

Vision : une super-application mobile réunissant enfant, parent, école, éducation, achats et services scolaires dans une seule plateforme.

## 1. Vision du projet
- Super-application dédiée aux enfants, parents, élèves, enseignants et écoles.
- Fournitures, livres, scolarité, IA éducative, activités, cantine, transport, documents, paiements, marketplace et livraison.
- Architecture prévue pour la France puis l'Afrique et l'international.

## 2. Comptes et rôles
- SUPER_ADMIN, ADMIN, PARENT, STUDENT, TEACHER, SCHOOL_ADMIN, SELLER, DELIVERY_AGENT.
- Chaque rôle ne voit que les données et fonctions qui lui sont autorisées.

## 3. Parent et enfants
- Un parent peut gérer plusieurs enfants et sélectionner un enfant actif.
- Profil enfant : prénom, nom, date de naissance, photo, niveau, classe, école et année scolaire.
- Les données sensibles des mineurs restent privées.

## 4. Dashboard parent
- Devoirs, notes, emploi du temps, école, transport, cantine, boutique, activités, documents et notifications.
- Afficher les prochains événements importants.

## 5. Scolarité
- Emploi du temps : jour, heure, matière, enseignant, salle.
- Devoirs : matière, titre, description, date limite, priorité, pièces jointes, statut.
- Notes, moyennes, progression et bulletins sécurisés.
- Statuts devoirs : À faire, En cours, Terminé, En retard.

## 6. Assistant IA éducatif
- Expliquer cours et exercices, générer exercices, quiz, fiches de révision, flashcards et corrections pédagogiques.
- L'IA doit favoriser l'apprentissage et non simplement faire les devoirs.
- Créer une abstraction AIProvider pour connecter un fournisseur d'IA ultérieurement.

## 7. Fournitures scolaires
- Cahiers, stylos, crayons, gommes, règles, équerres, compas, calculatrices, classeurs, feuilles, colles, ciseaux, feutres et surligneurs.
- Arts créatifs, cartables, trousses, gourdes, lunch box.
- Informatique : ordinateurs, tablettes, casques, souris, claviers, clés USB et calculatrices.

## 8. Livres et uniformes
- Librairie recherchable par titre, auteur, ISBN, matière et niveau.
- Uniformes par école et taille, plus chaussures, tenue de sport, manteaux et accessoires.

## 9. Listes de fournitures
- Parcours : Pays → École → Niveau → Classe → Année scolaire.
- Afficher les quantités et bouton « Ajouter toute la liste au panier ».

## 10. Scanner IA
- Photo de la liste → OCR/IA → produits structurés → vérification humaine → panier.
- Extraire produit, quantité, format, marque éventuelle et catégorie.
- Aucune commande automatique sans confirmation.

## 11. Rentrée en 1 clic
- « Préparer ma rentrée » regroupe fournitures, livres, cartable, uniforme, chaussures, informatique, transport, cantine et activités.
- Afficher le budget estimé et permettre de modifier chaque élément.

## 12. Marketplace
- Marketplace multi-vendeurs.
- Vendeur : produits, prix, stock, commandes, ventes et paiements.
- Client : recherche, comparaison, favoris, panier, commande, paiement, suivi et avis.

## 13. Panier, commandes et livraison
- Panier multi-vendeurs : produits, quantités, vendeurs, livraison, réductions, taxes et total.
- Statuts : PENDING, CONFIRMED, PREPARING, SHIPPED, OUT_FOR_DELIVERY, DELIVERED, CANCELLED, REFUNDED.
- Livraison : domicile, école, point relais, retrait magasin, express.

## 14. Paiements
- Préparer Stripe, Apple Pay, Google Pay et moyens locaux.
- Ne jamais stocker directement les données bancaires sensibles.
- Historique, factures, reçus, remboursements et statuts.

## 15. Cantine et transport
- Cantine : menus, réservation, annulation, paiement, historique.
- Transport : lignes, arrêts, horaires, trajets, transporteurs, notifications et GPS du bus si disponible.
- Ne jamais exposer publiquement la localisation d'un enfant.

## 16. Activités extrascolaires
- Football, basketball, natation, danse, musique, théâtre, dessin, soutien scolaire, colonies et loisirs.
- Recherche par ville, distance, âge, catégorie, prix et disponibilité.

## 17. Documents
- Bulletins, certificats, autorisations, documents scolaires, factures et justificatifs.
- Stockage privé et permissions strictes.

## 18. Notifications
- Push et in-app pour devoirs, notes, bulletins, annonces, paiements, commandes, livraisons, activités, cantine et transport.

## 19. Espace enseignant
- Classes, élèves, devoirs, évaluations, emploi du temps et annonces.
- Créer des devoirs pour toute une classe, un groupe ou un élève.

## 20. Espace école
- Gestion des classes, élèves, enseignants, listes de fournitures, annonces, calendrier, cantine, activités et documents.

## 21. Administration
- Utilisateurs, écoles, vendeurs, produits, catégories, commandes, paiements, livraisons, activités, cantine, transport, contenus, avis, signalements, documents, statistiques, paramètres et logs.

## 22. Sécurité / RGPD
- Supabase RLS, permissions par rôle, validation serveur/client, stockage privé, audit logs et protection contre accès non autorisés.
- Ne mettre aucune clé secrète dans l'application mobile.
- Prévoir minimisation des données, contrôle d'accès, suppression/export et consentement parental lorsque nécessaire.

## 23. Splash Screen + cache
- Au lancement : logo LENNY-FOURNITURE, slogan, barre de progression et « Préparation de votre expérience... ».
- Initialiser application, Supabase, réseau, session, profil, permissions, enfants et données nécessaires.
- Créer SplashScreen, cacheService, startupService, sessionService et offlineService.
- Stratégie CACHE-FIRST : cache → affichage rapide → actualisation serveur → mise à jour du cache.
- États : INITIALIZING, LOADING, READY, REFRESHING, OFFLINE, ERROR.
- Ne jamais stocker secrets/tokens sensibles dans un cache non sécurisé.

## 24. Mode hors connexion
- Afficher « Hors connexion » et permettre l'accès aux données déjà disponibles lorsque possible.
- Au retour : « Connexion rétablie » puis synchronisation automatique.

## 25. Internationalisation
- Français et anglais au lancement.
- Architecture extensible : Centrafrique, Côte d'Ivoire, Cameroun, Sénégal, RDC, etc.
- Prévoir pays, devise, fuseau horaire, formats de date et système éducatif configurable.

## 26. Navigation mobile
- Parent : Accueil | Enfants | École | Boutique | Profil.
- Élève : Accueil | Cours | Devoirs | Assistant | Profil.
- Enseignant : Accueil | Classes | Devoirs | Notes | Profil.
- Vendeur : Dashboard | Produits | Commandes | Ventes | Profil.

## 27. Design et accessibilité
- Design moderne, premium, familial, éducatif et rassurant, sans être trop enfantin.
- Mode clair/sombre, responsive, animations légères, VoiceOver, TalkBack et zones tactiles adaptées.
- Composants réutilisables : Button, Input, Card, Badge, Avatar, Modal, BottomSheet, Tabs, SearchBar, ProductCard, SchoolCard, ChildCard, HomeworkCard, GradeCard, OrderCard, PaymentCard, SkeletonLoader, LoadingState, EmptyState, ErrorState.

## 28. Architecture technique
- Par défaut si le projet est vide : React Native + Expo + TypeScript strict + Expo Router + Supabase/PostgreSQL + Auth + Storage + RLS.
- État : Zustand ou équivalent. Formulaires : React Hook Form + Zod.
- Organisation : src/app, components, features, services, hooks, stores, types, utils, constants, config.

## 29. Base de données
Prévoir : profiles, parent_profiles, student_profiles, teacher_profiles, school_profiles, seller_profiles, parent_children, schools, school_years, classes, class_students, class_teachers, subjects, timetables, homework, homework_submissions, grades, report_cards, school_supply_lists, school_supply_list_items, products, product_categories, product_images, product_reviews, inventory, carts, cart_items, orders, order_items, order_status_history, addresses, deliveries, delivery_agents, payments, invoices, refunds, books, uniforms, activities, activity_bookings, canteens, canteen_menus, canteen_reservations, school_transport, transport_routes, transport_stops, documents, notifications, announcements, ai_conversations, ai_messages, favorites, search_history, audit_logs.

Créer PK, FK, index, timestamps, created_by, updated_at et soft delete lorsque pertinent.

## 30. Stockage
- Buckets privés : avatars, school_documents, report_cards, homework_files, product_images, school_images.
- Configurer correctement les policies.

## 31. Tests
- Tests unitaires, composants, intégration, permissions et RLS.
- Tester parent/enfant, liste fournitures, panier, commande, élève/devoir, IA, enseignant/devoir, école/liste, vendeur/produit et admin/utilisateur.

## 32. Phases de développement
- Phase 1 : architecture, Auth, rôles, Supabase, RLS, navigation, design, Splash, cache, offline.
- Phase 2 : parents, enfants, écoles, classes, emploi du temps, devoirs, notes.
- Phase 3 : marketplace, produits, vendeurs, panier, commandes.
- Phase 4 : listes scolaires, scanner IA, rentrée.
- Phase 5 : cantine, transport, activités, documents.
- Phase 6 : assistant IA, quiz, révisions.
- Phase 7 : paiements, livraison, notifications.
- Phase 8 : administration, statistiques, audit, sécurité.
- Phase 9 : tests, optimisation, accessibilité, internationalisation.

## 33. Règles pour Claude Code
- Inspecter d'abord le projet existant et ne rien supprimer arbitrairement.
- Modifier directement le projet : pas seulement une maquette.
- Pas de faux boutons, fausses commandes, fausses permissions ou données fictives présentées comme réelles.
- Après chaque phase : vérifier TypeScript, tests, navigation, permissions, migrations et RLS.
- Créer .env.example sans secrets et un README complet.
- Si une API externe nécessite une clé absente, créer une abstraction propre et un mode développement clairement identifié.
- Commencer par inspecter le projet puis implémenter la Phase 1.
