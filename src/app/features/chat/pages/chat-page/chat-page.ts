import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SessionForm } from '../../components/session/session-form/session-form';
import { SessionList } from '../../components/session/session-list/session-list';
import { MessageList } from '../../components/message/message-list/message-list';
import { ChatStore } from '../../services/chat-store';
import { OllamaApi } from '../../../../core/ollama/ollama-api';
import { OllamaStore } from '../../../../core/ollama/ollama-store';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'nexus-chat-page',
  standalone: true,
  imports: [CommonModule, FormsModule, SessionForm, SessionList, MessageList],
  templateUrl: './chat-page.html',
  styleUrl: './chat-page.css'
})
export class ChatPage implements OnInit {
  protected readonly chatService = inject(ChatStore);
  protected readonly ollamaApi = inject(OllamaApi);
  protected readonly ollamaStore = inject(OllamaStore);

  protected readonly $availableModels = signal<string[]>([]);
  protected readonly $selectedModel = signal<string>('');

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
    this.loadAvailableModels().subscribe(models => {
      this.initializeSelectedModel(models);
    });
  }

  private initializeSelectedModel(models: string[]): void {
    if (!models.length) {
      this.$selectedModel.set('');
      return;
    }

    const savedModel = this.ollamaStore.currentModel();
    if (!savedModel) {
      this.$selectedModel.set(models[0]);
      return;
    }

    if (models.includes(savedModel)) {
      this.$selectedModel.set(savedModel);
      return;
    }

    const similarModel = models.find(model => model.startsWith(savedModel));
    this.$selectedModel.set(similarModel ?? models[0]);
  }

  loadAvailableModels(): Observable<string[]> {
    return this.ollamaApi.getAvailableModels().pipe(tap(models => {
      this.$availableModels.set(models);
    }));
  }

  onModelChange(model: string): void {
    this.$selectedModel.set(model);
    this.ollamaStore.saveModel(model);
  }

  sendMessage(content: string): void {
    this.chatService.sendMessage(content).subscribe();
  }
}
