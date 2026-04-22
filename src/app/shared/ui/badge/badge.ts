import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

type BadgeVariant = 'accent' | 'primary' | 'success' | 'muted';

@Component({
  selector: 'ui-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span [class]="classes()"><ng-content /></span>`,
})
export class Badge {
  readonly variant = input<BadgeVariant>('accent');

  protected readonly classes = computed(() => {
    const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold';
    const variants: Record<BadgeVariant, string> = {
      accent:  'bg-accent text-primary',
      primary: 'bg-primary text-white',
      success: 'bg-green-100 text-green-700',
      muted:   'bg-gray-100 text-gray-600',
    };
    return `${base} ${variants[this.variant()]}`;
  });
}
