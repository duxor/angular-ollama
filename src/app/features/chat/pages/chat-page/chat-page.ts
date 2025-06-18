import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatSidebar } from '../../components/layout/chat-sidebar/chat-sidebar';
import { ChatStore } from '../../services/chat-store';
import { OllamaFacade } from '../../../../core/ollama/ollama-facade';
import { MessageFeed } from '../../components/message/message-feed/message-feed';
import { MessageForm } from '../../components/message/message-form/message-form';
import { ChatPanel } from '../../components/layout/chat-panel/chat-panel';
import { ConversationList } from '../../components/conversation/conversation-list/conversation-list';

@Component({
  selector: 'nexus-chat-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatSidebar, MessageFeed, MessageForm, ChatPanel, ConversationList],
  templateUrl: './chat-page.html',
  styleUrl: './chat-page.css'
})
export class ChatPage implements OnInit {
  protected readonly chatService = inject(ChatStore);
  protected readonly ollamaFacade = inject(OllamaFacade);

  protected readonly $availableModels = this.ollamaFacade.$availableModels;
  protected readonly $selectedModel = this.ollamaFacade.$selectedModel;

  createNewSession(): void {
    this.chatService.createNewSession();
  }

  setActiveSession(sessionId: string): void {
    this.chatService.setActiveSession(sessionId);
  }

  deleteSession(sessionId: string): void {
    this.chatService.deleteSession(sessionId);
  }

  ngOnInit(): void {
    this.ollamaFacade.loadAvailableModels().subscribe();
  }

  onModelChange(model: string): void {
    this.ollamaFacade.saveModel(model);
  }

  sendMessage(content: string): void {
    this.chatService.sendMessage(content).subscribe();
  }
}
