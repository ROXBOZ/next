# Tarot Application

**Interactive Tarot Card Reading Web Application**

This project is a modern web application that implements an interactive tarot card reading experience, showcasing advanced front-end development techniques and AI integration. It demonstrates implementation of complex state management, audio integration, and custom algorithms for card manipulation.

---

## Technical Overview

### Core Functionality

- **Card Randomization Algorithm:** Implementation of Fisher-Yates shuffle algorithm to generate truly random card sequences.
- **State Management:** Complex state handling for card orientation (upright/reversed) and positional context.
- **Multiple Reading Patterns:** Modular architecture supporting various card layouts (past-present-future, problem-cause-solution).
- **Input Validation System:** Natural language processing techniques to validate user input with feedback mechanisms.

### Front-End Implementation

- **Responsive Design:** CSS Grid and Flexbox implementation ensuring full responsiveness across device sizes.
- **Web Audio Integration:** Implementation of the Web Audio API for interactive audio feedback.
- **CSS Animations:** Usage of CSS transitions and keyframe animations for card interactions.
- **Custom Event System:** Event delegation pattern for handling complex user interactions.

### AI Integration

- **OpenAI API Integration:** Implementation of streaming responses from GPT models for dynamic content generation.
- **Prompt Engineering:** Structured prompt design techniques to generate consistent, formatted interpretations.
- **Content Filtering:** Input sanitization and output processing to ensure appropriate content.
- **Fallback Systems:** Offline functionality when AI services are unavailable.

### 📚 Contenu Riche

- **Guide de Tarot Intégré:** Plus besoin du petit livret classique! Consultez les significations directement dans l'app.
- **Significations Contextuelles:** Les interprétations changent selon la position (passé/présent/futur) et l'orientation (à l'endroit/renversée).
- **Réponses Créatives aux Erreurs:** Messages d'erreur humoristiques comme "Les esprits ont quitté le chat?" ou "T'écris avec tes pieds?"

---

## Technical Stack

- **Framework:** [Next.js 15.5](https://nextjs.org/) with Turbopack for optimized performance
- **Frontend:** [React 19.1](https://react.dev/) for reactive UI components
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) for utility-first styling approach
- **AI Integration:**
  - [OpenAI API](https://platform.openai.com/) for generative content
  - [Groq SDK](https://groq.com/) as an alternative LLM provider
- **Audio:** Web Audio API implementation for interactive sound effects
- **TypeScript:** Static typing for enhanced code reliability
- **Testing:** Jest for unit testing of core utility functions

---

## Architecture & Implementation

### Component Architecture

- **Custom React Hooks:** `useTarotGame` hook encapsulating core game state logic
- **Modular Utility Pattern:**
  - `shuffle.ts`: Implementation of card randomization algorithm
  - `sound.ts`: Audio buffer management and playback system
  - `questionValidation.ts`: Text analysis for input validation
  - `readingHelpers.ts`: Card interpretation data transformation
- **React Component Structure:** Presentation components separated from state management

### Technical Implementations

- **Audio Preloading System:** Audio buffer caching for immediate playback response
- **Text Analysis Algorithm:** Pattern recognition for identifying invalid input based on character distribution
- **Prompt Engineering Patterns:** Structured request formatting for consistent AI responses
- **Performance Optimizations:** Strategic implementation of useCallback and useMemo to prevent unnecessary re-renders

---

## Future Development

- Card illustrations
- Advanced prompt optimization for more structured AI responses
- Exploration of React Native implementation for cross-platform deployment

---

## Project Structure

The application demonstrates modern React architectural patterns:

```
src/
├── components/       # UI components with atomic design approach
├── constants/        # Static application data
├── hooks/            # Custom React hooks for state management
├── pages/            # Next.js page components and API routes
│   └── api/          # Backend API implementations
├── styles/           # CSS modules and global styles
├── types/            # TypeScript type definitions
└── utils/            # Pure utility functions for data manipulation
```

---

## Setup and Development

```bash
git clone <repo-url>
cd next
npm install
npm run dev
```

Access the application at http://localhost:3000

### Environment Variables

Create a `.env.local` file with the following variables:

```
OPENAI_API_KEY=your_openai_key
GROQ_API_KEY=your_groq_key  # Optional alternative
```

---

## Testing

Unit tests are implemented for core utility functions to ensure algorithm reliability:

```bash
npm test
```

The test suite focuses on validating the card randomization algorithms and input validation logic.
