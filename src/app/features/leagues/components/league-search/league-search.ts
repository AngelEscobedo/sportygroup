import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Subject, debounceTime, merge } from 'rxjs';

@Component({
  selector: 'app-league-search',
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule],
  templateUrl: './league-search.html',
  styleUrl: './league-search.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeagueSearch {
  readonly value = input('');

  private readonly typed$ = new Subject<string>();
  private readonly cleared$ = new Subject<string>();

  /** Debounced while typing; clearing is emitted immediately. */
  readonly searchChange = outputFromObservable(
    merge(this.typed$.pipe(debounceTime(250)), this.cleared$),
  );

  onInput(event: Event): void {
    this.typed$.next((event.target as HTMLInputElement).value);
  }

  clear(input: HTMLInputElement): void {
    input.value = '';
    this.cleared$.next('');
    input.focus();
  }
}
