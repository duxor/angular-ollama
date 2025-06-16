import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ChatPage } from './chat-page';
import { ChatStore } from '../../services/chat-store';
import { OllamaApi } from '../../../../core/ollama/ollama-api';
import { OllamaStore } from '../../../../core/ollama/ollama-store';
import { ChatSession } from '../../models/chat-session';
import { provideZonelessChangeDetection, signal } from '@angular/core';

describe('ChatPage', () => {
  let component: ChatPage;
  let fixture: ComponentFixture<ChatPage>;
  let mockChatStore: jasmine.SpyObj<ChatStore>;
  let mockOllamaApi: jasmine.SpyObj<OllamaApi>;
  let mockOllamaStore: jasmine.SpyObj<OllamaStore>;

  const mockSession: ChatSession = {
    id: '1',
    title: 'Test Session',
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockModels = ['llama3.1', 'gemma3', 'mistral'];

  beforeEach(async () => {
    // Create mock services
    mockChatStore = jasmine.createSpyObj('ChatStore', 
      ['createNewSession', 'setActiveSession', 'deleteSession', 'sendMessage'],
      {
        $sessions: signal([mockSession]),
        activeSession: signal(mockSession),
        $isLoading: signal(false)
      }
    );

    mockOllamaApi = jasmine.createSpyObj('OllamaApi', ['getAvailableModels']);
    mockOllamaApi.getAvailableModels.and.returnValue(of(mockModels));

    mockOllamaStore = jasmine.createSpyObj('OllamaStore', ['saveModel'], {
      currentModel: signal('llama3.1')
    });

    await TestBed.configureTestingModule({
      imports: [ChatPage, FormsModule],
      providers: [
        provideZonelessChangeDetection(),
        { provide: ChatStore, useValue: mockChatStore },
        { provide: OllamaApi, useValue: mockOllamaApi },
        { provide: OllamaStore, useValue: mockOllamaStore },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load available models on init', () => {
    expect(mockOllamaApi.getAvailableModels).toHaveBeenCalled();
    // @ts-expect-error: Accessing protected member in test
    expect(component.$availableModels()).toEqual(mockModels);
  });

  it('should initialize selected model from OllamaStore', () => {
    // @ts-expect-error: Accessing protected member in test
    expect(component.$selectedModel()).toBe('llama3.1');
  });

  it('should create a new session when createNewSession is called', () => {
    component.createNewSession();
    expect(mockChatStore.createNewSession).toHaveBeenCalled();
  });

  it('should set active session when setActiveSession is called', () => {
    component.setActiveSession('123');
    expect(mockChatStore.setActiveSession).toHaveBeenCalledWith('123');
  });

  it('should delete session when deleteSession is called', () => {
    component.deleteSession('123');
    expect(mockChatStore.deleteSession).toHaveBeenCalledWith('123');
  });

  it('should save model when model is changed', () => {
    component.onModelChange('gemma3');
    // @ts-expect-error: Accessing protected member in test
    expect(component.$selectedModel()).toBe('gemma3');
    expect(mockOllamaStore.saveModel).toHaveBeenCalledWith('gemma3');
  });

  it('should send message when sendMessage is called', () => {
    mockChatStore.sendMessage.and.returnValue(of('response'));

    component.sendMessage('Hello');

    expect(mockChatStore.sendMessage).toHaveBeenCalledWith('Hello');
  });

  it('should handle model initialization with no models', () => {
    // Reset the component
    fixture = TestBed.createComponent(ChatPage);
    component = fixture.componentInstance;

    // Mock empty models array
    mockOllamaApi.getAvailableModels.and.returnValue(of([]));

    // Initialize
    component.ngOnInit();

    // Expect empty selected model
    // @ts-expect-error: Accessing protected member in test
    expect(component.$selectedModel()).toBe('');
  });

  it('should handle model initialization with no saved model', () => {
    // Create a new mock with null current model
    const nullModelStore = jasmine.createSpyObj('OllamaStore', ['saveModel'], {
      currentModel: signal(null)
    });

    // Reset the test module with the new mock
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ChatPage, FormsModule],
      providers: [
        provideZonelessChangeDetection(),
        { provide: ChatStore, useValue: mockChatStore },
        { provide: OllamaApi, useValue: mockOllamaApi },
        { provide: OllamaStore, useValue: nullModelStore },
      ]
    }).compileComponents();

    // Create component with the new configuration
    fixture = TestBed.createComponent(ChatPage);
    component = fixture.componentInstance;

    // Initialize
    component.ngOnInit();

    // Should select first available model
    // @ts-expect-error: Accessing protected member in test
    expect(component.$selectedModel()).toBe(mockModels[0]);
  });
});
