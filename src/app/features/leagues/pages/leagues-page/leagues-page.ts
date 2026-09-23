import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { StateMessage } from '../../../../shared/components/state-message/state-message';
import { LeagueCard } from '../../components/league-card/league-card';
import { LeagueSearch } from '../../components/league-search/league-search';
import { SportFilter } from '../../components/sport-filter/sport-filter';
import { LeaguesStore } from '../../state/leagues.store';

/** Container component: wires the store to the presentational components. */
@Component({
  selector: 'app-leagues-page',
  imports: [LeagueSearch, SportFilter, LeagueCard, StateMessage, MatProgressBarModule],
  providers: [LeaguesStore],
  templateUrl: './leagues-page.html',
  styleUrl: './leagues-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaguesPage implements OnInit {
  protected readonly store = inject(LeaguesStore);

  ngOnInit(): void {
    this.store.load();
  }
}
