import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { League } from '../../../../core/models/league.model';
import { SportsApiService } from '../../../../core/services/sports-api.service';

/**
 * Expanded content of a league card. Rendered only when the card is open, so
 * both requests are lazy; the service caches them per league id.
 */
@Component({
  selector: 'app-league-details',
  imports: [MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './league-details.html',
  styleUrl: './league-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeagueDetails {
  private readonly api = inject(SportsApiService);

  readonly league = input.required<League>();

  protected readonly badge = rxResource({
    params: () => this.league().idLeague,
    stream: ({ params: id }) => this.api.getSeasonBadge(id),
  });

  protected readonly details = rxResource({
    params: () => this.league().idLeague,
    stream: ({ params: id }) => this.api.getLeagueDetails(id),
  });

  /** `value()` throws while in error state, so read it through `hasValue()`. */
  protected readonly season = computed(() => (this.badge.hasValue() ? this.badge.value() : null));

  protected readonly imageFailed = signal(false);

  /** Alternate names from the list payload, falling back to the lookup endpoint. */
  protected readonly alternateNames = computed(() => {
    const raw =
      this.league().strLeagueAlternate ||
      (this.details.hasValue() ? this.details.value()?.strLeagueAlternate : null);
    return raw
      ? raw
          .split(',')
          .map((name) => name.trim())
          .filter(Boolean)
      : [];
  });

  protected retryBadge(): void {
    this.imageFailed.set(false);
    this.badge.reload();
  }
}
