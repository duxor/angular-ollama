import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nexus-ai-typing-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-typing-indicator.html',
  styleUrl: './ai-typing-indicator.css'
})
export class AITypingIndicator implements OnInit {
  protected currentTime = '';

  ngOnInit() {
    this.updateCurrentTime();
  }

  private updateCurrentTime(): void {
    this.currentTime = new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
}
