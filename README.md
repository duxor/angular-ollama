# NexusChat - Angular Ollama Integration

NexusChat is a modern chat application built with Angular 20 that integrates with Ollama to provide AI-powered conversations. The application allows users to create and manage chat sessions, interact with various AI models, and receive markdown-formatted responses.

## Features

- **Multiple Chat Sessions**: Create, manage, and switch between different chat conversations
- **AI Model Selection**: Choose from available Ollama models for your conversations
- **Markdown Support**: AI responses are formatted in markdown for better readability
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Persistent Storage**: Chat history and settings are saved locally
- **Real-time Typing Indicator**: Visual feedback when the AI is generating a response

## Prerequisites

Before running this application, you need to have the following installed:

1. **Node.js** (v20.11.1 or later)
2. **npm** (v9 or later)
3. **Angular CLI** (v20 or later)
4. **Ollama** - Follow the installation instructions at [Ollama's official website](https://ollama.ai)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/duxor/angular-ollama.git
   cd angular-ollama
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Make sure Ollama is running:
   ```bash
   ollama serve
   ```

4. Pull at least one model (if you haven't already):
   ```bash
   ollama pull llama3.1
   ```

## Development Server

To start the development server:

```bash
npm start
```

Navigate to `http://localhost:4200/` in your browser. The application will automatically reload if you change any of the source files.

## Building for Production

To build the project for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Architecture and Design

### State Management

The application uses a combination of Angular signals and services for state management:

- **ChatStore**: Manages chat sessions, messages, and the active session state
- **OllamaStore**: Manages Ollama model selection and persistence
- **StorageFacade**: Provides a unified interface for local storage operations

This separation of concerns makes the code more maintainable and testable.

### Ollama Integration

This application connects to a local Ollama instance running on `http://localhost:11434/api`. Make sure:

1. Ollama is running before starting the application
2. You have downloaded at least one model (for example `mistral` or `llama3.1`)
3. Your firewall allows connections to port 11434

#### Auto-detection of Available Models

The application automatically detects all locally available Ollama models by querying the Ollama API endpoint at `http://localhost:11434/api/tags`. When the application starts, it:

1. Fetches the list of all models you have downloaded locally
2. Populates the model selection dropdown with these models
3. Either selects your previously used model or defaults to the first available model

This means you don't need to manually configure which models are available - just download models using the Ollama CLI (`ollama pull <model-name>`), and they will automatically appear in the application.

### Troubleshooting Ollama Connection

If you encounter issues connecting to Ollama:

1. Verify Ollama is running with `ollama list`
2. Check if the API is accessible by visiting `http://localhost:11434/api/tags` in your browser
3. Ensure no firewall is blocking the connection
4. If using a different port or remote Ollama instance, modify the `ollamaBaseUrl` in `src/app/core/ollama/ollama-api.ts`

## Angular 20 Naming Convention

This project follows the new naming convention introduced with Angular 20:

1. **File Naming**: Uses kebab-case for all files (e.g., `chat-page.ts` instead of `chat.page.ts` or `chat-page.component.ts`)
2. **Component Structure**: Standalone components are used
3. **Simplified Imports**: No module declarations for standalone components
4. **Signal-based State Management**: Uses Angular's signal API for state management, including:
   - Input signals (`input()`) instead of `@Input()` decorators
   - Output signals (`output()`) instead of `@Output()` and `EventEmitter`
   - View queries (`viewChild()`) instead of `@ViewChild()`
5. **Folder Organization**: Components are organized by feature and then by functionality

Example of the new naming convention:
```
features/
└── chat/
    └── components/
        ├── conversation/
        │   ├── conversation-card/
        │   │   ├── conversation-card.ts
        │   │   ├── conversation-card.html
        │   │   └── conversation-card.css
        │   └── conversation-list/
        ├── layout/
        │   ├── chat-panel/
        │   └── chat-sidebar/
        └── message/
            ├── message-card/
            ├── message-feed/
            ├── message-form/
            └── welcome-section/
```

## Project Structure

### Feature-First Architecture Overview

This project follows a feature-first architecture, which organizes code by feature rather than by technical role. This approach:

- **Improves Discoverability**: Related code is grouped together regardless of its technical role
- **Enhances Modularity**: Features are self-contained and can be developed independently
- **Simplifies Maintenance**: Changes to a feature affect code in a single location

The high-level structure is:

```
src/app/
├── core/              # Shared core functionality (services, APIs)
│   ├── ollama/        # Ollama API integration
│   └── storage/       # Storage services
├── shared/            # Shared components, directives, pipes
└── features/          # Feature modules
    └── chat/          # Chat feature
        ├── components/# UI components organized by functionality
        ├── models/    # Feature-specific data models
        ├── pages/     # Page components
        └── services/  # Feature-specific services
```

### Detailed Project Structure

```
src/                       # Source code
├── app/                   # Application code
│   ├── core/              # Core functionality
│   │   ├── ollama/        # Ollama API integration
│   │   │   ├── ollama-api.spec.ts      # Tests for Ollama API
│   │   │   ├── ollama-api.ts           # API client for Ollama
│   │   │   ├── ollama-facade.spec.ts   # Tests for Ollama facade
│   │   │   ├── ollama-facade.ts        # Facade for Ollama services
│   │   │   ├── ollama-store.spec.ts    # Tests for Ollama store
│   │   │   └── ollama-store.ts         # State management for Ollama models
│   │   └── storage/       # Storage services
│   │       ├── storage-facade.spec.ts  # Tests for storage facade
│   │       └── storage-facade.ts       # Unified interface for storage operations
│   ├── features/          # Feature modules
│   │   └── chat/          # Chat feature
│   │       ├── components/# UI components
│   │       │   ├── conversation/# Conversation-related components
│   │       │   │   ├── conversation-card/  # Individual conversation component
│   │       │   │   │   ├── conversation-card.css
│   │       │   │   │   ├── conversation-card.html
│   │       │   │   │   ├── conversation-card.spec.ts
│   │       │   │   │   └── conversation-card.ts
│   │       │   │   └── conversation-list/  # List of conversations component
│   │       │   │       ├── conversation-list.css
│   │       │   │       ├── conversation-list.html
│   │       │   │       ├── conversation-list.spec.ts
│   │       │   │       └── conversation-list.ts
│   │       │   ├── layout/  # Layout components
│   │       │   │   ├── chat-panel/  # Main content panel
│   │       │   │   │   ├── chat-panel.css
│   │       │   │   │   ├── chat-panel.html
│   │       │   │   │   ├── chat-panel.spec.ts
│   │       │   │   │   └── chat-panel.ts
│   │       │   │   └── chat-sidebar/  # Sidebar component
│   │       │   │       ├── chat-sidebar.css
│   │       │   │       ├── chat-sidebar.html
│   │       │   │       ├── chat-sidebar.spec.ts
│   │       │   │       └── chat-sidebar.ts
│   │       │   ├── message/# Message-related components
│   │       │   │   ├── ai-typing-indicator/  # Typing indicator component
│   │       │   │   │   ├── ai-typing-indicator.css
│   │       │   │   │   ├── ai-typing-indicator.html
│   │       │   │   │   ├── ai-typing-indicator.spec.ts
│   │       │   │   │   └── ai-typing-indicator.ts
│   │       │   │   ├── message-card/  # Individual message component
│   │       │   │   │   ├── message-card.css
│   │       │   │   │   ├── message-card.html
│   │       │   │   │   ├── message-card.spec.ts
│   │       │   │   │   └── message-card.ts
│   │       │   │   ├── message-feed/  # List of messages component
│   │       │   │   │   ├── message-feed.css
│   │       │   │   │   ├── message-feed.html
│   │       │   │   │   ├── message-feed.spec.ts
│   │       │   │   │   └── message-feed.ts
│   │       │   │   └── message-form/  # Form for creating messages
│   │       │   │       ├── message-form.css
│   │       │   │       ├── message-form.html
│   │       │   │       ├── message-form.spec.ts
│   │       │   │       └── message-form.ts
│   │       │   └── welcome-section/  # Welcome section component
│   │       │       ├── welcome-section.css
│   │       │       ├── welcome-section.html
│   │       │       ├── welcome-section.spec.ts
│   │       │       └── welcome-section.ts
│   │       ├── models/    # Data models
│   │       │   ├── message.ts    # Message model
│   │       │   └── session.ts    # Session model
│   │       ├── pages/     # Page components
│   │       │   └── chat-page/         # Main chat page
│   │       │       ├── chat-page.css
│   │       │       ├── chat-page.html
│   │       │       ├── chat-page.spec.ts
│   │       │       └── chat-page.ts
│   │       └── services/  # Feature-specific services
│   │           ├── chat-store.spec.ts # Tests for chat store
│   │           └── chat-store.ts      # State management for chat
│   ├── app.config.ts      # App configuration
│   ├── app.css            # App styles
│   ├── app.html           # App component template
│   ├── app.routes.ts      # Routing configuration
│   ├── app.spec.ts        # Tests for app component
│   └── app.ts             # App component
├── index.html             # Main HTML file
├── main.ts                # Application entry point
└── styles.css             # Global styles
```

## Running Tests

The project includes comprehensive unit tests for all components and services, including:

- Component tests for all UI components (MessageCard, MessageFeed, MessageForm, ConversationList, etc.)
- Service tests for OllamaApi, ChatStore, and other services
- Tests for signal-based inputs and outputs
- Tests for the AI typing indicator

To execute the unit tests:

```bash
npm test
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Angular](https://angular.dev) - The web framework used
- [Ollama](https://ollama.ai) - For providing the AI capabilities
- [TailwindCSS](https://tailwindcss.com) - For the styling
- [ngx-markdown](https://github.com/jfcere/ngx-markdown) - For markdown rendering

# Support

If you need any help with setting up or configuring the environment, feel free to contact me on [LinkedIn](https://www.linkedin.com/in/dusanperisic/).

If you find this project helpful and would like to support its development, you can buy me a coffee:

<a href="https://www.buymeacoffee.com/duxor" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>
