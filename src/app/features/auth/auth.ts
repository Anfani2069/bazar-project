import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { CustomerAuthService } from '@shared/services/customer-auth.service';

@Component({
  selector: 'page-auth',
  templateUrl: './auth.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
})
export class Auth {
  private readonly fb          = inject(NonNullableFormBuilder);
  private readonly authService = inject(CustomerAuthService);
  private readonly router      = inject(Router);

  protected readonly activeTab   = signal<'login' | 'register'>('login');
  protected readonly authLoading = signal(false);
  protected readonly authError   = signal('');

  protected readonly loginForm = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected readonly registerForm = this.fb.group({
    prenom:    ['', [Validators.required, Validators.minLength(2)]],
    nom:       ['', [Validators.required, Validators.minLength(2)]],
    telephone: ['', Validators.required],
    email:     ['', [Validators.required, Validators.email]],
    password:  ['', [Validators.required, Validators.minLength(6)]],
  });

  protected switchTab(tab: 'login' | 'register'): void {
    this.activeTab.set(tab);
    this.authError.set('');
  }

  protected async submitLogin(): Promise<void> {
    if (this.loginForm.invalid) { this.loginForm.markAllAsTouched(); return; }
    this.authLoading.set(true);
    this.authError.set('');
    const { email, password } = this.loginForm.getRawValue();
    const res = await this.authService.login(email, password);
    this.authLoading.set(false);
    if (!res.ok) { this.authError.set(res.error ?? 'Erreur.'); return; }
    this.router.navigate(['/']);
  }

  protected async submitRegister(): Promise<void> {
    if (this.registerForm.invalid) { this.registerForm.markAllAsTouched(); return; }
    this.authLoading.set(true);
    this.authError.set('');
    const v = this.registerForm.getRawValue();
    const res = await this.authService.register({
      prenom: v.prenom, nom: v.nom, telephone: v.telephone, email: v.email, password: v.password,
    });
    this.authLoading.set(false);
    if (!res.ok) { this.authError.set(res.error ?? 'Erreur.'); return; }
    this.router.navigate(['/']);
  }

  protected async submitGoogle(): Promise<void> {
    this.authLoading.set(true);
    this.authError.set('');
    const res = await this.authService.loginWithGoogle();
    this.authLoading.set(false);
    if (!res.ok) { this.authError.set(res.error ?? 'Erreur Google.'); return; }
    this.router.navigate(['/']);
  }

  protected hasError(form: 'login' | 'register', field: string): boolean {
    const ctrl = form === 'login' ? this.loginForm.get(field) : this.registerForm.get(field);
    return !!ctrl && ctrl.invalid && ctrl.touched;
  }
}
