import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { League } from '../../../../core/models/league.model';
import { LeagueCard } from '../league-card/league-card';

@Component({
  selector: 'app-league-list',
  imports: [LeagueCard],
  templateUrl: './league-list.html',
  styleUrl: './league-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeagueList {
  readonly leagues = input.required<League[]>();
  readonly expandedLeagueId = input<string | null>(null);
  readonly featuredLeagueId = input<string | null>(null);

  readonly toggle = output<string>();
}
