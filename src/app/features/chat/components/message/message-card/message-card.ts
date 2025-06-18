import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownComponent, provideMarkdown } from 'ngx-markdown';
import { Message } from '../../../models/message';

@Component({
  selector: 'nexus-message-card',
  standalone: true,
  imports: [CommonModule, MarkdownComponent],
  providers: [provideMarkdown()],
  templateUrl: './message-card.html',
  styleUrl: './message-card.css'
})
export class MessageCard {
  message = input.required<Message>();

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
