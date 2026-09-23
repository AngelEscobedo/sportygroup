import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { League } from '../../../../core/models/league.model';
import { sportIcon } from '../../../../shared/utils/sport-icon';
import { LeagueDetails } from '../league-details/league-details';

@Component({
  selector: 'app-league-card',
  imports: [MatIconModule, LeagueDetails],
  templateUrl: './league-card.html',
  styleUrl: './league-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.expanded]': 'expanded()',
    '[class.featured]': 'featured()',
  },
})
export class LeagueCard {
  readonly league = input.required<League>();
  readonly expanded = input(false);
  readonly featured = input(false);

  readonly toggle = output<void>();

  protected readonly icon = computed(() => sportIcon(this.league().strSport));
  protected readonly detailsId = computed(() => `league-details-${this.league().idLeague}`);
}
