import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, shareReplay, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { League, LeaguesResponse, Season, SeasonsResponse } from '../models/league.model';

@Injectable({ providedIn: 'root' })
export class SportsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.sportsDbApiUrl;
  private readonly cache = new Map<string, Observable<unknown>>();

  getAllLeagues(): Observable<League[]> {
    return this.cached(
      'all-leagues',
      this.http
        .get<LeaguesResponse>(`${this.baseUrl}/all_leagues.php`)
        .pipe(map((response) => response.leagues ?? [])),
    );
  }

  /** First season that actually has a badge image, or `null` if none. */
  getSeasonBadge(leagueId: string): Observable<Season | null> {
    const params = new HttpParams().set('badge', 1).set('id', leagueId);

    return this.cached(
      `season-badge:${leagueId}`,
      this.http
        .get<SeasonsResponse>(`${this.baseUrl}/search_all_seasons.php`, { params })
        .pipe(
          map(({ seasons }) =>
            Array.isArray(seasons) ? (seasons.find((season) => !!season.strBadge) ?? null) : null,
          ),
        ),
    );
  }

  /** Full league record; used for fields `all_leagues.php` omits (e.g. `strLeagueAlternate`). */
  getLeagueDetails(leagueId: string): Observable<League | null> {
    const params = new HttpParams().set('id', leagueId);

    return this.cached(
      `league-details:${leagueId}`,
      this.http
        .get<LeaguesResponse>(`${this.baseUrl}/lookupleague.php`, { params })
        .pipe(map((response) => response.leagues?.[0] ?? null)),
    );
  }

  /**
   * Returns the cached request for `key`, or caches `request$` on first use.
   * `shareReplay` replays the response to later subscribers (no new HTTP call);
   * failed requests are removed so they can be retried.
   */
  private cached<T>(key: string, request$: Observable<T>): Observable<T> {
    if (!this.cache.has(key)) {
      this.cache.set(
        key,
        request$.pipe(
          catchError((error: unknown) => {
            this.cache.delete(key);
            return throwError(() => error);
          }),
          shareReplay(1),
        ),
      );
    }
    return this.cache.get(key) as Observable<T>;
  }
}
