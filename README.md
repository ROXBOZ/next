# 🎴 Poetic Tarot - Le Tarot Réinventé avec IA

**Un jeu de tarot qui passe du délirant au poétique, du kitsch à l'IA**

Ce projet a commencé comme une blague et s'est transformé en une expérience ludique : un jeu de cartes de tarot qui mélange tradition, humour, féminisme radical, et technologie moderne. Le but est simple — tirez des cartes de tarot, interprétez-les, et laissez l'expérience être à la fois poétique, surréaliste, et franchement amusante.

---

## ✨ Fonctionnalités Magiques

### 🃏 Mécanique de Jeu

- **Tirage & Mélange Aléatoire:** Les cartes sont brassées complètement au hasard, imitant l'imprévisibilité d'un vrai tarot.
- **Cartes Renversées:** Comme dans un vrai tarot, les cartes peuvent apparaître à l'endroit ou renversées, ajoutant une couche d'interprétation.
- **Modes de Lecture Multiples:** Choisissez entre différents types de tirages (passé-présent-futur, problème-cause-solution, etc.).
- **Système de Question:** Posez votre question pour contextualiser la lecture — avec détecteur de charabia qui vous répond avec humour!

### 🎨 UI/UX Réfléchie

- **Interface Responsive:** S'adapte parfaitement aux écrans de toutes tailles, du mobile au grand écran.
- **Design Inspiré de l'Esthétique Tarot:** Une fusion entre le mystique traditionnel et le web moderne.
- **Feedback Sonore Immersif:**
  - Sons de mélange, sélection et placement de cartes
  - Petits effets sonores cachés (comme un rire lorsqu'on clique sur le logo!)
  - Sons adaptés à chaque interaction pour une expérience sensorielle complète
- **Animations Fluides:** Transitions douces pour le retournement des cartes et affichage des interprétations.
- **Micro-interactions:** Des petites surprises interactives parsemées dans l'interface.

### 🤖 Intelligence Artificielle

- **Interprétations IA (via OpenAI):** Recevez une lecture personnalisée générée par l'IA pour votre tirage spécifique.
- **Prompts Personnalisés:** L'IA est configurée avec un prompt sophistiqué qui garantit des interprétations:
  - Modernes et inclusives (écriture inclusive avec points médians)
  - Féministes et empowering (adieu les conseils paternalistes!)
  - Avec une pointe d'humour et de second degré
  - Structurées avec soin pour une lecture agréable
- **Détection de Non-Sens:** Un algorithme examine votre question pour détecter si c'est du charabia et vous répond avec une touche d'humour.

### 📚 Contenu Riche

- **Guide de Tarot Intégré:** Plus besoin du petit livret classique! Consultez les significations directement dans l'app.
- **Significations Contextuelles:** Les interprétations changent selon la position (passé/présent/futur) et l'orientation (à l'endroit/renversée).
- **Réponses Créatives aux Erreurs:** Messages d'erreur humoristiques comme "Les esprits ont quitté le chat?" ou "T'écris avec tes pieds?"

---

## 🛠️ Stack Technologique

- **Framework:** [Next.js 15.5](https://nextjs.org/) avec Turbopack pour des performances optimisées
- **Frontend:** [React 19.1](https://react.dev/) pour une interface utilisateur réactive
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) pour un design rapide et flexible
- **IA:**
  - [OpenAI API](https://platform.openai.com/) pour les interprétations de tarot
  - [Groq SDK](https://groq.com/) comme alternative rapide à OpenAI
- **Audio:** API Web Audio pour une expérience sonore immersive
- **TypeScript:** Pour un développement robuste et typé
- **Testing:** Tests unitaires pour les fonctions utilitaires critiques

---

## 🧙‍♀️ Caractéristiques Techniques

### Architecture

- **Hooks Personnalisés:** `useTarotGame` pour isoler la logique de jeu
- **Utilitaires Modulaires:**
  - `shuffle.ts` pour la mécanique de mélange
  - `sound.ts` pour la gestion audio
  - `questionValidation.ts` pour la détection de charabia
  - `readingHelpers.ts` pour la préparation des interprétations
- **Composants React:** Séparation claire entre présentation et logique

### Spécificités Code

- **Sons Préchargés:** Bibliothèque d'effets sonores pour une réactivité instantanée
- **Algorithme de Validation:** Détecte le charabia à partir de patterns typiques (répétition de caractères, absence de voyelles...)
- **Prompt Engineering:** Design sophistiqué des prompts OpenAI pour garantir des interprétations de qualité
- **Optimisations de Performance:** Utilisation de useCallback et useMemo pour minimiser les rendus inutiles

---

## 🚧 Roadmap

- Réécriture et expansion des interprétations de cartes avec une touche poétique
- Création d'illustrations originales pour toutes les cartes de tarot
- Amélioration des prompts IA pour des lectures plus évocatrices et narratives
- Expérimentation avec [React Native](https://reactnative.dev/) pour une expérience plus app-native
- Ajout continu de petites surprises et easter eggs
- Ajout de nouveaux types de tirages et de nouvelles cartes
- Intégration d'un mode sombre/clair pour la lecture nocturne ou diurne
- Fonctionnalité de sauvegarde des tirages préférés

---

## � Philosophie & Esprit

Ce projet ne prend pas le tarot trop au sérieux — il s'agit **d'avoir du fun, d'expérimenter et d'explorer des questions de design et d'UX de manière créative**.\
C'est à la fois un terrain de jeu technologique (IA, UI/UX, design sonore) et une expérience artistique avec une touche féministe et inclusive.

Le tarot est utilisé ici comme prétexte pour créer une expérience numérique qui soit à la fois:

- Accessible et inclusive
- Techniquement innovante
- Visuellement captivante
- Auditivement immersive
- Et fondamentalement joyeuse!

---

## 🚀 Démarrer le Projet

Clonez le repo, installez les dépendances et lancez le serveur de développement:

```bash
git clone <repo-url>
cd poetic-tarot
npm install
npm run dev --turbopack
```

Puis ouvrez <http://localhost:3000> dans votre navigateur et laissez la magie opérer! ✨

---

## 🔮 Et Si Vous Ne Croyez Pas au Tarot?

Aucun problème! Ce projet est avant tout une exploration créative de l'interface entre tradition et technologie. Que vous soyez sceptique ou convaincu.e, l'important est de s'amuser et peut-être de découvrir quelque chose sur vous-même en cours de route... ou au moins de rire un bon coup quand l'appli vous dira "Les esprits ont quitté le chat?" après un charabia tapé au clavier!
