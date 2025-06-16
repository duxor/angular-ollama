import { inject, Injectable, signal } from '@angular/core';
import { StorageFacade } from '../storage/storage-facade';

@Injectable({
  providedIn: 'root'
})
export class OllamaStore {
  private readonly storageFacade = inject(StorageFacade);
  private readonly localStorageKey = 'ollamaModel';
  private readonly defaultModel = 'llama3.1';

  private readonly $currentModel = signal<string>(this.loadSavedModel());

  currentModel() {
    return this.$currentModel();
  }

  private loadSavedModel(): string {
    return this.storageFacade.getItem<string>(this.localStorageKey, this.defaultModel);
  }

  saveModel(model: string): void {
    this.$currentModel.set(model);
    this.storageFacade.setItem(this.localStorageKey, model);
  }
}
