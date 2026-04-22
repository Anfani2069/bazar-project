import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Hero }         from './components/hero/hero';
import { Categories }   from './components/categories/categories';
import { ProductGrid }  from './components/product-grid/product-grid';
import { PromoBanner }  from './components/promo-banner/promo-banner';
import { BestSellers }  from './components/best-sellers/best-sellers';
import { HowItWorks }   from './components/how-it-works/how-it-works';
import { Testimonials } from './components/testimonials/testimonials';

@Component({
  selector: 'page-home',
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Hero, Categories, ProductGrid, PromoBanner, BestSellers, HowItWorks, Testimonials],
})
export class Home {}
