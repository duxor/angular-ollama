import { Injectable, inject, signal } from '@angular/core';
import { Observable, finalize, of, tap } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { OllamaApi } from '../../../core/ollama/ollama-api';
import { StorageFacade } from '../../../core/storage/storage-facade';
import { ChatMessage } from '../models/chat-message';
import { ChatSession } from '../models/chat-session';

@Injectable({
  providedIn: 'root'
})
export class ChatStore {
  private readonly ollamaApi = inject(OllamaApi);
  private readonly storageFacade = inject(StorageFacade);
  private readonly localStorageKey = 'nexusChat_sessions';

  private readonly $activeSessionId = signal<string | null>(null);
  readonly sessions = signal<ChatSession[]>(this.loadSessions());
  readonly $sessions = this.sessions;
  readonly $isLoading = signal<boolean>(false);

  constructor() {
    if (this.sessions().length === 0) {
      this.createNewSession();
      return;
    }
    this.$activeSessionId.set(this.sessions()[0].id);
  }

  activeSession() {
    const id = this.$activeSessionId();
    if (!id) {
      return null;
    }
    return this.sessions().find(session => session.id === id) || null;
  }

  createNewSession(): void {
    const newSession: ChatSession = {
      id: uuidv4(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.sessions.update(sessions => [newSession, ...sessions]);
    this.$activeSessionId.set(newSession.id);
    this.saveSessions();
  }

  setActiveSession(sessionId: string): void {
    this.$activeSessionId.set(sessionId);
  }

  deleteSession(sessionId: string): void {
    const updatedSessions = this.sessions().filter(session => session.id !== sessionId);
    this.sessions.set(updatedSessions);

    if (this.$activeSessionId() === sessionId) {
      this.$activeSessionId.set(updatedSessions.length > 0 ? updatedSessions[0].id : null);
    }

    if (updatedSessions.length === 0) {
      this.createNewSession();
    }

    this.saveSessions();
  }

  updateSessionTitle(sessionId: string, title: string): void {
    this.sessions.update(sessions =>
      sessions.map(session => {
        if (session.id === sessionId) {
          return {
            ...session,
            title,
            updatedAt: new Date()
          };
        }
        return session;
      })
    );

    this.saveSessions();
  }

  sendMessage(content: string): Observable<string> {
    const activeSession = this.activeSession();

    if (!activeSession) {
      console.error('No active session found');
      return of('');
    }

    this.$isLoading.set(true);

    const userMessage: ChatMessage = {
      id: uuidv4(),
      content,
      role: 'user',
      timestamp: new Date()
    };

    const updatedSession = {
      ...activeSession,
      messages: [...activeSession.messages, userMessage],
      updatedAt: new Date()
    };

    // Update session title if this is the first message and the session has the default title
    if (updatedSession.messages.length === 1 && updatedSession.title === 'New Chat') {
      const title = content.length > 30 
        ? content.substring(0, 30) + '...'
        : content;

      updatedSession.title = title;
    }

    this.sessions.update(sessions =>
      sessions.map(session => 
        session.id === updatedSession.id ? updatedSession : session
      )
    );
    this.saveSessions();

    const conversationPrompt = this.prepareConversationPrompt(updatedSession.messages);

    return this.ollamaApi.generate(conversationPrompt).pipe(
      tap(response => {
        const assistantMessage: ChatMessage = {
          id: uuidv4(),
          content: response,
          role: 'assistant',
          timestamp: new Date()
        };

        const sessionWithResponse = {
          ...updatedSession,
          messages: [...updatedSession.messages, assistantMessage],
          updatedAt: new Date()
        };

        this.sessions.update(sessions =>
          sessions.map(session => 
            session.id === sessionWithResponse.id ? sessionWithResponse : session
          )
        );
        this.saveSessions();
      }),
      finalize(() => {
        this.$isLoading.set(false);
      })
    );
  }

  private loadSessions(): ChatSession[] {
    return this.storageFacade.getItem<ChatSession[]>(this.localStorageKey, []);
  }

  private saveSessions(): void {
    this.storageFacade.setItem(this.localStorageKey, this.sessions());
  }

  private prepareConversationPrompt(messages: ChatMessage[]): string {
    return messages.map(msg => 
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n\n');
  }
}
