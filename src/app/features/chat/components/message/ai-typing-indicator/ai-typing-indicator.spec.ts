import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AITypingIndicator } from './ai-typing-indicator';
import { provideZonelessChangeDetection } from '@angular/core';

describe('AITypingIndicator', () => {
  let component: AITypingIndicator;
  let fixture: ComponentFixture<AITypingIndicator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AITypingIndicator],
      providers: [
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AITypingIndicator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize currentTime on init', () => {
    // @ts-expect-error: Accessing protected member in test
    expect(component.currentTime).toBeDefined();

    // @ts-expect-error: Accessing protected member in test
    expect(component.currentTime).not.toBe('');
  });

  it('should display the current time in the correct format', () => {
    // Mock the date to have a consistent test
    const mockDate = new Date('2023-01-01T12:30:00');
    jasmine.clock().mockDate(mockDate);

    // Create a new component instance with the mocked date
    fixture = TestBed.createComponent(AITypingIndicator);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Get the expected formatted time
    const expectedTime = mockDate.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    // Access the protected property using type assertion
    // @ts-expect-error: Accessing protected member in test
    expect(component.currentTime).toBe(expectedTime);

    // Check that the time appears in the template
    const timeElement = fixture.nativeElement.querySelector('.opacity-70');
    expect(timeElement.textContent).toBe(expectedTime);
  });

  it('should render the loading animation', () => {
    const loadingDots = fixture.nativeElement.querySelectorAll('.animate-pulse');
    expect(loadingDots.length).toBe(3);
  });
});
