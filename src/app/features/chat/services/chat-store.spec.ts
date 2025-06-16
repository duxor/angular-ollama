import { TestBed } from '@angular/core/testing';
import { ChatStore } from './chat-store';
import { OllamaApi } from '../../../core/ollama/ollama-api';
import { StorageFacade } from '../../../core/storage/storage-facade';
import { Observable, of, Subject } from 'rxjs';
import { ChatSession } from '../models/chat-session';
import { provideZonelessChangeDetection } from '@angular/core';

describe('ChatStore', () => {
  let service: ChatStore;
  let ollamaApiMock: jasmine.SpyObj<OllamaApi>;
  let storageFacadeMock: jasmine.SpyObj<StorageFacade>;

  // Mock data
  const mockSessions: ChatSession[] = [
    {
      id: '1',
      title: 'First Chat',
      messages: [],
      createdAt: new Date('2023-01-01T10:00:00'),
      updatedAt: new Date('2023-01-01T10:30:00')
    },
    {
      id: '2',
      title: 'Second Chat',
      messages: [],
      createdAt: new Date('2023-01-02T10:00:00'),
      updatedAt: new Date('2023-01-02T10:30:00')
    }
  ];

  beforeEach(() => {
    // Create mock services
    ollamaApiMock = jasmine.createSpyObj('OllamaApi', ['generate']);
    storageFacadeMock = jasmine.createSpyObj('StorageFacade', ['getItem', 'setItem']);

    // Configure default mock behavior
    ollamaApiMock.generate.and.returnValue(of('Mock response'));
    storageFacadeMock.getItem.and.returnValue([]);

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        ChatStore,
        { provide: OllamaApi, useValue: ollamaApiMock },
        { provide: StorageFacade, useValue: storageFacadeMock }
      ]
    });

    service = TestBed.inject(ChatStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initialization', () => {
    it('should create a new session if no sessions exist', () => {
      // The default mock returns empty array
      storageFacadeMock.getItem.and.returnValue([]);

      // Re-create service to trigger constructor
      service = TestBed.inject(ChatStore);

      // Verify a new session was created
      expect(service.$sessions().length).toBe(1);
      expect(storageFacadeMock.setItem).toHaveBeenCalled();
    });

    it('should set first session as active if sessions exist', () => {
      // Mock existing sessions
      storageFacadeMock.getItem.and.returnValue(mockSessions);

      // Re-create service to trigger constructor with a new instance
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          provideZonelessChangeDetection(),
          ChatStore,
          { provide: OllamaApi, useValue: ollamaApiMock },
          { provide: StorageFacade, useValue: storageFacadeMock }
        ]
      });
      service = TestBed.inject(ChatStore);

      // Verify first session is active
      expect(service.activeSession()?.id).toBe('1');
    });
  });

  describe('session management', () => {
    beforeEach(() => {
      // Set up with existing sessions for these tests
      storageFacadeMock.getItem.and.returnValue(mockSessions);
      service = TestBed.inject(ChatStore);
    });

    it('should create a new session', () => {
      const initialLength = service.$sessions().length;

      service.createNewSession();

      expect(service.$sessions().length).toBe(initialLength + 1);
      expect(service.$sessions()[0].title).toBe('New Chat');
      expect(service.activeSession()?.id).toBe(service.$sessions()[0].id);
      expect(storageFacadeMock.setItem).toHaveBeenCalled();
    });

    it('should set active session', () => {
      // Reset the service to ensure we have a clean state
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          provideZonelessChangeDetection(),
          ChatStore,
          { provide: OllamaApi, useValue: ollamaApiMock },
          { provide: StorageFacade, useValue: storageFacadeMock }
        ]
      });
      service = TestBed.inject(ChatStore);

      // Set up with existing sessions
      storageFacadeMock.getItem.and.returnValue(mockSessions);
      service = TestBed.inject(ChatStore);

      // Set active session
      service.setActiveSession('2');

      // Verify active session is set
      expect(service.activeSession()?.id).toBe('2');
    });

    it('should delete a session', () => {
      // Reset the service to ensure we have a clean state
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          provideZonelessChangeDetection(),
          ChatStore,
          { provide: OllamaApi, useValue: ollamaApiMock },
          { provide: StorageFacade, useValue: storageFacadeMock }
        ]
      });

      // Set up with existing sessions
      storageFacadeMock.getItem.and.returnValue(mockSessions);
      service = TestBed.inject(ChatStore);

      const initialLength = service.$sessions().length;

      service.deleteSession('2');

      expect(service.$sessions().length).toBe(initialLength - 1);
      expect(service.$sessions().find(s => s.id === '2')).toBeUndefined();
      expect(storageFacadeMock.setItem).toHaveBeenCalled();
    });

    it('should create a new session if all sessions are deleted', () => {
      // Delete all existing sessions
      mockSessions.forEach(session => {
        service.deleteSession(session.id);
      });

      // Verify a new session was created
      expect(service.$sessions().length).toBe(1);
    });

    it('should update session title', () => {
      // Reset the service to ensure we have a clean state
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          provideZonelessChangeDetection(),
          ChatStore,
          { provide: OllamaApi, useValue: ollamaApiMock },
          { provide: StorageFacade, useValue: storageFacadeMock }
        ]
      });

      // Set up with existing sessions
      storageFacadeMock.getItem.and.returnValue(mockSessions);
      service = TestBed.inject(ChatStore);

      const newTitle = 'Updated Title';

      service.updateSessionTitle('1', newTitle);

      const updatedSession = service.$sessions().find(s => s.id === '1');
      expect(updatedSession?.title).toBe(newTitle);
      expect(storageFacadeMock.setItem).toHaveBeenCalled();
    });
  });

  describe('messaging', () => {
    beforeEach(() => {
      // Reset the service to ensure we have a clean state
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          provideZonelessChangeDetection(),
          ChatStore,
          { provide: OllamaApi, useValue: ollamaApiMock },
          { provide: StorageFacade, useValue: storageFacadeMock }
        ]
      });

      // Set up with existing sessions for these tests
      storageFacadeMock.getItem.and.returnValue(mockSessions);
      service = TestBed.inject(ChatStore);
      service.setActiveSession('1');
    });

    it('should add user message and call API when sending a message', () => {
      const userMessage = 'Hello, AI!';

      // Create a new session with no messages
      service.createNewSession();

      // Mock the generate method to not complete immediately
      ollamaApiMock.generate.and.returnValue(new Observable(() => {
        // Don't complete the observable yet
      }));

      service.sendMessage(userMessage).subscribe();

      // Verify user message was added
      expect(service.activeSession()?.messages.length).toBe(1);
      expect(service.activeSession()?.messages[0].content).toBe(userMessage);
      expect(service.activeSession()?.messages[0].role).toBe('user');

      // Verify API was called
      expect(ollamaApiMock.generate).toHaveBeenCalled();
    });

    it('should add AI response when API returns', () => {
      const userMessage = 'Hello, AI!';
      const aiResponse = 'Hello, human!';
      ollamaApiMock.generate.and.returnValue(of(aiResponse));

      service.sendMessage(userMessage).subscribe();

      // Verify both messages were added
      expect(service.activeSession()?.messages.length).toBe(2);
      expect(service.activeSession()?.messages[0].role).toBe('user');
      expect(service.activeSession()?.messages[1].role).toBe('assistant');
      expect(service.activeSession()?.messages[1].content).toBe(aiResponse);
    });

    it('should update session title on first message', () => {
      const userMessage = 'This is a test message that will become the title';
      ollamaApiMock.generate.and.returnValue(of('Response'));

      // Ensure we're using a new session with default title
      service.createNewSession();

      service.sendMessage(userMessage).subscribe();

      // Verify title was updated
      expect(service.activeSession()?.title).toBe('This is a test message that wi...');
    });

    it('should truncate long titles', () => {
      const longMessage = 'This is a very long message that should be truncated when used as a title for the chat session';
      ollamaApiMock.generate.and.returnValue(of('Response'));

      // Ensure we're using a new session with default title
      service.createNewSession();

      service.sendMessage(longMessage).subscribe();

      // Verify title was truncated
      expect(service.activeSession()?.title.length).toBeLessThan(longMessage.length);
      expect(service.activeSession()?.title.endsWith('...')).toBeTrue();
    });

    it('should handle error when no active session', () => {
      // Mock no active session
      spyOn(service, 'activeSession').and.returnValue(null);

      // Should return empty observable
      let result: string | undefined;
      service.sendMessage('test').subscribe(res => {
        result = res;
      });

      expect(result).toBe('');
      expect(ollamaApiMock.generate).not.toHaveBeenCalled();
    });

    it('should set loading state during API call', () => {
      const userMessage = 'Hello, AI!';

      // Mock the generate method to not complete immediately
      ollamaApiMock.generate.and.returnValue(new Observable(() => {
        // Don't complete the observable yet
      }));

      expect(service.$isLoading()).toBeFalse();

      service.sendMessage(userMessage).subscribe();

      // Loading should be true during API call
      expect(service.$isLoading()).toBeTrue();
    });

    it('should handle loading state during API call', (done) => {
      const userMessage = 'Hello, AI!';

      // Create a new session to ensure we have a clean state
      service.createNewSession();

      // Use a subject to control when the API call completes
      const responseSubject = new Subject<string>();
      ollamaApiMock.generate.and.returnValue(responseSubject.asObservable());

      // Verify loading is false before sending message
      expect(service.$isLoading()).toBeFalse();

      // Send message
      service.sendMessage(userMessage).subscribe({
        next: (response) => {
          // Response should be 'Response'
          expect(response).toBe('Response');
        },
        complete: () => {
          // After a small delay, loading should be false after API call completes
          setTimeout(() => {
            expect(service.$isLoading()).toBeFalse();
            done();
          }, 0);
        }
      });

      // After a small delay, loading should be true during API call
      setTimeout(() => {
        expect(service.$isLoading()).toBeTrue();

        // Complete the API call
        responseSubject.next('Response');
        responseSubject.complete();
      }, 0);
    });
  });
});
