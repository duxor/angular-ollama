import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { OllamaApi } from './ollama-api';
import { provideZonelessChangeDetection } from '@angular/core';

describe('OllamaApi', () => {
  let service: OllamaApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideZonelessChangeDetection(),
        OllamaApi,
      ]
    });
    service = TestBed.inject(OllamaApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch available models', () => {
    const mockModels = {
      models: [
        { name: 'llama3.1' },
        { name: 'gemma3' },
        { name: 'mistral' }
      ]
    };

    service.getAvailableModels().subscribe(models => {
      expect(models).toEqual(['llama3.1', 'gemma3', 'mistral']);
    });

    const req = httpMock.expectOne('http://localhost:11434/api/tags');
    expect(req.request.method).toBe('GET');
    req.flush(mockModels);
  });

  it('should generate text with the specified model', () => {
    const mockResponse = '{"response":"Hello"}';
    const prompt = 'Say hello';
    const model = 'llama3.1';

    service.generate(prompt, model).subscribe(response => {
      expect(response).toBe('Hello');
    });

    const req = httpMock.expectOne('http://localhost:11434/api/generate');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      model: 'llama3.1',
      prompt: 'Please format your response using markdown syntax for better readability. Say hello',
      options: {
        temperature: 0.7,
        num_predict: 1024
      }
    });
    req.flush(mockResponse);
  });
});
