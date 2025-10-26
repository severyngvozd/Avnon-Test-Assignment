import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconName = 'plus' | 'more-vertical' | 'check';

@Component({
  selector: 'app-icon',
  imports: [],
  templateUrl: './icon.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  public readonly name = input.required<IconName>();
  public readonly size = input<number>(24);
}
