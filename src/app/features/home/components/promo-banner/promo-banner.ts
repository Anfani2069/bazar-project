import { ChangeDetectionStrategy, Component } from '@angular/core';

interface PromoItem {
  icon: string;
  label: string;
  value: string;
  description: string;
}

const PROMO_ITEMS: PromoItem[] = [
  {
    icon:        '💰',
    label:       'Économisez',
    value:       '14€',
    description: 'Sur votre panier dès 3 produits achetés ensemble.',
  },
  {
    icon:        '🎁',
    label:       '1ère commande',
    value:       '-15%',
    description: 'Code BIENVENUE appliqué automatiquement à la caisse.',
  },
  {
    icon:        '🚢',
    label:       'Livraison offerte',
    value:       'Gratuite',
    description: 'Dès 50€ d\'achat, livraison directe aux Comores.',
  },
  {
    icon:        '✅',
    label:       'Produits certifiés',
    value:       '100% Local',
    description: 'Issus directement des producteurs comoriens.',
  },
];

@Component({
  selector: 'home-promo-banner',
  templateUrl: './promo-banner.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromoBanner {
  protected readonly items = PROMO_ITEMS;
}
