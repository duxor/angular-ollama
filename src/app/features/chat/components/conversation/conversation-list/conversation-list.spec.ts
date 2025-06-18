import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ConversationList } from './conversation-list';
import { Session } from '../../../models/session';
import { provideZonelessChangeDetection } from '@angular/core';

describe('ConversationList', () => {
  let component: ConversationList;
  let fixture: ComponentFixture<ConversationList>;

  const mockSessions: Session[] = [
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConversationList],
      providers: [provideZonelessChangeDetection()],
    })
    .compileComponents();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(ConversationList);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('conversations', mockSessions);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display conversations when provided', () => {
    fixture = TestBed.createComponent(ConversationList);
    component = fixture.componentInstance;

    // Set conversations
    fixture.componentRef.setInput('conversations', mockSessions);
    fixture.detectChanges();

    // Use a more specific selector to get only the session title elements
    const sessionElements = fixture.debugElement.queryAll(By.css('.truncate span'));

    // Verify that we have the correct number of conversations
    expect(sessionElements.length).toBe(2);

    // Verify the session titles
    expect(sessionElements[0].nativeElement.textContent.trim()).toBe('First Chat');
    expect(sessionElements[1].nativeElement.textContent.trim()).toBe('Second Chat');
  });

  it('should highlight active session', () => {
    fixture = TestBed.createComponent(ConversationList);
    component = fixture.componentInstance;

    // Set conversations and active session
    fixture.componentRef.setInput('conversations', mockSessions);
    fixture.componentRef.setInput('activeSessionId', '1');
    fixture.detectChanges();

    // Debug: Log the HTML to see what's being rendered
    console.log('HTML:', fixture.nativeElement.innerHTML);

    // Get the session container elements
    const sessionElements = fixture.debugElement.queryAll(By.css('.flex.items-center.justify-between'));

    // Log the classes of each session element
    sessionElements.forEach((el, i) => {
      console.log(`Session ${i} classes:`, el.nativeElement.className);
    });

    // Verify that the active session has the bg-gray-700 class and the inactive session doesn't
    expect(sessionElements[0].nativeElement.classList.contains('bg-gray-700')).toBeTrue();
    expect(sessionElements[1].nativeElement.classList.contains('bg-gray-700')).toBeFalse();
  });

  it('should emit setActiveSession when session is clicked', () => {
    fixture = TestBed.createComponent(ConversationList);
    component = fixture.componentInstance;

    // Set conversations
    fixture.componentRef.setInput('conversations', mockSessions);
    fixture.detectChanges();

    // Debug: Log the HTML to see what's being rendered
    console.log('HTML for click test:', fixture.nativeElement.innerHTML);

    // Spy on the output signal
    const setActiveSessionSpy = spyOn(component.setActiveSession, 'emit');

    // Get the session container elements
    const sessionElements = fixture.debugElement.queryAll(By.css('.flex.items-center.justify-between'));
    console.log('Session elements for click test:', sessionElements.length);

    // Click the first session
    sessionElements[0].nativeElement.click();

    // Verify that the setActiveSession event was emitted with the correct session ID
    expect(setActiveSessionSpy).toHaveBeenCalledWith('1');
  });

  it('should emit deleteSession when delete button is clicked', () => {
    fixture = TestBed.createComponent(ConversationList);
    component = fixture.componentInstance;

    // Set conversations
    fixture.componentRef.setInput('conversations', mockSessions);
    fixture.detectChanges();

    // Spy on the output signal
    const deleteSessionSpy = spyOn(component.deleteSession, 'emit');

    // Click the delete button of the first session
    const deleteButtons = fixture.debugElement.queryAll(By.css('[class*="hover:text-red-400"]'));
    deleteButtons[0].triggerEventHandler('click', { stopPropagation: () => { /* Implementation to prevent event bubbling */ } });

    expect(deleteSessionSpy).toHaveBeenCalledWith('1');
  });

  it('should emit createNewSession when new chat button is clicked', () => {
    fixture = TestBed.createComponent(ConversationList);
    component = fixture.componentInstance;

    // Set required input
    fixture.componentRef.setInput('conversations', mockSessions);
    fixture.detectChanges();

    // Spy on the output signal
    const createNewSessionSpy = spyOn(component.createNewSession, 'emit');

    // Click the new chat button
    const newChatButton = fixture.debugElement.query(By.css('button'));
    newChatButton.triggerEventHandler('click', null);

    expect(createNewSessionSpy).toHaveBeenCalled();
  });
});
