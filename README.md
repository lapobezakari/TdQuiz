# BrainWave — Plateforme Interactive de Quiz

Application web SPA développée avec React et Vite.js.  
Thèmes : Science · Histoire · Géographie · Cinéma · Musique

---

## Installation et lancement

```bash
npm install
npm run dev
```

L'application sera accessible sur **http://localhost:5173**

---

## Structure du projet

```
brainwave/
├── public/
│   └── questions.json
└── src/
    ├── hooks/
    │   └── useFetch.js
    ├── context/
    │   └── UserContext.jsx
    ├── components/
    │   └── ProtectedRoute.jsx
    ├── pages/
    │   ├── Home.jsx
    │   ├── QuizEngine.jsx
    │   └── Results.jsx
    └── App.jsx
```

## Fonctionnalités

- Authentification par pseudo avec route protégée (`ProtectedRoute`)
- Récupération des questions via un Custom Hook `useFetch`
- Chronomètre 60s avec `useRef` sans re-rendus inutiles
- Machine à état avec `useReducer` + `quizReducer`
- Données globales partagées via `Context API`
- Ratio de réussite optimisé avec `useMemo`
- Affichage du récapitulatif détaillé en fin de partie
