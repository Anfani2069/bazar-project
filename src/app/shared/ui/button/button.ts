import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button [type]="type()" [disabled]="disabled()" [class]="classes()">
      <ng-content />
    </button>
  `,
})
export class Button {
  readonly variant  = input<ButtonVariant>('primary');
  readonly size     = input<ButtonSize>('md');
  readonly type     = input<'button' | 'submit' | 'reset'>('button');
  readonly disabled = input(false);
  readonly fullWidth = input(false);

  protected readonly classes = computed(() => {
    const base = [
      'inline-flex items-center justify-center gap-2 font-medium transition-colors',
      'rounded-xl cursor-pointer',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
      'disabled:opacity-50 disabled:pointer-events-none',
    ].join(' ');

    const variants: Record<ButtonVariant, string> = {
      primary:   'bg-primary text-white hover:bg-primary-hover',
      secondary: 'bg-accent text-primary font-semibold hover:bg-accent-hover',
      outline:   'border-2 border-primary text-primary hover:bg-primary-muted',
      ghost:     'text-primary hover:bg-primary-muted',
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-2.5 text-sm',
      lg: 'px-8 py-3.5 text-base',
    };

    return [base, variants[this.variant()], sizes[this.size()], this.fullWidth() ? 'w-full' : '']
      .filter(Boolean)
      .join(' ');
  });
}
