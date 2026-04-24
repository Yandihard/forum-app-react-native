# Forum App - React Native (Clean Architecture)

A professional mobile forum application built with React Native and Expo, following **Clean Architecture** principles and a **Feature-Based** folder structure.

## 🚀 Technology Stack

- **Framework**: [Expo](https://expo.dev/) (SDK 52)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Data Fetching**: [TanStack React Query](https://tanstack.com/query/latest)
- **Navigation**: [React Navigation](https://reactnavigation.org/) (Stack & Tabs)
- **Networking**: [Axios](https://axios-http.com/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Local Storage**: [Async Storage](https://react-native-async-storage.github.io/async-storage/)

## 🏗️ Architecture & Folder Structure

This project follows **Clean Architecture**, which separates the code into three main layers: **Domain**, **Data**, and **Presentation**. Each feature is encapsulated within its own directory.

### Folder Breakdown:

```text
src/
├── app/                      # Main entry point, navigation setup, and global providers
├── core/                     # Infrastructure: API client, Redux store, themes, and global utils
├── shared/                   # Reusable UI components, custom hooks, and global types
└── features/                 # Modular feature folders (e.g., auth, forum, profile)
    └── [feature-name]/
        ├── data/             # API calls, DTOs (Models), and Repository implementations
        ├── domain/           # Business logic: Entities, UseCases, and Repository interfaces
        └── presentation/     # UI: Components, Screens, and ViewModels (Hooks)
```

### Path Aliases
We use path aliases to avoid long relative imports. You can use `@/` to refer to the `src/` directory.
- Example: `import { User } from '@/features/auth/domain/entities/User';`

## 🛠️ Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- Expo Go app on your mobile device (to test on physical hardware)

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App
- **Start the project**:
  ```bash
  npm start
  ```
- **Android**: Press `a` in the terminal after starting.
- **iOS**: Press `i` in the terminal after starting (requires macOS).
- **Web**: Press `w` in the terminal.

## 📐 Clean Architecture Rules

To maintain a scalable and maintainable codebase, follow these strict dependency rules:

1.  **Domain Layer** is the heart of the feature. It should NOT import anything from the Data or Presentation layers. It only contains pure business logic and interfaces.
2.  **Data Layer** implements the repository interfaces from the Domain layer. It handles external data sources (API, Local Storage) and maps them to Domain Entities.
3.  **Presentation Layer** is responsible for the UI. It interacts with the Domain layer through Use Cases or Custom Hooks (View Models). It should never call the API directly.

## 📝 License
This project is private and intended for portfolio purposes.
