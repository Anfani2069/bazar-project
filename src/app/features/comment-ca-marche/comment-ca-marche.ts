import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Step {
  number: string;
  icon: string;
  title: string;
  detail: string;
}

interface Faq {
  question: string;
  answer: string;
}

const STEPS: Step[] = [
  {
    number: '01', icon: '📱',
    title: 'Parcourez le catalogue',
    detail: 'Explorez notre catalogue de produits alimentaires 100% comoriens. Filtrez par catégorie (légumes, fruits, épices, poissons…) et ajoutez les articles souhaités à votre panier.',
  },
  {
    number: '02', icon: '💳',
    title: 'Passez votre commande',
    detail: 'Indiquez l\'adresse de livraison de votre proche aux Comores puis procédez au paiement sécurisé par carte bancaire ou virement. Vous recevez immédiatement une confirmation par e-mail.',
  },
  {
    number: '03', icon: '🏪',
    title: 'Préparation par nos partenaires locaux',
    detail: 'Un magasin partenaire aux Comores reçoit la notification de votre commande et rassemble les produits sur place. Pas d\'envoi depuis la France — tout est acheté et préparé localement.',
  },
  {
    number: '04', icon: '🏠',
    title: 'Livraison à domicile',
    detail: 'Votre famille reçoit ses produits directement à domicile en 3 à 5 jours ouvrés. Pas besoin de se déplacer, tout est livré à l\'adresse indiquée.',
  },
];

const FAQS: Faq[] = [
  { question: 'Quels îles sont couvertes par le service ?',         answer: 'Nous travaillons avec des magasins partenaires en Grande Comore, Anjouan et Mohéli. D\'autres localités seront ajoutées prochainement.' },
  { question: 'Combien coûtent les frais de service ?',            answer: 'Les frais de service sont offerts dès 50€ d\'achat. En dessous, ils sont de 8,90€.' },
  { question: 'Comment suivre ma commande ?',                      answer: 'Dès que le magasin partenaire confirme la préparation, vous recevez un e-mail de mise à jour. La livraison locale est ensuite effectuée sous 24 à 48h.' },
  { question: 'Les produits sont-ils frais à la livraison ?',      answer: 'Oui ! Puisque les produits sont achetés et préparés directement par nos magasins partenaires aux Comores, ils sont frais et disponibles localement.' },
  { question: 'Puis-je modifier ou annuler ma commande ?',         answer: 'Vous pouvez modifier ou annuler votre commande dans les 2 heures suivant la validation. Contactez notre support.' },
];

@Component({
  selector: 'page-comment-ca-marche',
  templateUrl: './comment-ca-marche.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
})
export class CommentCaMarche {
  protected readonly steps    = STEPS;
  protected readonly faqs     = FAQS;
  protected readonly openFaq  = signal<number | null>(null);

  protected toggleFaq(index: number): void {
    this.openFaq.update(current => current === index ? null : index);
  }
}
