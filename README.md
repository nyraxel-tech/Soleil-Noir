# Soleil Noir · Animation Library

Application de suivi d'animés avec scraping automatique d'AnimeHeaven.

## Fonctionnalités

- **Nouveautés** — derniers épisodes sortis sur AnimeHeaven, mis à jour toutes les 10 minutes
- **Ranking** — système de classement personnel (E → S+)
- **Bibliothèque** — suivi de progression par épisode
- **Archives** — catalogue cumulatif de tous les animés

## Stack

- Frontend : HTML / CSS / JS (Vanilla)
- Backend : Vercel (proxy images + API)
- Scraping : GitHub Actions (Node.js)
- Données : `data.json` + `archive.json`

## Déploiement

Hébergé sur [Vercel](https://anitrack-beige.vercel.app) · Scraping automatique via GitHub Actions
