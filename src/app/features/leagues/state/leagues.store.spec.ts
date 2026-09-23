import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { League } from '../../../core/models/league.model';
import { SportsApiService } from '../../../core/services/sports-api.service';
import { LeaguesStore } from './leagues.store';

const LEAGUES: League[] = [
  { idLeague: '1', strLeague: 'German Bundesliga', strSport: 'Soccer' },
  {
    idLeague: '2',
    strLeague: 'NBA',
    strSport: 'Basketball',
    strLeagueAlternate: 'National Basketball Association',
  },
  { idLeague: '4328', strLeague: 'English Premier League', strSport: 'Soccer' },
  { idLeague: '3', strLeague: 'Formula 1', strSport: 'Motorsport' },
];

describe('LeaguesStore', () => {
  let store: LeaguesStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LeaguesStore,
        { provide: SportsApiService, useValue: { getAllLeagues: () => of(LEAGUES) } },
      ],
    });
    store = TestBed.inject(LeaguesStore);
    store.load();
  });

  it('loads leagues and derives the sorted sport list', () => {
    expect(store.status()).toBe('success');
    expect(store.sports()).toEqual(['Basketball', 'Motorsport', 'Soccer']);
  });

  it('puts the featured league first', () => {
    expect(store.filteredLeagues()[0].idLeague).toBe('4328');
  });

  it('filters by name (case-insensitive) and by alternate name', () => {
    store.setSearchTerm('BUNDES');
    expect(store.filteredLeagues().map((l) => l.idLeague)).toEqual(['1']);

    store.setSearchTerm('national basketball');
    expect(store.filteredLeagues().map((l) => l.idLeague)).toEqual(['2']);
  });

  it('combines sport and search filters, and clears them', () => {
    store.setSelectedSport('Soccer');
    expect(store.filteredLeagues()).toHaveLength(2);

    store.setSearchTerm('premier');
    expect(store.filteredLeagues().map((l) => l.idLeague)).toEqual(['4328']);

    store.clearFilters();
    expect(store.filteredLeagues()).toHaveLength(4);
    expect(store.hasActiveFilters()).toBe(false);
  });

  it('keeps a single card expanded at a time', () => {
    store.toggleExpanded('1');
    store.toggleExpanded('2');
    expect(store.expandedLeagueId()).toBe('2');

    store.toggleExpanded('2');
    expect(store.expandedLeagueId()).toBeNull();
  });
});
