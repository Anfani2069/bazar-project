import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'page-auth',
  templateUrl: './auth.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
})
export class Auth {
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly activeTab = signal<'login' | 'register'>('login');

  protected readonly loginForm = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected readonly registerForm = this.fb.group({
    name:     ['', Validators.required],
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected switchTab(tab: 'login' | 'register'): void {
    this.activeTab.set(tab);
  }

  protected submitLogin(): void {
    if (this.loginForm.invalid) { this.loginForm.markAllAsTouched(); return; }
    console.log('Login:', this.loginForm.value);
  }

  protected submitRegister(): void {
    if (this.registerForm.invalid) { this.registerForm.markAllAsTouched(); return; }
    console.log('Register:', this.registerForm.value);
  }

  protected hasError(form: 'login' | 'register', field: string): boolean {
    const ctrl = form === 'login' ? this.loginForm.get(field) : this.registerForm.get(field);
    return !!ctrl && ctrl.invalid && ctrl.touched;
  }
}
