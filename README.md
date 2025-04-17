# Code IDE

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-0.0.1-green.svg)

A modern, web-based code editor environment built with React, TypeScript, and Monaco Editor. This lightweight IDE provides a seamless development experience directly in your browser.

## Features

- **File Explorer**: Browse, create, rename, and manage your project files and folders
- **Monaco Code Editor**: Enjoy powerful code editing with syntax highlighting and auto-completion
- **Live Preview**: See your web application render in real-time as you code
- **Terminal**: Execute commands and view build output in the integrated terminal
- **Build System**: Compile and bundle your code with ESBuild integration
- **Multi-pane Layout**: Flexible, resizable split-pane interface
- **Theme Support**: Custom dark theme with syntax highlighting

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Build Tools**: Vite, ESBuild
- **Editor**: Monaco Editor
- **Styling**: Tailwind CSS, SCSS
- **State Management**: Zustand
- **Terminal**: XTerm.js
- **Code Bundling**: ESBuild

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/code-IDE.git
cd code-IDE

# Install dependencies
npm install
# or with pnpm
pnpm install
```

### Development

```bash
# Start the development server
npm run dev
# or with pnpm
pnpm dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

```bash
# Build the application
npm run build
# or with pnpm
pnpm build

# Preview the production build
npm run preview
# or with pnpm
pnpm preview
```

## Usage

1. **Creating Files**: Use the "+" icon in the File Explorer section to create new files
2. **Creating Folders**: Use the folder icon to create new directories
3. **Editing Code**: Click on any file to open it in the Monaco editor
4. **Running the App**: Click the Run button (▶️) to build and preview your application
5. **Terminal Commands**: Use the integrated terminal to run commands like `build`, `run`, `ls`, etc.

## Project Structure

```
code-IDE/
├── public/            # Static assets
├── src/
│   ├── components/    # React components
│   │   ├── BuildButton/
│   │   ├── CodeEditor/
│   │   ├── CodeTerminal/
│   │   ├── FileExplorer/
│   │   ├── PreviewWindow/
│   │   └── ui/        # Reusable UI components
│   ├── lib/           # Utility functions
│   ├── stores/        # State management
│   ├── App.tsx        # Main application component
│   └── main.tsx       # Application entry point
└── package.json       # Project dependencies
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
