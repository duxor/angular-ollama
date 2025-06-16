import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MessageList } from './message-list';
import { ChatMessage } from '../../../models/chat-message';
import { provideZonelessChangeDetection } from '@angular/core';
import { AITypingIndicator } from '../ai-typing-indicator/ai-typing-indicator';
import { MessageItem } from '../message-item/message-item';

describe('MessageList', () => {
  let component: MessageList;
  let fixture: ComponentFixture<MessageList>;

  const mockMessages: ChatMessage[] = [
    {
      id: '1',
      content: 'Hello, this is a test message',
      role: 'user',
      timestamp: new Date('2023-01-01T12:30:00')
    },
    {
      id: '2',
      content: 'Hello, I am the assistant',
      role: 'assistant',
      timestamp: new Date('2023-01-01T12:31:00')
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageList],
      providers: [
        provideZonelessChangeDetection(),
      ]
    })
    .compileComponents();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(MessageList);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display welcome message when no messages', () => {
    fixture = TestBed.createComponent(MessageList);
    component = fixture.componentInstance;

    // Set empty messages array
    fixture.componentRef.setInput('messages', []);
    fixture.detectChanges();

    const welcomeMessage = fixture.debugElement.query(By.css('h2'));
    expect(welcomeMessage).toBeTruthy();
    expect(welcomeMessage.nativeElement.textContent).toContain('Welcome to NexusChat');
  });

  it('should display messages when available', () => {
    fixture = TestBed.createComponent(MessageList);
    component = fixture.componentInstance;

    // Set messages
    fixture.componentRef.setInput('messages', mockMessages);
    fixture.detectChanges();

    const messageItems = fixture.debugElement.queryAll(By.directive(MessageItem));
    expect(messageItems.length).toBe(2);
  });

  it('should display loading indicator when isLoading is true', () => {
    fixture = TestBed.createComponent(MessageList);
    component = fixture.componentInstance;

    // Set messages and loading state
    fixture.componentRef.setInput('messages', mockMessages);
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    const loadingIndicator = fixture.debugElement.query(By.directive(AITypingIndicator));
    expect(loadingIndicator).toBeTruthy();
  });

  it('should not display loading indicator when isLoading is false', () => {
    fixture = TestBed.createComponent(MessageList);
    component = fixture.componentInstance;

    // Set messages and loading state
    fixture.componentRef.setInput('messages', mockMessages);
    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();

    const loadingIndicator = fixture.debugElement.query(By.directive(AITypingIndicator));
    expect(loadingIndicator).toBeFalsy();
  });

  it('should emit sendMessage event when suggestion is clicked', () => {
    fixture = TestBed.createComponent(MessageList);
    component = fixture.componentInstance;

    // Set empty messages to show suggestions
    fixture.componentRef.setInput('messages', []);
    fixture.detectChanges();

    // Spy on the output signal
    const sendMessageSpy = spyOn(component.sendMessage, 'emit');

    // Find and click a suggestion
    const suggestion = fixture.debugElement.query(By.css('[class*="cursor-pointer"]'));
    suggestion.triggerEventHandler('click', null);

    expect(sendMessageSpy).toHaveBeenCalled();
  });

  it('should attempt to scroll to bottom after view checked', () => {
    fixture = TestBed.createComponent(MessageList);
    component = fixture.componentInstance;

    // Spy on the scrollToBottom method
    // @ts-expect-error: Accessing protected member in test
    const scrollSpy = spyOn<MessageListTest>(component as MessageListTest, 'scrollToBottom');

    // Trigger ngAfterViewChecked
    component.ngAfterViewChecked();

    expect(scrollSpy).toHaveBeenCalled();
  });
});
