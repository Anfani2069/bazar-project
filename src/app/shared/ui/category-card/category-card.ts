import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { Category } from '../../models';

@Component({
  selector: 'ui-category-card',
  templateUrl: './category-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryCard {
  readonly category = input.required<Category>();
  readonly selected = input(false);
  readonly select   = output<Category>();

  protected readonly buttonClasses = computed(() => {
    const base = [
      'group flex flex-col items-center gap-2 p-3 rounded-xl border w-full transition-all',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
    ].join(' ');

    return this.selected()
      ? `${base} border-primary bg-primary-muted`
      : `${base} border-border bg-surface hover:border-primary hover:shadow-sm`;
  });

  protected readonly labelClasses = computed(() =>
    this.selected()
      ? 'text-xs font-semibold text-center text-primary'
      : 'text-xs font-medium text-center text-foreground'
  );

  protected onSelect(): void {
    this.select.emit(this.category());
  }
}
