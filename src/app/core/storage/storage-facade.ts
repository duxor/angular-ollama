import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageFacade {
  setItem<T>(key: string, data: T): void {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
    } catch (error) {
      console.error('Error storing data in localStorage', error);
    }
  }

  getItem<T>(key: string, defaultValue: T): T {
    try {
      const serializedData = localStorage.getItem(key);
      if (!serializedData) return defaultValue;

      try {
        // Try to parse as JSON
        return JSON.parse(serializedData) as T;
      } catch (parseError) {
        // If parsing fails, return the raw value if it's a string and T is a string type
        if (typeof defaultValue === 'string') {
          return serializedData as unknown as T;
        }
        // Otherwise, rethrow the error to be caught by the outer try-catch
        throw parseError;
      }
    } catch (error) {
      console.error('Error retrieving data from localStorage', error);
      return defaultValue;
    }
  }
}
