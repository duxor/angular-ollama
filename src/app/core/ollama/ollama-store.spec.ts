import { TestBed } from '@angular/core/testing';
import { OllamaStore } from './ollama-store';
import { StorageFacade } from '../storage/storage-facade';
import { provideZonelessChangeDetection } from '@angular/core';

describe('OllamaStore', () => {
  let service: OllamaStore;
  let storageFacadeMock: jasmine.SpyObj<StorageFacade>;

  beforeEach(() => {
    // Create a mock for StorageFacade
    storageFacadeMock = jasmine.createSpyObj('StorageFacade', ['getItem', 'setItem']);

    // Default behavior - return the default model
    storageFacadeMock.getItem.and.returnValue('llama3.1');

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        OllamaStore,
        { provide: StorageFacade, useValue: storageFacadeMock },
      ]
    });

    service = TestBed.inject(OllamaStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with the saved model from storage', () => {
    // Setup the mock to return a specific model
    storageFacadeMock.getItem.and.returnValue('gemma3');

    // Re-create the service to trigger initialization with a new instance
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        OllamaStore,
        { provide: StorageFacade, useValue: storageFacadeMock },
      ]
    });
    service = TestBed.inject(OllamaStore);

    // Verify the model was loaded from storage
    expect(service.currentModel()).toBe('gemma3');
    expect(storageFacadeMock.getItem).toHaveBeenCalledWith('ollamaModel', 'llama3.1');
  });

  it('should initialize with the default model if none in storage', () => {
    // Setup the mock to return undefined (no saved model)
    storageFacadeMock.getItem.and.returnValue(undefined);

    // Re-create the service to trigger initialization
    service = TestBed.inject(OllamaStore);

    // Verify the default model was used
    expect(service.currentModel()).toBe('llama3.1');
  });

  it('should save the model to storage and update the signal', () => {
    // Initial state
    storageFacadeMock.getItem.and.returnValue('llama3.1');
    service = TestBed.inject(OllamaStore);

    // Save a new model
    service.saveModel('gemma3');

    // Verify the model was saved to storage and the signal was updated
    expect(service.currentModel()).toBe('gemma3');
    expect(storageFacadeMock.setItem).toHaveBeenCalledWith('ollamaModel', 'gemma3');
  });
});
