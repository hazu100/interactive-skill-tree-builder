# 🎯 Interactive Skill Tree Builder

A modern, interactive skill tree application built with React, TypeScript, and ReactFlow. Create, manage, and unlock skills in a visual tree structure with dynamic connections and real-time progress tracking.

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** (version 20.19+ or 22.12+) - Required by Vite
- **npm** or **yarn** package manager
- Modern web browser with ES6 support

### Important Notes
- **React Version**: This project uses React 18 due to ReactFlow compatibility issues with React 19
- **Node.js Version**: Vite requires Node.js version 20.19+ or 22.12+ for optimal performance

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd interactive-skill-tree-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

### Available Scripts

- **`npm run dev`** - Start development server with hot reload
- **`npm run build`** - Build for production
- **`npm run lint`** - Run ESLint for code quality checks
- **`npm run test`** - Run Jest unit tests
- **`npm run test:coverage`** - Run tests with coverage report

### Production Build

To create a production build:

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## ✨ Features

### Core Functionality
- **Dynamic Skill Creation**: Add new skills with custom names, descriptions, costs, and level requirements
- **Interactive Skill Tree**: Visual node-based interface using ReactFlow
- **Skill Unlocking System**: Unlock skills by spending points when prerequisites are met
- **Connection Management**: Create prerequisite connections between skills
- **Progress Tracking**: Real-time tracking of user level, available points, and unlocked skills
- **Data Persistence**: Automatic saving to localStorage with data restoration on page reload

### 🎁 Bonus Features

#### 🔍 Smart Search System
- **Real-time Search**: Search skills by name with instant filtering
- **Visual Highlighting**: Matching skills are highlighted in the skill tree
- **Clear Search**: One-click search clearing functionality
- **Case-insensitive Matching**: Flexible search that works regardless of capitalization

#### 📊 User Progress Dashboard
- **Current Points Display**: Shows available skill points (💎 Points)
- **Level Tracking**: Displays current user level (⭐ Level)
- **Skill Counter**: Shows total number of skills created (🎯 Skills)
- **Real-time Updates**: All stats update immediately as you interact with skills

#### 🚨 Smart Error Handling
- **Connection Validation**: Prevents adding prerequisites to already unlocked skills
- **Modal Error Messages**: User-friendly error dialogs with clear explanations
- **Prerequisite Checking**: Validates that prerequisites are met before allowing unlocks
- **Resource Validation**: Ensures sufficient points and level requirements

#### 🎨 Enhanced User Experience
- **Beautiful UI**: Gradient backgrounds, smooth animations, and modern styling
- **Intuitive Controls**: Drag-and-drop nodes, zoom and pan functionality
- **Visual Feedback**: Different colors for locked, unlockable, and unlocked skills

## 💾 Data Persistence with localStorage

The application uses **localStorage** to automatically save all your progress and skill tree data in your browser.

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── SkillForm.tsx    # Skill creation form
│   ├── SkillNode.tsx    # Individual skill node component
│   └── SearchBar.tsx    # Search functionality
├── hooks/               # Custom React hooks
│   └── useLocalStorage.ts
├── types/               # TypeScript type definitions
│   └── index.ts
├── utils/               # Utility functions
│   └── treeUtils.ts
├── __tests__/           # Test files
│   ├── App.test.tsx
│   └── ReactFlowIntegration.test.tsx
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

## 🧪 Testing

The project includes comprehensive unit tests covering:

- **Node Creation**: Form submission and skill creation
- **Connection Management**: Prerequisites and edge creation
- **Unlock Functionality**: Resource validation and unlock logic
- **Search Features**: Text search and highlighting
- **Error Handling**: Modal dialogs and validation

Run tests with:
```bash
npm test
```

## 🤖 AI Tool Usage Disclosure - Chatgpt & Copilot

- ****: 
- **Testing**: Comprehensive unit test suites with Jest and React Testing Library
- **Documentation**: README structure, code comments, and setup instructions
- **Styling**: Creating modern styles/color guidance etc

## 🛠️ Technologies Used

- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **ReactFlow** - Interactive node-based user interface
- **Material-UI (MUI)** - React component library
- **Jest** - JavaScript testing framework
- **React Testing Library** - React-specific testing utilities

## 📝 Usage Guide

### Creating Skills
1. Fill out the "Add New Skill" form in the left sidebar
2. Enter skill name, description, cost (points), and level requirement
3. Click "Add Skill" to create the node in the tree

### Searching Skills
1. Use the search bar at the top of the sidebar
2. Type any part of a skill name to filter results
3. Matching skills will be highlighted in the tree
4. Click the clear button (✕) to reset the search

### Unlocking Skills
1. Click on any unlockable skill node (blue color)
2. Ensure you have sufficient points and meet level requirements
3. Prerequisites must be unlocked first
4. Click "🔓 Unlock" to spend points and unlock the skill

### Creating Connections
1. Drag from the bottom handle of a prerequisite skill
2. Connect to the top handle of the dependent skill
3. Connections create prerequisite relationships
4. Error messages will appear for invalid connections
