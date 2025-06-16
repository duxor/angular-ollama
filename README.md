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

### Troubleshooting Ollama Connection

If you encounter issues connecting to Ollama:

1. Verify Ollama is running with `ollama list`
2. Check if the API is accessible by visiting `http://localhost:11434/api/tags` in your browser
3. Ensure no firewall is blocking the connection
4. If using a different port or remote Ollama instance, modify the `ollamaBaseUrl` in `src/app/core/ollama/ollama-api.ts`

## Angular 20 Naming Convention

This project follows the new naming convention introduced with Angular 20:

1. **File Naming**: Uses kebab-case for all files (e.g., `chat-page.ts` instead of `chat.page.ts` or `chat-page.component.ts`)
2. **Component Structure**: Standalone components with co-located files (HTML, CSS, TS in the same directory)
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
        ├── message/
        │   ├── message-item/
        │   │   ├── message-item.ts
        │   │   ├── message-item.html
        │   │   └── message-item.css
        │   └── message-list/
        └── session/
            └── session-form/
```

## Project Structure

```
src/                       # Source code
├── app/                   # Application code
│   ├── core/              # Core functionality
│   │   ├── ollama/        # Ollama API integration
│   │   │   ├── ollama-api.spec.ts      # Tests for Ollama API
│   │   │   ├── ollama-api.ts           # API client for Ollama
│   │   │   ├── ollama-store.spec.ts    # Tests for Ollama store
│   │   │   └── ollama-store.ts         # State management for Ollama models
│   │   └── storage/       # Storage services
│   │       ├── storage-facade.spec.ts  # Tests for storage facade
│   │       └── storage-facade.ts       # Unified interface for storage operations
│   ├── features/          # Feature modules
│   │   └── chat/          # Chat feature
│   │       ├── components/# UI components
│   │       │   ├── message/# Message-related components
│   │       │   │   ├── ai-typing-indicator/  # Typing indicator component
│   │       │   │   │   ├── ai-typing-indicator.css
│   │       │   │   │   ├── ai-typing-indicator.html
│   │       │   │   │   ├── ai-typing-indicator.spec.ts
│   │       │   │   │   └── ai-typing-indicator.ts
│   │       │   │   ├── message-item/  # Individual message component
│   │       │   │   │   ├── message-item.css
│   │       │   │   │   ├── message-item.html
│   │       │   │   │   ├── message-item.spec.ts
│   │       │   │   │   └── message-item.ts
│   │       │   │   └── message-list/  # List of messages component
│   │       │   │       ├── message-list.css
│   │       │   │       ├── message-list.html
│   │       │   │       ├── message-list.spec.ts
│   │       │   │       └── message-list.ts
│   │       │   └── session/# Session-related components
│   │       │       ├── session-form/  # Form for creating/editing sessions
│   │       │       │   ├── session-form.css
│   │       │       │   ├── session-form.html
│   │       │       │   ├── session-form.spec.ts
│   │       │       │   └── session-form.ts
│   │       │       └── session-list/  # List of sessions component
│   │       │           ├── session-list.css
│   │       │           ├── session-list.html
│   │       │           ├── session-list.spec.ts
│   │       │           └── session-list.ts
│   │       ├── models/    # Data models
│   │       │   ├── chat-message.ts    # Message model
│   │       │   └── chat-session.ts    # Session model
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

- Component tests for all UI components (MessageItem, MessageList, SessionForm, SessionList, etc.)
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
