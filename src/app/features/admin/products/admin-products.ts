import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyPipe, DecimalPipe } from '@angular/common';

import { ProductService } from '../services/product.service';
import { NotificationService } from '@shared/services/notification.service';
import { CATEGORIES as BASE_CATEGORIES } from '@features/catalogue/products.data';
import type { Product } from '@shared/models';

@Component({
  selector: 'admin-products',
  templateUrl: './admin-products.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, CurrencyPipe, DecimalPipe],
})
export class AdminProducts {
  private readonly productService  = inject(ProductService);
  private readonly notifService    = inject(NotificationService);
  private readonly fb              = inject(FormBuilder);

  protected readonly products    = this.productService.products;
  protected readonly allCats     = BASE_CATEGORIES.filter(c => c !== 'Tous');

  protected readonly search      = signal('');
  protected readonly filterCat   = signal('');
  protected readonly drawerOpen  = signal(false);
  protected readonly editingId   = signal<string | null>(null);
  protected readonly deleteId      = signal<string | null>(null);
  protected readonly resetConfirm  = signal(false);
  protected readonly viewId        = signal<string | null>(null);

  protected readonly viewProduct = computed(() => {
    const id = this.viewId();
    return id ? this.products().find(p => p.id === id) ?? null : null;
  });

  protected readonly filtered = computed(() => {
    const q   = this.search().toLowerCase().trim();
    const cat = this.filterCat();
    return this.products().filter(p => {
      const matchQ   = !q   || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
      const matchCat = !cat || p.category === cat;
      return matchQ && matchCat;
    });
  });

  protected readonly form: FormGroup = this.fb.group({
    name:          ['', Validators.required],
    price:         [null, [Validators.required, Validators.min(0)]],
    originalPrice: [null],
    category:      [''],
    unit:          [''],
    badge:         [''],
    imageUrl:      [''],
    emoji:         [''],
    description:   [''],
  });

  protected openView(p: Product): void  { this.viewId.set(p.id); }
  protected closeView(): void            { this.viewId.set(null); }

  protected openAdd(): void {
    this.editingId.set(null);
    this.form.reset({ name: '', price: null, originalPrice: null,
                      category: '', unit: '', badge: '',
                      imageUrl: '', emoji: '', description: '' });
    this.drawerOpen.set(true);
  }

  protected openEdit(p: Product): void {
    this.editingId.set(p.id);
    this.form.patchValue({
      name:          p.name,
      price:         p.price,
      originalPrice: p.originalPrice ?? null,
      category:      p.category      ?? '',
      unit:          p.unit          ?? '',
      badge:         p.badge         ?? '',
      imageUrl:      p.imageUrl      ?? '',
      emoji:         p.emoji         ?? '',
      description:   p.description   ?? '',
    });
    this.drawerOpen.set(true);
  }

  protected closeDrawer(): void {
    this.drawerOpen.set(false);
    this.editingId.set(null);
  }

  protected save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue();
    const data: Omit<Product, 'id'> = {
      name:          v.name.trim(),
      price:         +v.price,
      category:      v.category      || undefined,
      unit:          v.unit          || undefined,
      badge:         v.badge         || undefined,
      imageUrl:      v.imageUrl      || undefined,
      emoji:         v.emoji         || undefined,
      description:   v.description   || undefined,
      originalPrice: v.originalPrice ? +v.originalPrice : undefined,
    };
    const id = this.editingId();
    if (id) {
      this.productService.update(id, data);
      this.notifService.success('Produit modifié avec succès.');
    } else {
      this.productService.add(data);
      this.notifService.success('Produit ajouté au catalogue.');
    }
    this.closeDrawer();
  }

  protected askDelete(id: string): void { this.deleteId.set(id); }
  protected cancelDelete(): void        { this.deleteId.set(null); }

  protected confirmDelete(): void {
    const id = this.deleteId();
    if (id) {
      this.productService.remove(id);
      this.notifService.success('Produit supprimé.');
    }
    this.deleteId.set(null);
  }

  protected openResetConfirm(): void  { this.resetConfirm.set(true);  }
  protected cancelReset(): void       { this.resetConfirm.set(false); }

  protected confirmReset(): void {
    this.productService.reset();
    this.resetConfirm.set(false);
    this.notifService.info('Catalogue réinitialisé avec les données par défaut.');
  }

  protected setSearch(e: Event): void {
    this.search.set((e.target as HTMLInputElement).value);
  }

  protected setFilterCat(e: Event): void {
    this.filterCat.set((e.target as HTMLSelectElement).value);
  }

  protected badgeLabel(b?: string): string {
    return b === 'best-seller' ? '⭐ Best-seller' : b === 'new' ? '✨ Nouveau' : b === 'promo' ? '🔖 Promo' : '';
  }
}
