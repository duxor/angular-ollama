import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { OllamaStore } from './ollama-store';

@Injectable({
  providedIn: 'root'
})
export class OllamaApi {
  private readonly ollamaBaseUrl = 'http://localhost:11434/api';
  private readonly ollamaGenerateUrl = `${this.ollamaBaseUrl}/generate`;
  private readonly ollamaTagsUrl = `${this.ollamaBaseUrl}/tags`;
  private readonly httpClient = inject(HttpClient);
  private readonly ollamaStore = inject(OllamaStore);

  getAvailableModels(): Observable<string[]> {
    return this.httpClient.get<{ models: { name: string }[] }>(this.ollamaTagsUrl)
      .pipe(
        map(response => response.models.map(model => model.name))
      );
  }

  generate(prompt: string, model?: string): Observable<string> {
    return this.httpClient.post<string>(this.ollamaGenerateUrl, {
      model: model || this.ollamaStore.currentModel(),
      prompt: `Please format your response using markdown syntax for better readability. ${prompt}`,
      options: {
        temperature: 0.7,
        num_predict: 1024
      }
    }, {
      responseType: 'text' as unknown as 'json',
    }).pipe(map(response => {
      // Split the response by new lines and filter out empty lines
      const ndjsonLines = response.split('\n').filter((line: string) => line.trim() !== '');

      // Parse each line as JSON and extract the 'response' field
      const jsonObjects = ndjsonLines.map((line: string) => JSON.parse(line));

      // Map the 'response' field from each JSON object and join them into a single string
      const mappedResponse = jsonObjects.map((item: { response: string[] }) => item.response).join('');

      // Remove <think> tags and trim the final response
      return mappedResponse.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    }));
  }
}
