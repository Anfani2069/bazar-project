import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { Header } from '@core/layout/header/header';
import { Footer } from '@core/layout/footer/footer';
import { Toast }  from '@shared/ui/toast/toast';
import { CartService } from '@features/cart/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, Header, Footer, Toast],
})
export class App {
  private readonly router      = inject(Router);
  private readonly cartService = inject(CartService);
  private readonly url         = toSignal(this.router.events, { initialValue: null });

  protected readonly isAdmin = computed(() => {
    void this.url();
    return this.router.url.startsWith('/admin');
  });

  protected readonly showCartFab = computed(() => {
    void this.url();
    const url = this.router.url;
    return !url.startsWith('/admin')
        && !url.startsWith('/panier')
        && !url.startsWith('/commande');
  });

  protected readonly cartCount = this.cartService.totalCount;
}
