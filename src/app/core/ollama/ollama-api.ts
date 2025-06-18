import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OllamaApi {
  private readonly ollamaBaseUrl = 'http://localhost:11434/api';
  private readonly ollamaChatUrl = `${this.ollamaBaseUrl}/chat`;
  private readonly ollamaTagsUrl = `${this.ollamaBaseUrl}/tags`;
  private readonly httpClient = inject(HttpClient);

  getAvailableModels(): Observable<string[]> {
    return this.httpClient.get<{ models: { name: string }[] }>(this.ollamaTagsUrl)
      .pipe(
        map(response => response.models.map(model => model.name))
      );
  }

  chat(messages: { role: string; content: string }[], model: string): Observable<string> {
    return this.httpClient.post<string>(this.ollamaChatUrl, {
      model: model,
      messages: messages,
      options: {
        temperature: 0.7
      }
    }, {
      responseType: 'text' as unknown as 'json',
    }).pipe(map(response => {
      // Split the response by new lines and filter out empty lines
      const ndjsonLines = response.split('\n').filter((line: string) => line.trim() !== '');

      // Parse each line as JSON
      const jsonObjects = ndjsonLines.map((line: string) => JSON.parse(line));

      // Extract the content from the message field in each JSON object and join them
      const mappedResponse = jsonObjects
        .filter(item => item.message && item.message.content)
        .map(item => item.message.content)
        .join('');

      // Remove <think> tags and trim the final response
      return mappedResponse.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    }));
  }
}
