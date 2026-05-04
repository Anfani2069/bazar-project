import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AdminAuthService } from '../services/admin-auth.service';

@Component({
  selector: 'admin-login',
  templateUrl: './admin-login.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
})
export class AdminLogin {
  private readonly fb        = inject(FormBuilder);
  private readonly router    = inject(Router);
  private readonly adminAuth = inject(AdminAuthService);

  protected readonly error   = signal('');
  protected readonly loading = signal(false);

  protected readonly form = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  protected async submit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.error.set('');

    const { email, password } = this.form.value;
    const res = await this.adminAuth.login(email ?? '', password ?? '');

    if (!res.ok) {
      this.error.set(res.error ?? 'Identifiants incorrects.');
      this.loading.set(false);
      return;
    }

    this.router.navigate(['/admin/dashboard']);
  }
}
