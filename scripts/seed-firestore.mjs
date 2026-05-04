/**
 * Seed Firestore — Bazar Comores
 *
 * Prérequis :
 *   1. Télécharger la clé service account :
 *      Firebase Console → Paramètres du projet → Comptes de service → Générer une nouvelle clé privée
 *      → Enregistrer sous  scripts/serviceAccountKey.json
 *   2. npm install firebase-admin   (dans le dossier racine du projet)
 *   3. node scripts/seed-firestore.mjs
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore }         from 'firebase-admin/firestore';
import { createRequire }        from 'module';

const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

// ─── PRODUITS ───────────────────────────────────────────────────────────────

const PRODUCTS = [
  { id: 'l1', name: 'Tomates fraîches des Comores',    price: 2.50,  emoji: '🍅', category: 'Légumes',  unit: 'kg',              description: 'Tomates cultivées dans les terres fertiles des Comores, gorgées de soleil.' },
  { id: 'l2', name: 'Manioc frais',                    price: 2.20,  emoji: '🥔', category: 'Légumes',  unit: 'kg',              description: 'Tubercule fondamental de la cuisine comorienne.' },
  { id: 'l3', name: 'Brèdes mafane',                   price: 1.80,  emoji: '🥬', category: 'Légumes',  unit: '500g',            description: 'Légume feuille emblématique des Comores aux vertus uniques.' },
  { id: 'l4', name: 'Concombre comorien',              price: 1.20,  emoji: '🥒', category: 'Légumes',  unit: 'pièce',           description: 'Légume frais et hydratant cultivé dans les jardins locaux.' },
  { id: 'f1', name: 'Bananes plantains',               price: 3.00,  emoji: '🍌', category: 'Fruits',   unit: 'kg',   badge: 'new', description: 'Variété de banane incontournable de la cuisine comorienne.' },
  { id: 'f2', name: 'Noix de coco',                   price: 1.50,  emoji: '🥥', category: 'Fruits',   unit: 'pièce',           description: 'Fruit emblématique des îles Comores.' },
  { id: 'f3', name: 'Mangues des Comores',             price: 4.50,  emoji: '🥭', category: 'Fruits',   unit: 'kg',              description: 'Mangues sucrées et juteuses cultivées dans les vergers comoriens.' },
  { id: 'f4', name: 'Papaye fraîche',                  price: 3.50,  emoji: '🍈', category: 'Fruits',   unit: 'kg',              description: 'Fruit tropical aux arômes délicats, riche en papaïne.' },
  { id: 'e1', name: 'Piment comorien',                 price: 1.80,  emoji: '🌶️', category: 'Épices',  unit: '250g',            description: 'Piment fort cultivé aux Comores, élément incontournable de la cuisine locale.' },
  { id: 'e2', name: 'Vanille des Comores',             price: 18.00, emoji: '🌿', category: 'Épices',  unit: '10g',  badge: 'new', description: 'Vanille premium des îles Comores, reconnue mondialement pour sa qualité exceptionnelle.' },
  { id: 'e3', name: 'Curcuma moulu',                   price: 3.50,  emoji: '🫚', category: 'Épices',  unit: '200g',            description: 'Épice dorée aux propriétés anti-inflammatoires reconnues.' },
  { id: 'e4', name: 'Gingembre séché',                 price: 4.00,  emoji: '🫛', category: 'Épices',  unit: '150g',            description: 'Racine séchée et moulue aux propriétés digestives et réchauffantes.' },
  { id: 'c1', name: 'Riz Onicor IR64 — 5 kg',         price: 8.50,  imageUrl: 'img/riz-onicor.png',                  category: 'Céréales', unit: '5kg',          badge: 'best-seller', originalPrice: 10.50, description: 'Riz grain long blanc importé par l\'Onicor. Variété IR64 double poli, 10% brisures.' },
  { id: 'c2', name: 'Farine de manioc',                price: 4.50,  emoji: '🫙', category: 'Céréales', unit: '1kg',             description: 'Farine sans gluten extraite du manioc frais.' },
  { id: 'c3', name: 'Farine de blé — 25 kg',           price: 18.00, imageUrl: 'img/Farine-25kilo.png',              category: 'Céréales', unit: 'sac 25 kg',     description: 'Farine de blé tout usage en grand format 25 kg.' },
  { id: 'c4', name: 'Macaroni — Pâtes alimentaires',   price: 1.80,  imageUrl: 'img/Macaroni-patte.png',             category: 'Céréales', unit: 'paquet 500g',   description: 'Pâtes macaroni de qualité supérieure, cuisson rapide.' },
  { id: 'r1', name: 'Riz Basmati Malika — 1 kg',       price: 2.80,  imageUrl: 'img/riz-basmati-malika-1kilo.png',   category: 'Céréales', unit: '1 kg',  badge: 'new', description: 'Riz basmati extra long grain de la marque Malika.' },
  { id: 'r2', name: 'Riz Basmati Malika — 10 kg',      price: 22.00, imageUrl: 'img/basmati-malika-10kilo.png',      category: 'Céréales', unit: '10 kg',         description: 'Grand sac de riz basmati Malika 10 kg.' },
  { id: 'r3', name: 'Riz Basmati Malika — 20 kg',      price: 38.00, imageUrl: 'img/basmati-malika-20kilo.png',      category: 'Céréales', unit: '20 kg',  badge: 'promo', originalPrice: 44.00, description: 'Format familial 20 kg de riz basmati Malika.' },
  { id: 'r4', name: 'Riz Basmati Malika — 40 kg',      price: 70.00, imageUrl: 'img/basmati-malika-40kilo.png',      category: 'Céréales', unit: '40 kg',         description: 'Grand format professionnel 40 kg de riz basmati Malika.' },
  { id: 'r5', name: 'Riz Basmati Sultan — 10 kg',      price: 24.00, imageUrl: 'img/riz-basmati-sultan-10kilo.png',  category: 'Céréales', unit: '10 kg', badge: 'best-seller', description: 'Riz basmati Sultan 10 kg, référence des tables comoriennes.' },
  { id: 'r6', name: 'Riz Basmati Sultan — 20 kg',      price: 42.00, imageUrl: 'img/basmati-sultan-20kilo.png',      category: 'Céréales', unit: '20 kg',         description: 'Grand format 20 kg de riz basmati Sultan.' },
  { id: 'r7', name: 'Riz Basmati Sultan — 40 kg',      price: 78.00, imageUrl: 'img/basmati-sultan-40kilo.png',      category: 'Céréales', unit: '40 kg',         description: 'Format professionnel 40 kg de riz basmati Sultan.' },
  { id: 'r8', name: 'Riz parfumé — 1 kg',              price: 2.50,  imageUrl: 'img/riz-parfume-1kilo.png',          category: 'Céréales', unit: '1 kg',  badge: 'new', description: 'Riz parfumé grain long en format 1 kg.' },
  { id: 'n1', name: 'Miel naturel des Comores',        price: 12.00, emoji: '🍯', category: 'Naturels', unit: '500g', badge: 'new', description: 'Miel pur récolté dans les ruches des Comores.' },
  { id: 'n2', name: 'Concentré de tomate Al Mudhish',  price: 4.50,  imageUrl: 'img/tomate-concentre.png',           category: 'Naturels', unit: 'boîte 24 sachets', badge: 'promo', originalPrice: 5.90, description: 'Pâte de tomates pure Al Mudhish, concentrée à 24%.' },
  { id: 'n3', name: 'Lait concentré sucré OKI',        price: 2.90,  imageUrl: 'img/Lait concentre.png',             category: 'Naturels', unit: '400g',          description: 'Lait concentré sucré OKI, riche en vitamines A et D.' },
  { id: 'n4', name: 'Lait en poudre Melody — Sachet',  price: 1.20,  imageUrl: 'img/melody-en-sachet.png',           category: 'Naturels', unit: 'sachet',        description: 'Lait en poudre entier Melody en sachet individuel.' },
  { id: 'n5', name: 'Lait en poudre Melody — Moyen',   price: 5.50,  imageUrl: 'img/Lait-en-poudre-melody-moyen.png',category: 'Naturels', unit: 'boîte 400g',    description: 'Lait entier en poudre Melody, format moyen 400g.' },
  { id: 'n6', name: 'Lait en poudre Melody — Grand',   price: 10.50, imageUrl: 'img/grande-melody.png',              category: 'Naturels', unit: 'boîte 900g', badge: 'best-seller', description: 'Grande boîte de lait entier en poudre Melody 900g.' },
  { id: 'n7', name: 'Sucre blanc — 5 kg',              price: 6.50,  imageUrl: 'img/sucre-5kilo.png',                category: 'Naturels', unit: 'sac 5 kg',      description: 'Sucre blanc cristallisé en sac 5 kg.' },
  { id: 'n8', name: 'Lait Nura — Boîte',               price: 3.50,  imageUrl: 'img/Lait nura.png',                  category: 'Naturels', unit: 'boîte',         description: 'Lait de la marque Nura, riche en calcium et en vitamines essentielles.' },
  { id: 'n9', name: 'Oeufs frais',                     price: 3.20,  imageUrl: 'img/oeufs.png',                      category: 'Naturels', unit: 'boîte 12 oeufs', badge: 'new', description: 'Oeufs frais du jour, élevés localement.' },
  { id: 'h1', name: 'Huile de coco vierge',            price: 9.00,  emoji: '🫙', category: 'Huiles',   unit: '500ml',           description: 'Huile extraite à froid de noix de coco fraîches des Comores.' },
  { id: 'h2', name: 'Huile de tournesol',              price: 6.90,  emoji: '🌻', category: 'Huiles',   unit: '1L',              description: 'Huile végétale légère et au goût neutre.' },
  { id: 'h3', name: 'Samli — Beurre clarifié',         price: 12.90, imageUrl: 'img/samli-beurre-clarifie.png',      category: 'Huiles',   unit: '900g', badge: 'best-seller', description: 'Beurre clarifié (ghee) de qualité supérieure, indispensable de la cuisine comorienne.' },
  { id: 'h4', name: 'Huile végétale — 1 L',            price: 2.50,  imageUrl: 'img/huile-1l.png',                   category: 'Huiles',   unit: 'bouteille 1 L', badge: 'promo', originalPrice: 3.20, description: 'Huile végétale raffinée polyvalente en bouteille 1 L.' },
  { id: 'h5', name: 'Huile végétale — 5 L',            price: 10.50, imageUrl: 'img/huile-5litre.png',               category: 'Huiles',   unit: 'bidon 5 L', badge: 'best-seller', description: 'Grand bidon d\'huile végétale 5 L.' },
  { id: 'p1', name: 'Filet de poisson séché',          price: 9.00,  emoji: '🐟', category: 'Poissons', unit: '400g', badge: 'best-seller', description: 'Poisson pêché dans les eaux de l\'océan Indien, séché selon la méthode traditionnelle.' },
  { id: 'p2', name: 'Crevettes séchées',               price: 11.00, emoji: '🦐', category: 'Poissons', unit: '300g',            description: 'Crevettes fraîches de l\'océan Indien séchées naturellement.' },
  { id: 'p3', name: 'Thon séché des Comores',          price: 5.50,  emoji: '🐠', category: 'Poissons', unit: '200g',            description: 'Thon des eaux comoriennes séché artisanalement.' },
  { id: 'p4', name: 'Sardines Delmonaco à l\'huile',   price: 1.20,  imageUrl: 'img/sardine.png',                    category: 'Poissons', unit: 'boîte 125g',    description: 'Sardines entières à l\'huile végétale, marque Delmonaco.' },
  { id: 'p5', name: 'Sardines Fruits de mer à l\'huile', price: 2.50,imageUrl: 'img/Sardine-vegetal-oil.png',        category: 'Poissons', unit: 'boîte 425g', badge: 'new', description: 'Grande boîte de sardines entières à l\'huile végétale.' },
  { id: 'b1', name: 'Eau Salsabil 500 ml',             price: 0.50,  imageUrl: 'img/salsabil 500ml.png',             category: 'Boissons', unit: 'bouteille 500 ml', description: 'Eau minérale naturelle Salsabil conditionnée aux Comores.' },
  { id: 'b2', name: 'Eau Salsabil 1,5 L',              price: 0.90,  imageUrl: 'img/salsabil 1,5l.png',              category: 'Boissons', unit: 'bouteille 1,5 L', badge: 'new', description: 'Grande bouteille d\'eau minérale naturelle Salsabil.' },
  { id: 'm1', name: 'Bonbonne Salsabil — Neuve',       price: 8.50,  imageUrl: 'img/bonbonne-neuve.png',             category: 'Boissons', unit: 'bonbonne 18,9 L', description: 'Grande bonbonne d\'eau minérale Salsabil neuve avec consigne.' },
  { id: 'm2', name: 'Recharge bonbonne Salsabil',      price: 4.50,  imageUrl: 'img/bondonne-rechargeable.png',      category: 'Boissons', unit: 'recharge 18,9 L', badge: 'promo', description: 'Recharge d\'eau minérale Salsabil pour bonbonne 18,9 L.' },
  { id: 'ca1', name: 'Café moulú',                     price: 4.50,  imageUrl: 'img/caffee.png',                     category: 'Café',     unit: 'paquet 250g', badge: 'new', description: 'Café moulú sélectionné, torréfaction médium, arôme intense.' },
];

// ─── COMMANDES DÉMO ─────────────────────────────────────────────────────────

const now = Date.now();
const ORDERS = [
  {
    id: 'BC-K3N7P2',
    date: new Date(now - 3_600_000).toISOString(),
    status: 'pending',
    recipient: { prenom: 'Fatima', nom: 'Ali', telephone: '3210101', email: 'fatima@mail.com', ile: 'Grande Comore (Ngazidja)', ville: 'Moroni', adresse: 'Quartier Badjanani' },
    delivery: { method: 'domicile', label: 'Livraison à domicile', cost: 8.90 },
    payment:  { method: 'carte',    label: '💳 Carte bancaire' },
    items: [
      { productId: 'c1', name: 'Riz Onicor IR64 — 5 kg',        price: 8.50, quantity: 2, imageUrl: 'img/riz-onicor.png' },
      { productId: 'p4', name: "Sardines Delmonaco à l'huile",   price: 1.20, quantity: 3, imageUrl: 'img/sardine.png' },
    ],
    subtotal: 20.60, total: 29.50,
  },
  {
    id: 'BC-M8L4X1',
    date: new Date(now - 86_400_000).toISOString(),
    status: 'processing',
    recipient: { prenom: 'Mohamed', nom: 'Hamidi', telephone: '3330202', ile: 'Anjouan (Ndzuani)', ville: 'Mutsamudu', adresse: 'Centre ville', instructions: 'Appeler avant livraison' },
    delivery: { method: 'express', label: 'Livraison express', cost: 15.00 },
    payment:  { method: 'carte',   label: '💳 Carte bancaire' },
    items: [
      { productId: 'h3', name: 'Samli — Beurre clarifié',         price: 12.90, quantity: 1, imageUrl: 'img/samli-beurre-clarifie.png' },
      { productId: 'n2', name: 'Concentré de tomate Al Mudhish',  price: 4.50,  quantity: 2, imageUrl: 'img/tomate-concentre.png' },
    ],
    subtotal: 21.90, total: 36.90,
  },
  {
    id: 'BC-Z2Q9R5',
    date: new Date(now - 172_800_000).toISOString(),
    status: 'shipped',
    recipient: { prenom: 'Aisha', nom: 'Said', telephone: '3215050', email: 'aisha@mail.com', ile: 'Mohéli (Mwali)', ville: 'Fomboni', adresse: 'Quartier Hamahamet' },
    delivery: { method: 'domicile', label: 'Livraison à domicile', cost: 8.90 },
    payment:  { method: 'paypal',   label: '🅿️ PayPal' },
    items: [
      { productId: 'n3', name: 'Lait concentré sucré OKI',  price: 2.90, quantity: 4, imageUrl: 'img/Lait concentre.png' },
      { productId: 'c1', name: 'Riz Onicor IR64 — 5 kg',   price: 8.50, quantity: 1, imageUrl: 'img/riz-onicor.png' },
    ],
    subtotal: 20.10, total: 29.00,
  },
  {
    id: 'BC-P5T1W8',
    date: new Date(now - 432_000_000).toISOString(),
    status: 'delivered',
    recipient: { prenom: 'Ibrahim', nom: 'Mze', telephone: '3219999', ile: 'Grande Comore (Ngazidja)', ville: 'Mitsamiouli', adresse: 'Face à la mosquée' },
    delivery: { method: 'relais', label: 'Point de retrait', cost: 0 },
    payment:  { method: 'carte',  label: '💳 Carte bancaire' },
    items: [
      { productId: 'p5', name: "Sardines Fruits de mer à l'huile", price: 2.50,  quantity: 2, imageUrl: 'img/Sardine-vegetal-oil.png' },
      { productId: 'e2', name: 'Vanille des Comores',               price: 18.00, quantity: 1, emoji: '🌿' },
    ],
    subtotal: 23.00, total: 23.00,
  },
];

// ─── CODES PROMO DÉMO ────────────────────────────────────────────────────────

const PROMOS = [
  { code: 'BIENVENUE10', type: 'percent', value: 10, minOrder: 20,  active: true  },
  { code: 'ETE2025',     type: 'percent', value: 15, minOrder: 50,  active: true  },
  { code: 'LIVRAISON',   type: 'fixed',   value: 5,  minOrder: 30,  active: false },
];

// ─── SEED ───────────────────────────────────────────────────────────────────

async function seed() {
  console.log('🚀 Démarrage du seed Firestore...\n');

  // Products
  console.log(`📦 Insertion de ${PRODUCTS.length} produits...`);
  const productBatch = db.batch();
  for (const p of PRODUCTS) {
    productBatch.set(db.collection('products').doc(p.id), p);
  }
  await productBatch.commit();
  console.log('   ✅ Produits insérés.\n');

  // Orders
  console.log(`🛒 Insertion de ${ORDERS.length} commandes démo...`);
  const orderBatch = db.batch();
  for (const o of ORDERS) {
    orderBatch.set(db.collection('orders').doc(o.id), o);
  }
  await orderBatch.commit();
  console.log('   ✅ Commandes insérées.\n');

  // Promos
  console.log(`🏷️  Insertion de ${PROMOS.length} codes promo...`);
  const promoBatch = db.batch();
  for (const p of PROMOS) {
    promoBatch.set(db.collection('promos').doc(p.code), p);
  }
  await promoBatch.commit();
  console.log('   ✅ Codes promo insérés.\n');

  console.log('🎉 Seed terminé avec succès !');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Erreur lors du seed :', err);
  process.exit(1);
});
