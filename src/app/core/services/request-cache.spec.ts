import { TestBed } from '@angular/core/testing';
import { Observable, firstValueFrom, of, throwError } from 'rxjs';

import { RequestCache } from './request-cache';

describe('RequestCache', () => {
  let cache: RequestCache;

  beforeEach(() => {
    cache = TestBed.inject(RequestCache);
  });

  it('calls the fetcher only once for the same key', async () => {
    let calls = 0;
    const fetch = () => {
      calls++;
      return of('value');
    };

    expect(await firstValueFrom(cache.getOrFetch('key', fetch))).toBe('value');
    expect(await firstValueFrom(cache.getOrFetch('key', fetch))).toBe('value');
    expect(calls).toBe(1);
  });

  it('evicts failed requests so they can be retried', async () => {
    let calls = 0;
    const fetch = (): Observable<string> => {
      calls++;
      return calls === 1 ? throwError(() => new Error('boom')) : of('ok');
    };

    await expect(firstValueFrom(cache.getOrFetch('key', fetch))).rejects.toThrow('boom');
    expect(await firstValueFrom(cache.getOrFetch('key', fetch))).toBe('ok');
    expect(calls).toBe(2);
  });
});
