import { Injectable, computed, inject, signal } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { League } from '../../../core/models/league.model';
import { SportsApiService } from '../../../core/services/sports-api.service';

/** Case- and accent-insensitive form used for searching ("Ligué" → "ligue"). */
const normalize = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();

/**
 * State for the leagues feature. Writable signals are private and only changed
 * through the methods below; everything the UI needs to derive is `computed`.
 */
@Injectable()
export class LeaguesStore {
  private readonly api = inject(SportsApiService);

  readonly featuredLeagueId = environment.featuredLeagueId;

  private readonly _leagues = signal<League[]>([]);
  private readonly _status = signal<'loading' | 'success' | 'error'>('loading');
  private readonly _searchTerm = signal('');
  private readonly _selectedSport = signal<string | null>(null);
  private readonly _expandedLeagueId = signal<string | null>(null);

  readonly status = this._status.asReadonly();
  readonly searchTerm = this._searchTerm.asReadonly();
  readonly selectedSport = this._selectedSport.asReadonly();
  readonly expandedLeagueId = this._expandedLeagueId.asReadonly();

  readonly totalCount = computed(() => this._leagues().length);

  /** Unique sports present in the data, alphabetically. */
  readonly sports = computed(() => [...new Set(this._leagues().map((l) => l.strSport))].sort());

  /** Leagues matching the current filters, featured league first. */
  readonly filteredLeagues = computed(() => {
    const term = normalize(this._searchTerm());
    const sport = this._selectedSport();

    return this._leagues()
      .filter((league) => !sport || league.strSport === sport)
      .filter(
        (league) =>
          normalize(league.strLeague).includes(term) ||
          normalize(league.strLeagueAlternate ?? '').includes(term),
      )
      .sort(
        (a, b) =>
          Number(b.idLeague === this.featuredLeagueId) -
          Number(a.idLeague === this.featuredLeagueId),
      );
  });

  readonly hasActiveFilters = computed(
    () => !!this._searchTerm().trim() || !!this._selectedSport(),
  );

  load(): void {
    this._status.set('loading');
    this.api.getAllLeagues().subscribe({
      next: (leagues) => {
        this._leagues.set(leagues);
        this._status.set('success');
      },
      error: () => this._status.set('error'),
    });
  }

  setSearchTerm(term: string): void {
    this._searchTerm.set(term);
  }

  setSelectedSport(sport: string | null): void {
    this._selectedSport.set(sport);
  }

  clearFilters(): void {
    this._searchTerm.set('');
    this._selectedSport.set(null);
  }

  /** Only one card is expanded at a time; toggling the open card collapses it. */
  toggleExpanded(leagueId: string): void {
    this._expandedLeagueId.update((current) => (current === leagueId ? null : leagueId));
  }
}
