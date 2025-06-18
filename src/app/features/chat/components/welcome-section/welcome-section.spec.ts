import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { WelcomeSection } from './welcome-section';
import { provideZonelessChangeDetection } from '@angular/core';

describe('WelcomeSection', () => {
  let component: WelcomeSection;
  let fixture: ComponentFixture<WelcomeSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeSection],
      providers: [provideZonelessChangeDetection()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display welcome header and description', () => {
    const header = fixture.debugElement.query(By.css('h2'));
    const description = fixture.debugElement.query(By.css('p'));

    expect(header).toBeTruthy();
    expect(header.nativeElement.textContent).toContain('Welcome to NexusChat');
    expect(description).toBeTruthy();
    expect(description.nativeElement.textContent).toContain('Your gateway to AI-powered conversations');
  });

  it('should display all four suggestion cards', () => {
    const suggestionCards = fixture.debugElement.queryAll(By.css('[class*="cursor-pointer"]'));

    expect(suggestionCards.length).toBe(4);

    // Check that each card has the expected content
    expect(suggestionCards[0].query(By.css('h3')).nativeElement.textContent).toContain('Explain quantum computing');
    expect(suggestionCards[1].query(By.css('h3')).nativeElement.textContent).toContain('Write a poem about space');
    expect(suggestionCards[2].query(By.css('h3')).nativeElement.textContent).toContain('Debug my JavaScript code');
    expect(suggestionCards[3].query(By.css('h3')).nativeElement.textContent).toContain('Plan a 7-day itinerary');
  });

  it('should emit sendMessage event when a suggestion is clicked', () => {
    const sendMessageSpy = spyOn(component.sendMessage, 'emit');
    const suggestionCards = fixture.debugElement.queryAll(By.css('[class*="cursor-pointer"]'));

    // Click the first suggestion
    suggestionCards[0].triggerEventHandler('click', null);
    expect(sendMessageSpy).toHaveBeenCalledWith('Explain quantum computing');

    // Click the second suggestion
    suggestionCards[1].triggerEventHandler('click', null);
    expect(sendMessageSpy).toHaveBeenCalledWith('Write a poem about space');
  });

  it('should emit sendMessage event when enter key is pressed on a suggestion', () => {
    const sendMessageSpy = spyOn(component.sendMessage, 'emit');
    const suggestionCards = fixture.debugElement.queryAll(By.css('[class*="cursor-pointer"]'));

    // Press enter on the third suggestion
    suggestionCards[2].triggerEventHandler('keydown.enter', {});
    expect(sendMessageSpy).toHaveBeenCalledWith('Debug my JavaScript code');
  });

  it('should emit sendMessage event when space key is pressed on a suggestion', () => {
    const sendMessageSpy = spyOn(component.sendMessage, 'emit');
    const suggestionCards = fixture.debugElement.queryAll(By.css('[class*="cursor-pointer"]'));

    // Press space on the fourth suggestion
    suggestionCards[3].triggerEventHandler('keydown.space', {});
    expect(sendMessageSpy).toHaveBeenCalledWith('Plan a 7-day itinerary');
  });

  it('should call onSuggestionClick method with correct parameter', () => {
    const onSuggestionClickSpy = spyOn(component, 'onSuggestionClick');
    const suggestionCards = fixture.debugElement.queryAll(By.css('[class*="cursor-pointer"]'));

    suggestionCards[0].triggerEventHandler('click', null);
    expect(onSuggestionClickSpy).toHaveBeenCalledWith('Explain quantum computing');
  });
});
