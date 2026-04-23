import { ChangeDetectionStrategy, Component, inject, signal, effect } from '@angular/core';

import { CartService } from '@features/cart/cart.service';

@Component({
  selector: 'ui-toast',
  templateUrl: './toast.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toast {
  private  readonly cartService = inject(CartService);
  protected readonly visible    = signal(false);
  protected readonly label      = signal('');

  constructor() {
    effect(() => {
      const product = this.cartService.lastAdded();
      if (product) {
        this.label.set(`${product.emoji ?? '🛒'} ${product.name} ajouté au panier`);
        this.visible.set(true);
      } else {
        this.visible.set(false);
      }
    });
  }
}
