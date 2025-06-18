import { Component, ElementRef, input, OnChanges, output, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AITypingIndicator } from '../ai-typing-indicator/ai-typing-indicator';
import { Message } from '../../../models/message';
import { MessageCard } from '../message-card/message-card';
import { WelcomeSection } from '../../welcome-section/welcome-section';

@Component({
  selector: 'nexus-message-feed',
  standalone: true,
  imports: [CommonModule, AITypingIndicator, MessageCard, WelcomeSection],
  templateUrl: './message-feed.html',
  styleUrl: './message-feed.css'
})
export class MessageFeed implements OnChanges {
  messages = input.required<Message[]>();
  isLoading = input.required<boolean>();

  sendMessage = output<string>();

  private readonly messagesContainer = viewChild<ElementRef>('feedContainer');

  onSuggestionClick(suggestion: string): void {
    this.sendMessage.emit(suggestion);
  }

  ngOnChanges(): void {
    requestAnimationFrame(() => {
      this.scrollToBottom()
    });
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
