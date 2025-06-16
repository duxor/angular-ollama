import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownComponent, provideMarkdown } from 'ngx-markdown';
import { ChatMessage } from '../../../models/chat-message';

@Component({
  selector: 'nexus-message-item',
  standalone: true,
  imports: [CommonModule, MarkdownComponent],
  providers: [provideMarkdown()],
  templateUrl: './message-item.html',
  styleUrl: './message-item.css'
})
export class MessageItem {
  message = input.required<ChatMessage>();

  get isUser(): boolean {
    return this.message().role === 'user';
  }

  get formattedTime(): string {
    return new Date(this.message().timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
}
