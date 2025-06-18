import { AfterViewInit, Component, ElementRef, output, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'nexus-message-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './message-form.html',
  styleUrl: './message-form.css'
})
export class MessageForm implements AfterViewInit {
  sendMessage = output<string>();

  readonly messageInput = viewChild<ElementRef<HTMLInputElement>>('messageInput');

  $message = signal('');
  $isSubmitting = signal(false);

  onMessageChange(value: string): void {
    this.$message.set(value);
  }

  ngAfterViewInit(): void {
    this.focusInput();
  }

  focusInput(): void {
    setTimeout(() => {
      const input = this.messageInput();
      if (input) {
        input.nativeElement.focus();
      }
    }, 0);
  }

  onSubmit(): void {
    if (!this.$message().trim() || this.$isSubmitting()) {
      return;
    }

    this.$isSubmitting.set(true);
    this.sendMessage.emit(this.$message());
    this.$message.set('');

    // Reset submitting state after a short delay to prevent rapid submissions
    setTimeout(() => {
      this.$isSubmitting.set(false);
      this.focusInput();
    }, 500);
  }
}
