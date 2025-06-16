import { AfterViewChecked, Component, ElementRef, input, output, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageItem } from '../message-item/message-item';
import { AITypingIndicator } from '../ai-typing-indicator/ai-typing-indicator';
import { ChatMessage } from '../../../models/chat-message';

@Component({
  selector: 'nexus-message-list',
  standalone: true,
  imports: [CommonModule, MessageItem, AITypingIndicator],
  templateUrl: './message-list.html',
  styleUrl: './message-list.css'
})
export class MessageList implements AfterViewChecked {
  messages = input<ChatMessage[]>([]);
  isLoading = input<boolean>(false);
  sendMessage = output<string>();
  private readonly messagesContainer = viewChild<ElementRef>('messagesContainer');

  onSuggestionClick(suggestion: string): void {
    this.sendMessage.emit(suggestion);
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      const container = this.messagesContainer();
      if (container) {
        container.nativeElement.scrollTop = container.nativeElement.scrollHeight;
      }
    } catch {
      // ignore silently if the element is not available
    }
  }
}
