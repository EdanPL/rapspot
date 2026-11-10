# Rapspot

Un jeu web interactif de blind-test musical dédié au rap français. Le but du jeu est simple : deviner le titre d'un morceau le plus rapidement possible grâce à des extraits audio de plus en plus longs (de 0.1s à 15s).

**Jouez ici :** `[Remplace par ton lien edan.github.io/rapspot]`

## Fonctionnalités Principales
* **Système de progression audio** : 5 paliers d'écoute ultra-courts (0.1s, 0.5s, 2s, 8s, 15s) pour tester la rapidité des joueurs.
* **Moteur de recherche intelligent** : Barre de saisie avec autocomplétion instantanée basée sur le catalogue chargé.
* **Filtres dynamiques** : Génération automatique de catégories pour les artistes possédant plus de 10 morceaux dans la base de données, avec un algorithme de mélange (Fisher-Yates) à chaque sélection.
* **Design immersif & Responsive** : Interface "dark mode" fluide, animations CSS, et adaptation complète aux écrans mobiles (smartphones & tablettes).
* **Gamification** : Suivi des victoires consécutives (streak) et modification dynamique des couleurs du thème selon la difficulté atteinte.

## Architecture Technique
Ce projet a été architecturé pour fonctionner de manière entièrement statique côté client, garantissant une absence totale de latence audio (crucial pour les extraits de 0.1s) et une compatibilité parfaite avec l'hébergement gratuit GitHub Pages.

* **Frontend** : HTML5, CSS3, Vanilla JavaScript (ES6 Modules).
* **Data Pipeline (ETL)** : Un script Python indépendant (`scraper.py`) agit comme un extracteur de données. Il interroge l'API publique de Deezer, filtre les données brutes (nettoyage des doublons, vérification stricte de la disponibilité des flux audio de 30s), et génère automatiquement la base de données statique dans `assets/js/data.js`.

## Installation en local (Développement)

### 1. Lancement du jeu
Clonez ce dépôt et ouvrez simplement le fichier `index.html` dans votre navigateur, ou utilisez une extension comme *Live Server* sur VS Code.
```bash
git clone https://github.com/ton-pseudo/rapspot.git
```

### 2. Mise à jour de la base de données musicale
Si vous souhaitez actualiser la playlist via l'API Deezer, l'outil Python est fourni à la racine :
```bash
# Installation de la dépendance réseau
pip install requests

# Lancement du pipeline d'extraction
python scraper.py
```
Le fichier `data.js` sera écrasé et mis à jour automatiquement avec de nouveaux morceaux valides.

## À propos de l'auteur
**Edan Pierre-Louis**
Étudiant en BUT2 Informatique à l'Université Paris Cité, passionné par la conception logicielle et le développement web. 

*Actuellement à la recherche d'un stage de 10 semaines et d'une alternance de 24 mois (dès septembre 2026) dans les secteurs de la tech, de la finance ou du luxe.*

* **Contact** : edanoah24@gmail.com
* **Portfolio GitHub** : https://github.com/EdanPL
