import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ADMIN_TOKEN_KEY, ADMIN_CREDENTIALS } from '../guards/admin-auth.guard';

@Component({
  selector: 'admin-login',
  templateUrl: './admin-login.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
})
export class AdminLogin {
  private readonly fb     = inject(FormBuilder);
  private readonly router = inject(Router);

  protected readonly error   = signal('');
  protected readonly loading = signal(false);

  protected readonly form = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  protected submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.error.set('');

    const { email, password } = this.form.value;

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      localStorage.setItem(ADMIN_TOKEN_KEY, btoa(`${email}:${Date.now()}`));
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.error.set('Identifiants incorrects.');
      this.loading.set(false);
    }
  }
}
