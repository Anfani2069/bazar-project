import { Injectable, signal, computed } from '@angular/core';

export interface Customer {
  id:        string;
  prenom:    string;
  nom:       string;
  email:     string;
  telephone: string;
  password:  string;
}

const CUSTOMERS_KEY = 'bazar_customers';
const SESSION_KEY   = 'bazar_session';

@Injectable({ providedIn: 'root' })
export class CustomerAuthService {
  private readonly _current = signal<Customer | null>(this.loadSession());

  readonly currentUser  = this._current.asReadonly();
  readonly isLoggedIn   = computed(() => this._current() !== null);

  private loadSession(): Customer | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) as Customer : null;
    } catch { return null; }
  }

  private loadCustomers(): Customer[] {
    try {
      const raw = localStorage.getItem(CUSTOMERS_KEY);
      return raw ? JSON.parse(raw) as Customer[] : [];
    } catch { return []; }
  }

  private saveCustomers(list: Customer[]): void {
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(list));
  }

  register(data: Omit<Customer, 'id'>): { ok: boolean; error?: string } {
    const list = this.loadCustomers();
    if (list.some(c => c.email.toLowerCase() === data.email.toLowerCase())) {
      return { ok: false, error: 'Un compte avec cet e-mail existe déjà.' };
    }
    const customer: Customer = { ...data, id: crypto.randomUUID() };
    this.saveCustomers([...list, customer]);
    this.setSession(customer);
    return { ok: true };
  }

  login(email: string, password: string): { ok: boolean; error?: string } {
    const customer = this.loadCustomers().find(
      c => c.email.toLowerCase() === email.toLowerCase() && c.password === password
    );
    if (!customer) return { ok: false, error: 'E-mail ou mot de passe incorrect.' };
    this.setSession(customer);
    return { ok: true };
  }

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
    this._current.set(null);
  }

  private setSession(c: Customer): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify(c));
    this._current.set(c);
  }
}
