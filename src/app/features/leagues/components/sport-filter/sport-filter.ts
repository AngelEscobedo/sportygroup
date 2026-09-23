import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { sportIcon } from '../../../../shared/utils/sport-icon';

@Component({
  selector: 'app-sport-filter',
  imports: [MatFormFieldModule, MatSelectModule, MatIconModule],
  templateUrl: './sport-filter.html',
  styleUrl: './sport-filter.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SportFilter {
  readonly sports = input.required<string[]>();
  readonly selected = input<string | null>(null);

  readonly selectedChange = output<string | null>();

  protected readonly sportIcon = sportIcon;
}
