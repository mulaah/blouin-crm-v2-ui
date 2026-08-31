# Blouin CRM — refonte UI (v2-ui)

Code source React + Tailwind de la direction retenue dans `Blouin_CRM_-_Propositions_UI`.
Rien n'a été écrit dans `blouin-crm-v2-database` : ce dossier est à copier.

## Contenu

```
tailwind.tokens.js                     tokens à fusionner dans tailwind.config.js
styles/tokens.css                      classes zellige + resets à fusionner dans styles/globals.css
lib/ui/types.ts                        view models (ce que consomme l'UI)
lib/ui/adapters.ts                     API -> view models  <-- le seul fichier à toucher pour brancher les données
lib/ui/format.ts                       argent, dates, heures (fr-CA)
components/ui2/                        6 composants factorisés
app/internal/layout.tsx                coquille
app/internal/InternalSidebar.tsx       sidebar restylée (compteurs par module)
app/internal/prospects/ProspectsPageContent.tsx        2a
app/internal/conventions/[id]/ConventionDetailView.tsx 2b
app/internal/consultations/[prospect_id]/ConsultationsView.tsx 2c
```

## ⚠ Dossiers à renommer avant de copier

Ce projet ne permet pas les crochets dans les noms de dossier. Deux dossiers sont
à renommer une fois le paquet récupéré :

```
app/internal/conventions/-id-/            ->  app/internal/conventions/[id]/
app/internal/consultations/-prospect_id-/ ->  app/internal/consultations/[prospect_id]/
```

## Installation

1. Fusionner `tailwind.tokens.js` dans `theme.extend` de `tailwind.config.js`.
2. Coller le contenu de `styles/tokens.css` dans `styles/globals.css` (remplace les blocs `.zellige-*`).
3. Copier `lib/ui/` et `components/ui2/` tels quels.
4. Copier les fichiers `app/internal/**` par-dessus les tiens (garde une copie des anciens).

Aucune dépendance nouvelle. Utilise `lucide-react` et `next/link`, déjà présents.

## Comment brancher tes API

Les vues sont **présentationnelles** : elles reçoivent des view models typés
(`lib/ui/types.ts`) et ne connaissent ni `fetch` ni la forme de tes lignes SQL.
La conversion vit dans `lib/ui/adapters.ts`, écrit contre les réponses actuelles de :

- `GET /api/internal/prospects`
- `GET /api/internal/conventions/[id]`
- `GET /api/internal/consultations/prospect/[prospect_id]`

Si une requête SQL change, tu modifies l'adaptateur, pas les composants.
Les `page.tsx` gardent la logique de chargement que tu as déjà (`useEffect` + `fetch`).

## Champs attendus mais absents de tes routes actuelles

Les slides affichent des valeurs que le SQL actuel ne renvoie pas. Les adaptateurs les
dégradent proprement (`null` -> `—`), à toi de compléter les requêtes :

| Écran | Champ | Route à compléter |
| --- | --- | --- |
| 2a | nb de consultations par prospect | `api/internal/prospects` |
| 2a | montant HT en cours par prospect | `api/internal/prospects` |
| 2a | statut de convention par prospect | `api/internal/prospects` |
| 2a | avocate assignée | `api/internal/prospects` |
| 2a/2b | composition du foyer (« 1 adulte · 2 enfants ») | `prospects_persons` |
| 2b | journal chronologique | `api/internal/activity-feed` filtré par convention |
| 2b | documents de la convention | à créer |
| 2c | prochain rendez-vous | `consultations` où `date_rdv > now()` |
| 2c | répartition par avocate | agrégat `GROUP BY avocate_id` |

## Charte appliquée

`#2C1810` brun · `#C9A961` doré · `#FAF6EE` crème · zellige 120 px · Poppins / Inter.
Les trois valeurs de doré qui coexistaient (`#C4A35A` dans `tailwind.config.js`,
`#C9A961` dans `app/lib/colors.ts`) sont unifiées sur celle des slides.
