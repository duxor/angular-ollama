import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { OllamaFacade } from './ollama-facade';
import { OllamaApi } from './ollama-api';
import { OllamaStore } from './ollama-store';
import { provideZonelessChangeDetection } from '@angular/core';

describe('OllamaFacade', () => {
  let service: OllamaFacade;
  let ollamaApiMock: jasmine.SpyObj<OllamaApi>;
  let ollamaStoreMock: jasmine.SpyObj<OllamaStore>;

  beforeEach(() => {
    // Create mock services
    ollamaApiMock = jasmine.createSpyObj('OllamaApi', ['getAvailableModels', 'chat']);
    ollamaStoreMock = jasmine.createSpyObj('OllamaStore', ['currentModel', 'saveModel']);

    // Configure default mock behavior
    ollamaApiMock.getAvailableModels.and.returnValue(of(['llama3.1', 'gemma3', 'mistral']));
    ollamaApiMock.chat.and.returnValue(of('Mock response'));
    ollamaStoreMock.currentModel.and.returnValue('llama3.1');

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        OllamaFacade,
        { provide: OllamaApi, useValue: ollamaApiMock },
        { provide: OllamaStore, useValue: ollamaStoreMock }
      ]
    });

    service = TestBed.inject(OllamaFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get current model from OllamaStore', () => {
    expect(service.currentModel()).toBe('llama3.1');
    expect(ollamaStoreMock.currentModel).toHaveBeenCalled();
  });

  it('should save model to OllamaStore', () => {
    service.saveModel('gemma3');
    expect(ollamaStoreMock.saveModel).toHaveBeenCalledWith('gemma3');
  });

  it('should load available models from OllamaApi', () => {
    service.loadAvailableModels().subscribe(models => {
      expect(models).toEqual(['llama3.1', 'gemma3', 'mistral']);
    });
    expect(ollamaApiMock.getAvailableModels).toHaveBeenCalled();
  });

  it('should chat using OllamaApi with current model', () => {
    const messages = [{ role: 'user' as const, content: 'Hello' }];
    service.chat(messages).subscribe((response: string) => {
      expect(response).toBe('Mock response');
    });
    expect(ollamaApiMock.chat).toHaveBeenCalledWith(messages, 'llama3.1');
  });

  it('should chat using OllamaApi with specified model', () => {
    const messages = [{ role: 'user' as const, content: 'Hello' }];
    service.chat(messages, 'gemma3').subscribe((response: string) => {
      expect(response).toBe('Mock response');
    });
    expect(ollamaApiMock.chat).toHaveBeenCalledWith(messages, 'gemma3');
  });
});
