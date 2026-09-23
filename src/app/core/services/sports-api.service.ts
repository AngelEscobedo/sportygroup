import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { League, LeaguesResponse, Season, SeasonsResponse } from '../models/league.model';
import { RequestCache } from './request-cache';

@Injectable({ providedIn: 'root' })
export class SportsApiService {
  private readonly http = inject(HttpClient);
  private readonly cache = inject(RequestCache);
  private readonly baseUrl = environment.sportsDbApiUrl;

  getAllLeagues(): Observable<League[]> {
    return this.cache.getOrFetch('all-leagues', () =>
      this.http
        .get<LeaguesResponse>(`${this.baseUrl}/all_leagues.php`)
        .pipe(map((response) => response.leagues ?? [])),
    );
  }

  /** First season that actually has a badge image, or `null` if none. */
  getSeasonBadge(leagueId: string): Observable<Season | null> {
    const params = new HttpParams().set('badge', 1).set('id', leagueId);

    return this.cache.getOrFetch(`season-badge:${leagueId}`, () =>
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

    return this.cache.getOrFetch(`league-details:${leagueId}`, () =>
      this.http
        .get<LeaguesResponse>(`${this.baseUrl}/lookupleague.php`, { params })
        .pipe(map((response) => response.leagues?.[0] ?? null)),
    );
  }
}
