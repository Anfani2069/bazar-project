import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Step {
  number: string;
  icon: string;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  { number: '01', icon: '📱', title: 'Choisissez vos produits', description: 'Parcourez notre catalogue de produits comoriens et ajoutez-les à votre panier.' },
  { number: '02', icon: '💳', title: 'Payez en sécurité',       description: 'Réglez votre commande en ligne par CB ou virement. Paiement 100% sécurisé.' },
  { number: '03', icon: '🏪', title: 'Préparation locale aux Comores',  description: 'Un magasin partenaire aux Comores reçoit votre commande et prépare les produits sur place.' },
  { number: '04', icon: '🏠', title: 'Livraison à domicile',    description: 'Votre famille reçoit ses produits chez elle en 3 à 5 jours ouvrés.' },
];

@Component({
  selector: 'home-how-it-works',
  templateUrl: './how-it-works.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
})
export class HowItWorks {
  protected readonly steps = STEPS;
}
