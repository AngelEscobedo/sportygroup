import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/** Reusable empty / error state with an optional action. */
@Component({
  selector: 'app-state-message',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './state-message.html',
  styleUrl: './state-message.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateMessage {
  readonly icon = input('info');
  readonly title = input.required<string>();
  readonly message = input<string>();
  readonly actionLabel = input<string>();
  readonly tone = input<'neutral' | 'error'>('neutral');

  readonly action = output<void>();
}
