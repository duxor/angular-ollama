import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MessageCard } from './message-card';
import { Message } from '../../../models/message';
import { provideMarkdown } from 'ngx-markdown';
import { provideZonelessChangeDetection } from '@angular/core';

describe('MessageCard', () => {
  let component: MessageCard;
  let fixture: ComponentFixture<MessageCard>;

  const mockUserMessage: Message = {
    id: '1',
    content: 'Hello, this is a test message',
    role: 'user',
    timestamp: new Date('2023-01-01T12:30:00')
  };

  const mockAssistantMessage: Message = {
    id: '2',
    content: 'Hello, I am the assistant',
    role: 'assistant',
    timestamp: new Date('2023-01-01T12:31:00')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageCard],
      providers: [
        provideMarkdown(),
        provideZonelessChangeDetection(),
      ]
    })
    .compileComponents();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(MessageCard);
    component = fixture.componentInstance;

    // Set the required input signal
    fixture.componentRef.setInput('message', mockUserMessage);

    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should identify user messages correctly', () => {
    fixture = TestBed.createComponent(MessageCard);
    component = fixture.componentInstance;

    // Set user message
    fixture.componentRef.setInput('message', mockUserMessage);
    fixture.detectChanges();

    expect(component.isUser).toBe(true);

    // Set assistant message
    fixture.componentRef.setInput('message', mockAssistantMessage);
    fixture.detectChanges();

    expect(component.isUser).toBe(false);
  });

  it('should format time correctly', () => {
    fixture = TestBed.createComponent(MessageCard);
    component = fixture.componentInstance;

    // Set message with known timestamp
    fixture.componentRef.setInput('message', mockUserMessage);
    fixture.detectChanges();

    const expectedTime = new Date(mockUserMessage.timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    expect(component.formattedTime).toBe(expectedTime);

    // Check that the time appears in the template
    const timeElement = fixture.debugElement.query(By.css('.opacity-70'));
    expect(timeElement.nativeElement.textContent).toBe(expectedTime);
  });

  it('should render user message with correct styling', () => {
    fixture = TestBed.createComponent(MessageCard);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('message', mockUserMessage);
    fixture.detectChanges();

    const messageBubble = fixture.debugElement.query(By.css('.rounded-2xl'));
    expect(messageBubble.classes['bg-blue-600']).toBeTruthy();

    const nameElement = fixture.debugElement.query(By.css('.font-medium'));
    expect(nameElement.nativeElement.textContent).toBe('You');
  });

  it('should render assistant message with correct styling', () => {
    fixture = TestBed.createComponent(MessageCard);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('message', mockAssistantMessage);
    fixture.detectChanges();

    const messageBubble = fixture.debugElement.query(By.css('.rounded-2xl'));
    expect(messageBubble.classes['bg-gray-800']).toBeTruthy();

    const nameElement = fixture.debugElement.query(By.css('.font-medium'));
    expect(nameElement.nativeElement.textContent).toBe('NexusChat');
  });
});
