import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Session } from '../../../models/session';
import { ConversationCard } from '../conversation-card/conversation-card';

@Component({
  selector: 'nexus-conversation-list',
  standalone: true,
  imports: [CommonModule, ConversationCard],
  templateUrl: './conversation-list.html',
  styleUrl: './conversation-list.css'
})
export class ConversationList {
  conversations = input.required<Session[]>();
  activeSessionId = input<string | null>(null);

  setActiveSession = output<string>();
  deleteSession = output<string>();
  createNewSession = output<void>();
}
