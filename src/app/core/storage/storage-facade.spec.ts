import { TestBed } from '@angular/core/testing';
import { StorageFacade } from './storage-facade';
import { provideZonelessChangeDetection } from '@angular/core';

describe('StorageFacade', () => {
  let service: StorageFacade;
  let localStorageSpy: jasmine.SpyObj<Storage>;

  beforeEach(() => {
    // Create a spy for localStorage
    localStorageSpy = jasmine.createSpyObj('localStorage', ['getItem', 'setItem']);

    // Mock localStorage methods
    Object.defineProperty(window, 'localStorage', {
      value: localStorageSpy
    });

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        StorageFacade,
      ]
    });

    service = TestBed.inject(StorageFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setItem', () => {
    it('should store string data in localStorage', () => {
      const key = 'testKey';
      const value = 'testValue';

      service.setItem(key, value);

      expect(localStorageSpy.setItem).toHaveBeenCalledWith(key, JSON.stringify(value));
    });

    it('should store object data in localStorage', () => {
      const key = 'testKey';
      const value = { name: 'Test', value: 123 };

      service.setItem(key, value);

      expect(localStorageSpy.setItem).toHaveBeenCalledWith(key, JSON.stringify(value));
    });

    it('should store array data in localStorage', () => {
      const key = 'testKey';
      const value = [1, 2, 3];

      service.setItem(key, value);

      expect(localStorageSpy.setItem).toHaveBeenCalledWith(key, JSON.stringify(value));
    });

    it('should handle errors when storing data', () => {
      const key = 'testKey';
      // Use any type to avoid TypeScript errors with circular references
      const value: any = { circular: null };
      value.circular = value; // Create circular reference that can't be stringified

      // Mock console.error to prevent actual logging during test
      spyOn(console, 'error');

      // Mock JSON.stringify to throw an error
      spyOn(JSON, 'stringify').and.throwError('Circular reference');

      // This should not throw an error
      expect(() => service.setItem(key, value)).not.toThrow();

      // Verify error was logged
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('getItem', () => {
    it('should retrieve and parse JSON data from localStorage', () => {
      const key = 'testKey';
      const value = { name: 'Test', value: 123 };
      const serializedValue = JSON.stringify(value);

      localStorageSpy.getItem.and.returnValue(serializedValue);

      const result = service.getItem<typeof value>(key, null as any);

      expect(result).toEqual(value);
      expect(localStorageSpy.getItem).toHaveBeenCalledWith(key);
    });

    it('should return default value if key does not exist', () => {
      const key = 'nonExistentKey';
      const defaultValue = { default: true };

      localStorageSpy.getItem.and.returnValue(null);

      const result = service.getItem(key, defaultValue);

      expect(result).toBe(defaultValue);
      expect(localStorageSpy.getItem).toHaveBeenCalledWith(key);
    });

    it('should return raw value if parsing fails and default is string', () => {
      const key = 'testKey';
      const rawValue = 'unparseable{json';
      const defaultValue = '';

      localStorageSpy.getItem.and.returnValue(rawValue);

      const result = service.getItem<string>(key, defaultValue);

      expect(result).toBe(rawValue);
      expect(localStorageSpy.getItem).toHaveBeenCalledWith(key);
    });

    it('should return default value if parsing fails and default is not string', () => {
      const key = 'testKey';
      const rawValue = 'unparseable{json';
      const defaultValue = { default: true };

      localStorageSpy.getItem.and.returnValue(rawValue);

      // Mock console.error to prevent actual logging during test
      spyOn(console, 'error');

      const result = service.getItem(key, defaultValue);

      expect(result).toBe(defaultValue);
      expect(localStorageSpy.getItem).toHaveBeenCalledWith(key);
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle errors when retrieving data', () => {
      const key = 'testKey';
      const defaultValue = { default: true };

      // Force getItem to throw an error
      localStorageSpy.getItem.and.throwError('Storage error');

      // Mock console.error to prevent actual logging during test
      spyOn(console, 'error');

      const result = service.getItem(key, defaultValue);

      expect(result).toBe(defaultValue);
      expect(console.error).toHaveBeenCalled();
    });
  });
});
