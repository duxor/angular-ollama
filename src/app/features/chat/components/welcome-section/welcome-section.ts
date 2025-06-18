import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nexus-welcome-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome-section.html',
  styleUrl: './welcome-section.css'
})
export class WelcomeSection {
  sendMessage = output<string>();

  onSuggestionClick(suggestion: string): void {
    this.sendMessage.emit(suggestion);
  }
}
