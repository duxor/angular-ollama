import { Component, input, output } from '@angular/core';
import { Session } from '../../../models/session';

@Component({
  selector: 'nexus-conversation-card',
  imports: [],
  templateUrl: './conversation-card.html',
  styleUrl: './conversation-card.css',
  standalone: true
})
export class ConversationCard {
  session = input.required<Session>();
  activeSessionId = input<string | null>(null);

  setActiveSession = output<string>();
  deleteSession = output<string>();
}
