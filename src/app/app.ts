import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { Header } from '@core/layout/header/header';
import { Footer } from '@core/layout/footer/footer';
import { Toast }  from '@shared/ui/toast/toast';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, Header, Footer, Toast],
})
export class App {
  private readonly router = inject(Router);
  private readonly url    = toSignal(this.router.events, { initialValue: null });

  protected readonly isAdmin = computed(() => {
    void this.url();
    return this.router.url.startsWith('/admin');
  });
}
