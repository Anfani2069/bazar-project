import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { PromoService } from '@features/checkout/promo.service';
import { NotificationService } from '@shared/services/notification.service';
import type { PromoCode } from '@features/checkout/promo.service';

@Component({
  selector: 'admin-promos',
  templateUrl: './admin-promos.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
})
export class AdminPromos {
  private readonly promoService = inject(PromoService);
  private readonly notifService = inject(NotificationService);
  private readonly fb           = inject(FormBuilder);

  protected readonly promos     = this.promoService.promos;
  protected readonly drawerOpen = signal(false);
  protected readonly editingCode = signal<string | null>(null);
  protected readonly deleteCode  = signal<string | null>(null);

  protected readonly form: FormGroup = this.fb.group({
    code:      ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9_-]+$/)]],
    type:      ['percent', Validators.required],
    value:     [null, [Validators.required, Validators.min(0.01)]],
    minOrder:  [null],
    active:    [true],
  });

  protected openAdd(): void {
    this.editingCode.set(null);
    this.form.reset({ code: '', type: 'percent', value: null, minOrder: null, active: true });
    this.drawerOpen.set(true);
  }

  protected openEdit(p: PromoCode): void {
    this.editingCode.set(p.code);
    this.form.patchValue({
      code:     p.code,
      type:     p.type,
      value:    p.value,
      minOrder: p.minOrder ?? null,
      active:   p.active,
    });
    this.drawerOpen.set(true);
  }

  protected closeDrawer(): void {
    this.drawerOpen.set(false);
    this.editingCode.set(null);
  }

  protected save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue();
    const data: PromoCode = {
      code:     v.code,
      type:     v.type,
      value:    +v.value,
      minOrder: v.minOrder ? +v.minOrder : undefined,
      active:   !!v.active,
    };
    const orig = this.editingCode();
    if (orig) {
      this.promoService.update(orig, data);
      this.notifService.success('Code promo modifié.');
    } else {
      this.promoService.add(data);
      this.notifService.success('Code promo créé.');
    }
    this.closeDrawer();
  }

  protected toggle(code: string): void {
    this.promoService.toggle(code);
    this.notifService.info('Statut du code mis à jour.');
  }

  protected askDelete(code: string): void  { this.deleteCode.set(code); }
  protected cancelDelete(): void           { this.deleteCode.set(null); }

  protected confirmDelete(): void {
    const code = this.deleteCode();
    if (code) {
      this.promoService.remove(code);
      this.notifService.success('Code promo supprimé.');
    }
    this.deleteCode.set(null);
  }

  protected typeLabel(type: string): string {
    return type === 'percent' ? 'Pourcentage (%)' : 'Montant fixe (€)';
  }
}
