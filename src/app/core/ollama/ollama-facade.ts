import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { OllamaApi } from './ollama-api';
import { OllamaStore } from './ollama-store';
import { Message } from '../../features/chat/models/message';

@Injectable({
  providedIn: 'root'
})
export class OllamaFacade {
  private readonly ollamaApi = inject(OllamaApi);
  private readonly ollamaStore = inject(OllamaStore);

  readonly $availableModels = signal<string[]>([]);
  readonly $selectedModel = signal<string>('');

  currentModel(): string {
    return this.ollamaStore.currentModel();
  }

  saveModel(model: string): void {
    this.ollamaStore.saveModel(model);
    this.$selectedModel.set(model);
  }

  loadAvailableModels(): Observable<string[]> {
    return this.ollamaApi.getAvailableModels().pipe(tap((models: string[]) => {
      this.$availableModels.set(models);
      this.initializeSelectedModel(models);
    }));
  }

  initializeSelectedModel(models: string[]): void {
    if (!models.length) {
      this.$selectedModel.set('');
      return;
    }

    const savedModel = this.currentModel();
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

  chat(messages: Pick<Message, 'role'|'content'>[], model?: string): Observable<string> {
    const modelToUse = model || this.currentModel();
    return this.ollamaApi.chat(messages, modelToUse);
  }
}
