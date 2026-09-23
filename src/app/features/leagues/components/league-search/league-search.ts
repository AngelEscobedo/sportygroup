import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-league-search',
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule],
  templateUrl: './league-search.html',
  styleUrl: './league-search.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeagueSearch {
  readonly value = input('');

  /** Every keystroke goes in here; the parent only hears about it after a 250 ms pause. */
  protected readonly typed$ = new Subject<string>();
  readonly searchChange = outputFromObservable(this.typed$.pipe(debounceTime(250)));
}
