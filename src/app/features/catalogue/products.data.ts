import type { Product } from '@shared/models';

export const ALL_PRODUCTS: Product[] = [
  {
    id: 'l1', name: 'Tomates fraîches des Comores', price: 2.50, emoji: '🍅',
    category: 'Légumes',  unit: 'kg',
    description: 'Tomates cultivées dans les terres fertiles des Comores, gorgées de soleil. Parfaites pour les sauces, salades ou plats mijotés traditionnels comoriens.',
  },
  {
    id: 'l2', name: 'Manioc frais', price: 2.20, emoji: '🥔',
    category: 'Légumes', unit: 'kg',
    description: 'Tubercule fondamental de la cuisine comorienne. Sa chair blanche et farineuse se prête à de nombreuses préparations : bouilli, frit ou en accompagnement de viandes et poissons.',
  },
  {
    id: 'l3', name: 'Brèdes mafane', price: 1.80, emoji: '🥬',
    category: 'Légumes', unit: '500g',
    description: 'Légume feuille emblématique des Comores aux vertus uniques. Se consomme sauté à l\'huile de coco ou en soupe traditionnelle. Un incontournable de la table comorienne.',
  },
  {
    id: 'l4', name: 'Concombre comorien', price: 1.20, emoji: '🥒',
    category: 'Légumes', unit: 'pièce',
    description: 'Légume frais et hydratant cultivé dans les jardins locaux. Idéal en salade ou pour accompagner les plats épicés comoriens. Se déguste aussi nature avec du sel et du piment.',
  },
  {
    id: 'f1', name: 'Bananes plantains', price: 3.00, emoji: '🍌',
    category: 'Fruits', unit: 'kg', badge: 'new',
    description: 'Variété de banane incontournable de la cuisine comorienne. Moins sucrée que la banane dessert, elle se déguste frite, bouillie ou grillée. Riche en glucides et en potassium.',
  },
  {
    id: 'f2', name: 'Noix de coco', price: 1.50, emoji: '🥥',
    category: 'Fruits', unit: 'pièce',
    description: 'Fruit emblématique des îles Comores. Sa pulpe blanche est utilisée dans de nombreux plats (curry, desserts) et son eau est une boisson naturellement rafraîchissante et hydratante.',
  },
  {
    id: 'f3', name: 'Mangues des Comores', price: 4.50, emoji: '🥭',
    category: 'Fruits', unit: 'kg',
    description: 'Mangues sucrées et juteuses cultivées dans les vergers comoriens. Riches en vitamines A et C. À déguster nature, en jus tropical ou en salade de fruits exotiques.',
  },
  {
    id: 'f4', name: 'Papaye fraîche', price: 3.50, emoji: '🍈',
    category: 'Fruits', unit: 'kg',
    description: 'Fruit tropical aux arômes délicats, riche en papaïne, excellent pour la digestion. Saveur douce et légèrement musquée. Idéal nature, en salade ou en smoothie.',
  },
  {
    id: 'e1', name: 'Piment comorien', price: 1.80, emoji: '🌶️',
    category: 'Épices', unit: '250g',
    description: 'Piment fort cultivé aux Comores, élément incontournable de la cuisine locale. Apporte chaleur et saveur aux plats. À doser selon votre tolérance au piment.',
  },
  {
    id: 'e2', name: 'Vanille des Comores', price: 18.00, emoji: '🌿',
    category: 'Épices', unit: '10g', badge: 'new',
    description: 'Vanille premium des îles Comores, reconnue mondialement pour sa qualité exceptionnelle. Arôme riche, profond et puissant. Idéale pour pâtisseries, crèmes et desserts raffinés.',
  },
  {
    id: 'e3', name: 'Curcuma moulu', price: 3.50, emoji: '🫚',
    category: 'Épices', unit: '200g',
    description: 'Épice dorée aux propriétés anti-inflammatoires reconnues. Base de nombreux currys et plats comoriens. Saveur douce, légèrement poivrée et terreuse. À associer avec du poivre noir.',
  },
  {
    id: 'e4', name: 'Gingembre séché', price: 4.00, emoji: '🫛',
    category: 'Épices', unit: '150g',
    description: 'Racine séchée et moulue aux propriétés digestives et réchauffantes. Parfume thés, plats mijotés et marinades selon la tradition comorienne. Un allié santé reconnu.',
  },
  {
    id: 'c1', name: 'Riz Onicor IR64 — 5 kg', price: 8.50,
    imageUrl: 'img/riz-onicor.png',
    category: 'Céréales', unit: '5kg', badge: 'best-seller', originalPrice: 10.50,
    description: 'Riz grain long blanc importé par l\'Onicor (Office National d\'Importation et de Commercialisation du Riz). Variété IR64 double poli, 10% brisures. L\'incontournable des tables comoriennes.',
  },
  {
    id: 'c2', name: 'Farine de manioc', price: 4.50, emoji: '🫙',
    category: 'Céréales', unit: '1kg',
    description: 'Farine sans gluten extraite du manioc frais. Alternative naturelle à la farine de blé pour les personnes intolérantes. Utilisée pour préparer galettes, beignets et plats traditionnels.',
  },
  {
    id: 'n1', name: 'Miel naturel des Comores', price: 12.00, emoji: '🍯',
    category: 'Naturels', unit: '500g', badge: 'new',
    description: 'Miel pur récolté dans les ruches des Comores, aux saveurs florales subtiles et complexes. 100% naturel, non chauffé et non traité. Parfait au petit-déjeuner ou comme édulcorant naturel.',
  },
  {
    id: 'n2', name: 'Concentré de tomate Al Mudhish', price: 4.50,
    imageUrl: 'img/tomate-concentre.png',
    category: 'Naturels', unit: 'boîte 24 sachets', badge: 'promo', originalPrice: 5.90,
    description: 'Pâte de tomates pure et naturelle Al Mudhish, concentrée à 24%. Présentation en sachets pratiques de 70g. Incontournable des cuisines comoriennes pour les sauces, ragouts et plats mijotés.',
  },
  {
    id: 'n3', name: 'Lait concentré sucré OKI', price: 2.90,
    imageUrl: 'img/Lait concentre.png',
    category: 'Naturels', unit: '400g',
    description: 'Lait concentré sucré de la marque OKI, riche en vitamines A et D, source de calcium. Incontournable du thé et café comoriens, des desserts et des crêpes. Texture onctueuse et goût doux.',
  },
  {
    id: 'h3', name: 'Samli — Beurre clarifié', price: 12.90,
    imageUrl: 'img/samli-beurre-clarifie.png',
    category: 'Huiles', unit: '900g', badge: 'best-seller',
    description: 'Beurre clarifié (ghee) de qualité supérieure, indispensable de la cuisine comorienne. Parfait pour les fritures, les mkatra foutra, les samoussas et les gâteaux de fête. Saveur riche et dorée.',
  },
  {
    id: 'h1', name: 'Huile de coco vierge', price: 9.00, emoji: '🫙',
    category: 'Huiles', unit: '500ml',
    description: 'Huile extraite à froid de noix de coco fraîches des Comores. Idéale pour la cuisine à haute température et les soins beauté. Goût délicat de noix de coco, riche en acides gras.',
  },
  {
    id: 'h2', name: 'Huile de tournesol', price: 6.90, emoji: '🌻',
    category: 'Huiles', unit: '1L',
    description: 'Huile végétale légère et au goût neutre, parfaite pour toutes les cuissons. Riche en vitamine E et en oméga-6. Idéale pour fritures, sautés et assaisonnements du quotidien.',
  },
  {
    id: 'p1', name: 'Filet de poisson séché', price: 9.00, emoji: '🐟',
    category: 'Poissons', unit: '400g', badge: 'best-seller',
    description: 'Poisson pêché dans les eaux cristallines de l\'océan Indien, séché selon la méthode traditionnelle comorienne. Concentré en saveurs, il enrichit bouillons, sauces et plats mijotés.',
  },
  {
    id: 'p4', name: 'Sardines Delmonaco à l\'huile', price: 1.20,
    imageUrl: 'img/sardine.png',
    category: 'Poissons', unit: 'boîte 125g',
    description: 'Sardines entières à l\'huile végétale, marque Delmonaco. Riches en oméga-3 et protéines. Un classique des épiceries comoriennes, idéal avec du riz blanc ou en salade. Boîte facile à ouvrir.',
  },
  {
    id: 'p5', name: 'Sardines Fruits de mer à l\'huile', price: 2.50,
    imageUrl: 'img/Sardine-vegetal-oil.png',
    category: 'Poissons', unit: 'boîte 425g', badge: 'new',
    description: 'Grande boîte de sardines entières à l\'huile végétale, marque Fruits de mer. 425g net (235g égoutté). Idéale en famille, avec du riz blanc, en salade ou en sandwich. Riche en oméga-3.',
  },
  {
    id: 'p2', name: 'Crevettes séchées', price: 11.00, emoji: '🦐',
    category: 'Poissons', unit: '300g',
    description: 'Crevettes fraîches de l\'océan Indien séchées naturellement. Apportent une saveur marine intense aux plats asiatiques et africains. Riches en protéines, minéraux et oligo-éléments.',
  },
  {
    id: 'p3', name: 'Thon séché des Comores', price: 5.50, emoji: '🐠',
    category: 'Poissons', unit: '200g',
    description: 'Thon des eaux comoriennes séché artisanalement selon les traditions locales. Chair dense et savoureuse. Parfait émietté dans les salades, sauces ou en accompagnement de riz.',
  },
  {
    id: 'n4', name: 'Lait en poudre Melody — Sachet', price: 1.20,
    imageUrl: 'img/melody-en-sachet.png',
    category: 'Naturels', unit: 'sachet',
    description: 'Lait en poudre entier Melody en sachet individuel. Format pratique et économique, idéal pour le thé, le café ou la bouillie. Très populaire dans les foyers comoriens.',
  },
  {
    id: 'n5', name: 'Lait en poudre Melody — Moyen', price: 5.50,
    imageUrl: 'img/Lait-en-poudre-melody-moyen.png',
    category: 'Naturels', unit: 'boîte 400g',
    description: 'Lait entier en poudre Melody, format moyen 400g. Riche en calcium et vitamines. Parfait pour le petit-déjeuner, les desserts et la préparation de boissons lactées.',
  },
  {
    id: 'n6', name: 'Lait en poudre Melody — Grand format', price: 10.50,
    imageUrl: 'img/grande-melody.png',
    category: 'Naturels', unit: 'boîte 900g', badge: 'best-seller',
    description: 'Grande boîte de lait entier en poudre Melody 900g. Format familial économique. Qualité constante, riche en nutriments essentiels. La référence des épiceries comoriennes.',
  },
  {
    id: 'b1', name: 'Eau Salsabil 500 ml', price: 0.50,
    imageUrl: 'img/salsabil 500ml.png',
    category: 'Boissons', unit: 'bouteille 500 ml',
    description: 'Eau minérale naturelle Salsabil conditionnée aux Comores. Légèrement minéralisée, douce au goût. Idéale pour la consommation quotidienne, à table ou en déplacement.',
  },
  {
    id: 'b2', name: 'Eau Salsabil 1,5 L', price: 0.90,
    imageUrl: 'img/salsabil 1,5l.png',
    category: 'Boissons', unit: 'bouteille 1,5 L', badge: 'new',
    description: 'Grande bouteille d\'eau minérale naturelle Salsabil. Format familial pratique pour la maison ou le bureau. Eau pure conditionnée localement aux Comores.',
  },
  {
    id: 'm1', name: 'Bonbonne d’eau Salsabil — Neuve', price: 8.50,
    imageUrl: 'img/bonbonne-neuve.png',
    category: 'Boissons', unit: 'bonbonne 18,9 L',
    description: 'Grande bonbonne d’eau minérale Salsabil neuve avec consigne. Format 18,9 L compatible avec tous les distributeurs d’eau de bureau et de maison. Eau pure conditionnée localement aux Comores.',
  },
  {
    id: 'm2', name: 'Recharge bonbonne Salsabil', price: 4.50,
    imageUrl: 'img/bondonne-rechargeable.png',
    category: 'Boissons', unit: 'recharge 18,9 L', badge: 'promo',
    description: 'Recharge d’eau minérale Salsabil pour bonbonne 18,9 L. Tarif avantageux pour les clients possédant déjà leur bonbonne consignée. Idéal pour la maison, le bureau ou les restaurants.',
  },
];

export const CATEGORIES = ['Tous', 'Légumes', 'Fruits', 'Épices', 'Céréales', 'Naturels', 'Huiles', 'Poissons', 'Boissons'];
