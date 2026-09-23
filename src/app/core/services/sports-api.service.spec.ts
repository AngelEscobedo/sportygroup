import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { SportsApiService } from './sports-api.service';

describe('SportsApiService', () => {
  let api: SportsApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(SportsApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('caches the leagues response', async () => {
    const first = firstValueFrom(api.getAllLeagues());
    http
      .expectOne((req) => req.url.endsWith('/all_leagues.php'))
      .flush({ leagues: [{ idLeague: '1', strLeague: 'A', strSport: 'Soccer' }] });

    expect(await first).toHaveLength(1);
    expect(await firstValueFrom(api.getAllLeagues())).toHaveLength(1);
    http.expectNone((req) => req.url.endsWith('/all_leagues.php'));
  });

  it('returns the first season that has a badge', async () => {
    const result = firstValueFrom(api.getSeasonBadge('4328'));
    http
      .expectOne((req) => req.params.get('id') === '4328')
      .flush({
        seasons: [
          { strSeason: '2000', strBadge: null },
          { strSeason: '2001', strBadge: 'https://img/2001.png' },
        ],
      });

    expect(await result).toEqual({ strSeason: '2001', strBadge: 'https://img/2001.png' });
  });

  it('treats a non-array seasons payload as "no badge"', async () => {
    const result = firstValueFrom(api.getSeasonBadge('bad'));
    http.expectOne(() => true).flush({ seasons: 'Invalid League ID passed' });

    expect(await result).toBeNull();
  });
});
