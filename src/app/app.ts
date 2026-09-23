import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { LeaguesPage } from './features/leagues/pages/leagues-page/leagues-page';

@Component({
  selector: 'app-root',
  imports: [MatToolbarModule, MatIconModule, LeaguesPage],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
