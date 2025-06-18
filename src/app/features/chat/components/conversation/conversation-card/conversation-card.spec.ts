import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ConversationCard } from './conversation-card';
import { provideZonelessChangeDetection } from '@angular/core';
import { Session } from '../../../models/session';

describe('ConversationCard', () => {
  let component: ConversationCard;
  let fixture: ComponentFixture<ConversationCard>;

  const mockSession: Session = {
    id: '1',
    title: 'Test Conversation',
    messages: [],
    createdAt: new Date('2023-01-01T10:00:00'),
    updatedAt: new Date('2023-01-01T10:30:00')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConversationCard],
      providers: [provideZonelessChangeDetection()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConversationCard);
    component = fixture.componentInstance;

    // Set required input
    fixture.componentRef.setInput('session', mockSession);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the session title', () => {
    const titleElement = fixture.debugElement.query(By.css('span.truncate'));
    expect(titleElement.nativeElement.textContent.trim()).toBe('Test Conversation');
  });

  it('should apply active class when session is active', () => {
    // Set active session ID
    fixture.componentRef.setInput('activeSessionId', '1');
    fixture.detectChanges();

    const cardElement = fixture.debugElement.query(By.css('div[tabindex="0"]'));
    expect(cardElement.classes['bg-gray-700']).toBeTrue();
  });

  it('should not apply active class when session is not active', () => {
    // Set different active session ID
    fixture.componentRef.setInput('activeSessionId', '2');
    fixture.detectChanges();

    const cardElement = fixture.debugElement.query(By.css('div[tabindex="0"]'));
    expect(cardElement.classes['bg-gray-700']).toBeFalsy();
  });

  it('should emit setActiveSession event when clicked', () => {
    const setActiveSessionSpy = spyOn(component.setActiveSession, 'emit');
    const cardElement = fixture.debugElement.query(By.css('div[tabindex="0"]'));

    cardElement.triggerEventHandler('click', null);

    expect(setActiveSessionSpy).toHaveBeenCalledWith('1');
  });

  it('should emit setActiveSession event when Enter key is pressed', () => {
    const setActiveSessionSpy = spyOn(component.setActiveSession, 'emit');
    const cardElement = fixture.debugElement.query(By.css('div[tabindex="0"]'));

    cardElement.triggerEventHandler('keydown.enter', {});

    expect(setActiveSessionSpy).toHaveBeenCalledWith('1');
  });

  it('should emit setActiveSession event when Space key is pressed', () => {
    const setActiveSessionSpy = spyOn(component.setActiveSession, 'emit');
    const cardElement = fixture.debugElement.query(By.css('div[tabindex="0"]'));

    cardElement.triggerEventHandler('keydown.space', {});

    expect(setActiveSessionSpy).toHaveBeenCalledWith('1');
  });

  it('should emit deleteSession event when delete button is clicked', () => {
    const deleteSessionSpy = spyOn(component.deleteSession, 'emit');
    const deleteButton = fixture.debugElement.query(By.css('button'));

    // Create a mock event with stopPropagation method
    const mockEvent = { stopPropagation: jasmine.createSpy('stopPropagation') };

    deleteButton.triggerEventHandler('click', mockEvent);

    expect(deleteSessionSpy).toHaveBeenCalledWith('1');
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  it('should not emit setActiveSession when delete button is clicked', () => {
    const setActiveSessionSpy = spyOn(component.setActiveSession, 'emit');
    const deleteButton = fixture.debugElement.query(By.css('button'));

    // Create a mock event with stopPropagation method
    const mockEvent = { stopPropagation: jasmine.createSpy('stopPropagation') };

    deleteButton.triggerEventHandler('click', mockEvent);

    expect(setActiveSessionSpy).not.toHaveBeenCalled();
  });
});
