import { Injectable } from '@angular/core';
import { Observable, catchError, shareReplay, throwError } from 'rxjs';

/**
 * In-memory cache of observables keyed by request.
 * - Repeat calls replay the cached value (no new HTTP request).
 * - Concurrent calls share a single in-flight request.
 * - Failed requests are evicted so they can be retried.
 */
@Injectable({ providedIn: 'root' })
export class RequestCache {
  private readonly entries = new Map<string, Observable<unknown>>();

  getOrFetch<T>(key: string, fetch: () => Observable<T>): Observable<T> {
    const cached = this.entries.get(key) as Observable<T> | undefined;
    if (cached) {
      return cached;
    }

    const request$ = fetch().pipe(
      catchError((error: unknown) => {
        this.entries.delete(key);
        return throwError(() => error);
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    this.entries.set(key, request$);
    return request$;
  }

  clear(): void {
    this.entries.clear();
  }
}
