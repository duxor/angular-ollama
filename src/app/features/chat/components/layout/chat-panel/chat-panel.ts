import { Component, input } from '@angular/core';

@Component({
  selector: 'nexus-chat-panel',
  standalone: true,
  templateUrl: './chat-panel.html',
  styleUrl: './chat-panel.css'
})
export class ChatPanel {
  title = input.required<string>();
}
