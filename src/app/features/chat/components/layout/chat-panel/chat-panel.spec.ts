import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, input, provideZonelessChangeDetection } from '@angular/core';
import { ChatPanel } from './chat-panel';

// Test component for content projection
@Component({
  template: `
    <nexus-chat-panel [title]="panelTitle()">
      <div class="test-content">Projected Content</div>
    </nexus-chat-panel>
  `,
  standalone: true,
  imports: [ChatPanel]
})
class TestHostComponent {
  panelTitle = input<string>('Test Title');
}

describe('ChatPanel', () => {
  let component: ChatPanel;
  let fixture: ComponentFixture<ChatPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatPanel],
      providers: [provideZonelessChangeDetection()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatPanel);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Test Title');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title correctly', () => {
    const titleElement = fixture.debugElement.query(By.css('h2'));
    expect(titleElement).toBeTruthy();
    expect(titleElement.nativeElement.textContent.trim()).toBe('Test Title');
  });

  it('should have the expected structure with header and content area', () => {
    // Check for header
    const header = fixture.debugElement.query(By.css('div.h-14'));
    expect(header).toBeTruthy();

    // Check for content area
    const contentArea = fixture.debugElement.query(By.css('div.flex-1.overflow-hidden'));
    expect(contentArea).toBeTruthy();
  });
});

describe('ChatPanel with content projection', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideZonelessChangeDetection()],
    })
    .compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();
  });

  it('should project content correctly', () => {
    const projectedContent = hostFixture.debugElement.query(By.css('.test-content'));
    expect(projectedContent).toBeTruthy();
    expect(projectedContent.nativeElement.textContent).toBe('Projected Content');
  });

  it('should update title when input changes', () => {
    // Get the initial title element
    const titleElement = hostFixture.debugElement.query(By.css('h2'));
    expect(titleElement.nativeElement.textContent.trim()).toBe('Test Title');

    // Change the title
    hostFixture.componentRef.setInput('panelTitle', 'Updated Title');

    // Trigger change detection
    hostFixture.detectChanges();

    // Check if the title is updated
    expect(titleElement.nativeElement.textContent.trim()).toBe('Updated Title');
  });
});
