import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { CartService } from './cart.service';

@Component({
  selector: 'page-cart',
  templateUrl: './cart.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, RouterLink],
})
export class Cart {
  protected readonly cartService = inject(CartService);

  protected readonly items     = this.cartService.items;
  protected readonly subtotal  = this.cartService.subtotal;
  protected readonly shipping  = this.cartService.shipping;
  protected readonly total     = this.cartService.total;
  protected readonly threshold = this.cartService.threshold;

  protected increment(id: string): void { this.cartService.increment(id); }
  protected decrement(id: string): void { this.cartService.decrement(id); }
  protected remove(id: string):    void { this.cartService.remove(id); }
}
