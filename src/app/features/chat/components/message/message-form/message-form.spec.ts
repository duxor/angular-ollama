import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MessageForm } from './message-form';
import { provideZonelessChangeDetection, signal } from '@angular/core';

// Type for testing private methods
interface SessionFormTest extends MessageForm {
  focusInput(): void;
}

describe('MessageForm', () => {
  let component: MessageForm;
  let fixture: ComponentFixture<MessageForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageForm, FormsModule],
      providers: [
        provideZonelessChangeDetection(),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update message signal when input changes', () => {
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    const testMessage = 'Hello, world!';

    // Trigger input change
    inputElement.value = testMessage;
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.$message()).toBe(testMessage);
  });

  it('should emit sendMessage when form is submitted with valid message', () => {
    const testMessage = 'Test message';

    // Set message and spy on output
    component.$message = signal(testMessage);
    const sendMessageSpy = spyOn(component.sendMessage, 'emit');

    // Submit form
    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit', null);

    expect(sendMessageSpy).toHaveBeenCalledWith(testMessage);
    expect(component.$message()).toBe(''); // Message should be cleared
  });

  it('should not emit sendMessage when form is submitted with empty message', () => {
    // Set empty message and spy on output
    component.$message = signal('   '); // Just whitespace
    const sendMessageSpy = spyOn(component.sendMessage, 'emit');

    // Submit form
    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit', null);

    expect(sendMessageSpy).not.toHaveBeenCalled();
  });

  it('should not emit sendMessage when isSubmitting is true', () => {
    const testMessage = 'Test message';

    // Set message, set isSubmitting to true, and spy on output
    component.$message = signal(testMessage);
    component.$isSubmitting = signal(true);
    const sendMessageSpy = spyOn(component.sendMessage, 'emit');

    // Submit form
    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit', null);

    expect(sendMessageSpy).not.toHaveBeenCalled();
  });

  it('should focus input after initialization', (done) => {
    // @ts-expect-error: Accessing protected member in test
    const focusSpy = spyOn<SessionFormTest>(component, 'focusInput').and.callThrough();

    component.ngAfterViewInit();

    // Use setTimeout to wait for the next event loop cycle
    setTimeout(() => {
      expect(focusSpy).toHaveBeenCalled();
      done();
    }, 10);
  });

  it('should focus input after submission', (done) => {
    const testMessage = 'Test message';
    // @ts-expect-error: Accessing protected member in test
    const focusSpy = spyOn<SessionFormTest>(component, 'focusInput');

    // Set message
    component.$message = signal(testMessage);

    // Submit form
    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit', null);

    // Wait for the timeout in the submission handler (500ms)
    setTimeout(() => {
      expect(focusSpy).toHaveBeenCalled();
      expect(component.$isSubmitting()).toBe(false); // isSubmitting should be reset
      done();
    }, 510); // Slightly longer than the component's timeout
  });
});
