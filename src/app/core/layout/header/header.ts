import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { CartService } from '@features/cart/cart.service';
import { CustomerAuthService } from '@shared/services/customer-auth.service';
import { SearchService } from '@shared/services/search.service';

const NAV_LINKS = [
  { label: 'Accueil',             path: '/',                  exact: true  },
  { label: 'Catalogue',           path: '/catalogue',         exact: false },
  { label: 'Suivi de commande',   path: '/suivi',             exact: false },
  { label: 'Comment ça marche',   path: '/comment-ca-marche', exact: false },
  { label: 'À propos',            path: '/a-propos',          exact: false },
] as const;

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
})
export class Header {
  protected readonly navLinks    = NAV_LINKS;
  private  readonly cartService  = inject(CartService);
  private  readonly authService  = inject(CustomerAuthService);
  private  readonly router       = inject(Router);
  private  readonly searchService  = inject(SearchService);
  protected readonly cartCount      = this.cartService.totalCount;
  protected readonly isMenuOpen     = signal(false);
  protected readonly currentUser    = this.authService.currentUser;
  protected readonly searchQuery = this.searchService.query;

  protected toggleMenu(): void {
    this.isMenuOpen.update(open => !open);
  }

  protected onQueryInput(value: string): void {
    this.searchService.query.set(value);
    if (!this.router.url.startsWith('/catalogue')) {
      this.router.navigate(['/catalogue']);
    }
  }

  protected search(): void {
    if (!this.router.url.startsWith('/catalogue')) {
      this.router.navigate(['/catalogue']);
    }
    this.isMenuOpen.set(false);
  }

  protected onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.search();
  }

  protected async logout(): Promise<void> {
    await this.authService.logout();
    this.router.navigate(['/']);
  }
}
