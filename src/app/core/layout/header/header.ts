import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

const NAV_LINKS = [
  { label: 'Accueil',            path: '/',                  exact: true  },
  { label: 'Catalogue',          path: '/catalogue',         exact: false },
  { label: 'Comment ça marche',  path: '/comment-ca-marche', exact: false },
  { label: 'À propos',           path: '/a-propos',          exact: false },
] as const;

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
})
export class Header {
  protected readonly navLinks = NAV_LINKS;
  protected readonly cartCount   = signal(0);
  protected readonly isMenuOpen  = signal(false);

  protected toggleMenu(): void {
    this.isMenuOpen.update(open => !open);
  }
}
