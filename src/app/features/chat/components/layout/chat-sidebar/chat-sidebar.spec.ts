import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { ChatSidebar } from './chat-sidebar';
import { provideZonelessChangeDetection } from '@angular/core';

// Test host component for content projection
@Component({
  template: `
    <nexus-chat-sidebar>
      <div sidebar-body class="test-body">Sidebar Body Content</div>
      <div sidebar-footer class="test-footer">Sidebar Footer Content</div>
    </nexus-chat-sidebar>
  `,
  standalone: true,
  imports: [ChatSidebar]
})
class TestHostComponent {}

describe('ChatSidebar', () => {
  let component: ChatSidebar;
  let fixture: ComponentFixture<ChatSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatSidebar],
      providers: [provideZonelessChangeDetection()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the app name and tagline', () => {
    const appName = fixture.debugElement.query(By.css('h1'));
    const tagline = fixture.debugElement.query(By.css('p'));

    expect(appName).toBeTruthy();
    expect(appName.nativeElement.textContent).toBe('NexusChat');
    expect(tagline).toBeTruthy();
    expect(tagline.nativeElement.textContent).toBe('Unleashing AI\'s Potential Together');
  });

  it('should have the expected structure with header, body, and footer', () => {
    const header = fixture.debugElement.query(By.css('div.p-4'));
    const body = fixture.debugElement.query(By.css('div.flex-1'));
    const footer = fixture.debugElement.query(By.css('div.p-3'));

    expect(header).toBeTruthy();
    expect(body).toBeTruthy();
    expect(footer).toBeTruthy();
  });
});

describe('ChatSidebar with content projection', () => {
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideZonelessChangeDetection()]
    })
    .compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
  });

  it('should project content into sidebar-body', () => {
    const bodyContent = hostFixture.debugElement.query(By.css('.test-body'));
    expect(bodyContent).toBeTruthy();
    expect(bodyContent.nativeElement.textContent).toBe('Sidebar Body Content');
  });

  it('should project content into sidebar-footer', () => {
    const footerContent = hostFixture.debugElement.query(By.css('.test-footer'));
    expect(footerContent).toBeTruthy();
    expect(footerContent.nativeElement.textContent).toBe('Sidebar Footer Content');
  });
});
