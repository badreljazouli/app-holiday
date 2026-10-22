# Carnet de poche

Un carnet de voyage pour iPhone, pour n'importe quel voyage, d'un week-end à Paris à quinze jours en Thaïlande : budget, programme jour par jour, réservations, valise et carte des étapes.

**Ouvrir l'app :** https://badreljazouli.github.io/app-holiday/

## L'installer sur l'iPhone

1. Ouvrir le lien ci-dessus dans **Safari**.
2. Toucher **Partager**, puis **Sur l'écran d'accueil**.
3. Ouvrir ensuite l'app **toujours par l'icône Carnet**, pas par Safari.

L'icône et Safari ont chacun leur propre mémoire sur iPhone : un voyage créé dans l'un n'apparaît pas dans l'autre.

## Ce que fait l'app

- **Aperçu :** compte à rebours sur un billet d'embarquement, carte de la route, budget, échéances (annulation gratuite, prélèvements), choses à faire et prochaines activités. Pendant le voyage : la journée en cours, ce qui a été dépensé et l'hôtel du soir.
- **Budget :** total engagé, payé, réservé et prévu, convertisseur de devise, répartition par poste ou par étape (chaque groupe se déplie avec ses lignes, avec une enveloppe par poste) et journal filtrable.
- **Jours :** pour chaque jour, le trajet, la nuit et les activités, plus des idées à placer.
- **Résas :** à réserver, réservé à payer, payé, avec alertes à 14 jours.
- **Valise :** liste par rubrique, préparée selon le type de voyage.
- **Carte :** étapes numérotées, route tracée selon le transport (avion en pointillés, bateau en tirets, route en trait plein) et une fiche par étape avec dates, trajet, hôtel et itinéraire vers Plans. Les étapes se placent seules à partir de leur nom, et on peut déplacer un repère à la main.
- Mode jour, mode nuit, ou automatique selon l'iPhone.
- Fonctionne hors connexion une fois ouverte ; les zones de carte déjà consultées restent disponibles.

## Les données

Les voyages sont enregistrés **uniquement sur le téléphone** (stockage local du navigateur). Rien n'est envoyé sur un serveur, et ce dépôt ne contient aucune donnée personnelle.

> ⚠️ **Supprimer l'icône de l'écran d'accueil efface tous les voyages.** Fais une sauvegarde régulièrement.

**Sauvegarder :** Réglages, puis « Envoyer la sauvegarde… » (vers Notes, Mail ou Messages) ou « Copier la sauvegarde ». Le texte commence par `CARNET1:`.

**Restaurer :** Réglages, puis « Restaurer une sauvegarde » : coller le texte et toucher « Restaurer ». Attention, la restauration remplace tout le contenu de l'app.

L'app rappelle de faire une sauvegarde quand la dernière date de plus de 14 jours.

## Comment c'est fait

Pas de compilation ni de dépendances à installer : une page HTML, publiée telle quelle par GitHub Pages.

| Fichier | Rôle |
| --- | --- |
| `index.html` | Toute l'app : styles, écrans et logique (JavaScript sans framework). |
| `sw.js` | Service worker : fonctionnement hors connexion et cache des tuiles de carte. |
| `manifest.webmanifest`, `*.png` | Nom, couleurs et icônes pour l'écran d'accueil. |
| `vendor/` | MapLibre GL JS, le moteur de carte, servi depuis le dépôt pour marcher hors connexion. |
| `.nojekyll` | Demande à GitHub Pages de publier les fichiers tels quels. |

### Publier une modification

1. Modifier `index.html` (et `sw.js` si besoin).
2. Augmenter `VERSION` dans `index.html` et `CACHE` dans `sw.js`, pour que les iPhone récupèrent la nouvelle version.
3. Pousser sur `main` : GitHub Pages publie en une à deux minutes. Sur le téléphone, fermer puis rouvrir l'app.

La page est servie « réseau d'abord » : en ligne, l'app charge toujours la dernière version. Les données ne sont pas touchées par une mise à jour.

### Clés de stockage

`carnet-poche-v1` (les voyages), `carnet-poche-ui` (dernier onglet et filtres), `carnet-poche-theme` (jour, nuit ou auto), `carnet-poche-lastbackup` (date de la dernière sauvegarde).

## Services utilisés et crédits

- Fond de carte : [OpenFreeMap](https://openfreemap.org) (styles Positron et Dark), données © [OpenMapTiles](https://openmaptiles.org) et © les contributeurs [OpenStreetMap](https://www.openstreetmap.org/copyright). Sans clé d'API.
- Moteur de carte : [MapLibre GL JS](https://maplibre.org), licence BSD 3 clauses (`vendor/MAPLIBRE-LICENSE.txt`).
- Recherche des lieux à partir du nom des étapes : [Photon](https://photon.komoot.io) (komoot), puis [Nominatim](https://nominatim.openstreetmap.org) en secours. Seul le nom de l'étape leur est envoyé.
- Itinéraires : ouverts dans Plans (Apple).
- Polices : Barlow et Barlow Condensed, via Google Fonts.
