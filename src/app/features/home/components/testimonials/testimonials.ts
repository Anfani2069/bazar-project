import { ChangeDetectionStrategy, Component } from '@angular/core';

interface Testimonial {
  initial: string;
  name: string;
  location: string;
  stars: number;
  text: string;
  avatarColor: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    initial: 'A', name: 'Aïcha M.', location: 'Paris, France', stars: 5,
    text: 'Mes parents aux Comores ont reçu leur commande en 4 jours. La qualité des produits est vraiment irréprochable, je recommande à 100% !',
    avatarColor: '#EAB308',
  },
  {
    initial: 'M', name: 'Mohammed K.', location: 'Lyon, France', stars: 5,
    text: 'Enfin une plateforme dédiée à notre communauté ! Les épices et le miel que je ne trouvais plus en France, je les commande ici.',
    avatarColor: '#0B3D34',
  },
  {
    initial: 'F', name: 'Fatima A.', location: 'Marseille, France', stars: 5,
    text: 'Service client réactif, livraison ponctuelle, produits authentiques. Toute la diaspora devrait connaître Bazar Comores !',
    avatarColor: '#2563EB',
  },
];

@Component({
  selector: 'home-testimonials',
  templateUrl: './testimonials.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Testimonials {
  protected readonly items = TESTIMONIALS;

  protected stars(n: number): number[] {
    return Array.from({ length: n });
  }
}
