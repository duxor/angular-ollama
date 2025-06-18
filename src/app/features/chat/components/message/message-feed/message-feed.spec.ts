import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MessageFeed } from './message-feed';
import { Message } from '../../../models/message';
import { provideZonelessChangeDetection } from '@angular/core';
import { AITypingIndicator } from '../ai-typing-indicator/ai-typing-indicator';
import { MessageCard } from '../message-card/message-card';

describe('MessageFeed', () => {
  let component: MessageFeed;
  let fixture: ComponentFixture<MessageFeed>;

  const mockMessages: Message[] = [
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
      imports: [MessageFeed],
      providers: [provideZonelessChangeDetection()]
    })
    .compileComponents();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(MessageFeed);
    component = fixture.componentInstance;

    // Set required inputs
    fixture.componentRef.setInput('messages', []);
    fixture.componentRef.setInput('isLoading', false);

    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display welcome message when no messages', () => {
    fixture = TestBed.createComponent(MessageFeed);
    component = fixture.componentInstance;

    // Set empty messages array and loading state
    fixture.componentRef.setInput('messages', []);
    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();

    const welcomeMessage = fixture.debugElement.query(By.css('h2'));
    expect(welcomeMessage).toBeTruthy();
    expect(welcomeMessage.nativeElement.textContent).toContain('Welcome to NexusChat');
  });

  it('should display messages when available', () => {
    fixture = TestBed.createComponent(MessageFeed);
    component = fixture.componentInstance;

    // Set messages and loading state
    fixture.componentRef.setInput('messages', mockMessages);
    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();

    const messageItems = fixture.debugElement.queryAll(By.directive(MessageCard));
    expect(messageItems.length).toBe(2);
  });

  it('should display loading indicator when isLoading is true', () => {
    fixture = TestBed.createComponent(MessageFeed);
    component = fixture.componentInstance;

    // Set messages and loading state
    fixture.componentRef.setInput('messages', mockMessages);
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    const loadingIndicator = fixture.debugElement.query(By.directive(AITypingIndicator));
    expect(loadingIndicator).toBeTruthy();
  });

  it('should not display loading indicator when isLoading is false', () => {
    fixture = TestBed.createComponent(MessageFeed);
    component = fixture.componentInstance;

    // Set messages and loading state
    fixture.componentRef.setInput('messages', mockMessages);
    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();

    const loadingIndicator = fixture.debugElement.query(By.directive(AITypingIndicator));
    expect(loadingIndicator).toBeFalsy();
  });

  it('should emit sendMessage event when suggestion is clicked', () => {
    fixture = TestBed.createComponent(MessageFeed);
    component = fixture.componentInstance;

    // Set empty messages to show suggestions and loading state
    fixture.componentRef.setInput('messages', []);
    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();

    // Spy on the output signal
    const sendMessageSpy = spyOn(component.sendMessage, 'emit');

    // Find and click a suggestion
    const suggestion = fixture.debugElement.query(By.css('[class*="cursor-pointer"]'));
    suggestion.triggerEventHandler('click', null);

    expect(sendMessageSpy).toHaveBeenCalled();
  });

  it('should attempt to scroll to bottom after changes', () => {
    fixture = TestBed.createComponent(MessageFeed);
    component = fixture.componentInstance;

    // Set required inputs
    fixture.componentRef.setInput('messages', []);
    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();

    // Spy on the scrollToBottom method
    const scrollSpy = spyOn<any>(component, 'scrollToBottom');

    // Mock requestAnimationFrame to execute callback immediately
    const originalRAF = window.requestAnimationFrame;
    window.requestAnimationFrame = (cb: FrameRequestCallback): number => {
      cb(0);
      return 0;
    };

    // Trigger ngOnChanges
    component.ngOnChanges();

    // Verify scrollToBottom was called
    expect(scrollSpy).toHaveBeenCalled();

    // Restore original requestAnimationFrame
    window.requestAnimationFrame = originalRAF;
  });
});
