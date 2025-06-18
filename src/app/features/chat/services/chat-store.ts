import { inject, Injectable, signal } from '@angular/core';
import { finalize, Observable, of, tap } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { OllamaFacade } from '../../../core/ollama/ollama-facade';
import { StorageFacade } from '../../../core/storage/storage-facade';
import { Message } from '../models/message';
import { Session } from '../models/session';

@Injectable({
  providedIn: 'root'
})
export class ChatStore {
  private readonly ollamaFacade = inject(OllamaFacade);
  private readonly storageFacade = inject(StorageFacade);
  private readonly localStorageKey = 'nexusChat_sessions';

  private readonly $activeSessionId = signal<string | null>(null);
  readonly sessions = signal<Session[]>(this.loadSessions());
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
    const newSession: Session = {
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

    const userMessage: Message = {
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

    // Format messages for the chat API
    const systemMessage: Pick<Message, 'role'|'content'> = {
      role: 'system',
      content: `You are a helpful, emotionally aware AI assistant. 
      Analyze the tone, emotional state, and intent of the user silently.
      Based on that, respond with a clear, concise, emotionally appropriate reply.
      Your reply should match the user's tone and emotional state while staying within professional, respectful boundaries.
      Do not include any explanation, summary, or internal reasoning.`
    };

    const formattedMessages = [
      systemMessage,
      ...updatedSession.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    return this.ollamaFacade.chat(formattedMessages).pipe(
      tap(response => {
        const assistantMessage: Message = {
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

  private loadSessions(): Session[] {
    return this.storageFacade.getItem<Session[]>(this.localStorageKey, []);
  }

  private saveSessions(): void {
    this.storageFacade.setItem(this.localStorageKey, this.sessions());
  }

  private prepareConversationPrompt(messages: Message[]): string {
    const conversation = messages.map(msg =>
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n\n');
    const prompt = `You are a helpful, emotionally aware AI assistant.
      Here is our conversation so far:
      //#region conversation
      ${conversation}
      //#endregion

      Instructions:
      - Read and understand the entire conversation for full context.
      - Analyze the tone, emotional state, and intent of the user silently (do not output any of this).
      - Based on that, respond ONLY to the **latest user message**, with a single, clear, concise, emotionally appropriate reply.
      - Your reply should:
        - Match the user's tone and emotional state.
        - Stay within professional, respectful boundaries.
        - Not include any explanation, summary, or internal reasoning.
        - Not reference the conversation or context explicitly.
        - Be focused **only on the most recent user message.**

      ❗ Output ONLY the assistant’s reply — no analysis, no reflection, no meta-comments.
    `;

    return prompt;
  }
}
