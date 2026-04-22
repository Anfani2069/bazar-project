import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Value {
  icon: string;
  title: string;
  description: string;
}

const VALUES: Value[] = [
  { icon: '🇰🇲', title: 'Origine garantie',  description: 'Chaque produit est sourcé directement auprès de producteurs comoriens de confiance, pour une authenticité totale.' },
  { icon: '🏪', title: 'Réseau de partenaires locaux',    description: 'Nos magasins partenaires aux Comores (Grande Comore, Anjouan, Mohéli) achètent et livrent les produits directement sur place.' },
  { icon: '🤝', title: 'Communauté d\'abord', description: 'Nous sommes nés de la diaspora comorienne en France. Notre mission est de renforcer le lien entre les familles.' },
];

@Component({
  selector: 'page-about',
  templateUrl: './about.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
})
export class About {
  protected readonly values = VALUES;
}
