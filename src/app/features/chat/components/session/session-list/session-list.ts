import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatSession } from '../../../models/chat-session';

@Component({
  selector: 'nexus-session-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './session-list.html',
  styleUrl: './session-list.css'
})
export class SessionList {
  sessions = input<ChatSession[]>([]);
  activeSessionId = input<string | null>(null);
  setActiveSession = output<string>();
  deleteSession = output<string>();
  createNewSession = output<void>();
}
