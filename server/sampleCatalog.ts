// Realistic catalog benchmarks and URL builders for Amazon, Flipkart, IKEA, Swiggy, Zomato, OYO, Tanishq, CaratLane

export function buildSearchUrl(platform: string, query: string): string {
  const encoded = encodeURIComponent(query);
  switch (platform.toLowerCase()) {
    case 'amazon':
      return `https://www.amazon.in/s?k=${encoded}`;
    case 'flipkart':
      return `https://www.flipkart.com/search?q=${encoded}`;
    case 'ikea':
      return `https://www.ikea.com/in/en/search/?q=${encoded}`;
    case 'pepperfry':
      return `https://www.pepperfry.com/site_product/search?q=${encoded}`;
    case 'urban ladder':
      return `https://www.urbanladder.com/products/search?keywords=${encoded}`;
    case 'swiggy':
      return `https://www.swiggy.com/search?query=${encoded}`;
    case 'zomato':
      return `https://www.zomato.com/search?q=${encoded}`;
    case 'oyo':
      return `https://www.oyorooms.com/search?query=${encoded}`;
    case 'tanishq':
      return `https://www.tanishq.co.in/shop/${encoded}`;
    case 'caratlane':
      return `https://www.caratlane.com/jewellery/${encoded}.html`;
    case 'bluestone':
      return `https://www.bluestone.com/jewellery/${encoded}.html`;
    case 'giva':
      return `https://www.giva.co/search?q=${encoded}`;
    default:
      return `https://www.google.com/search?q=${encoded}+buy+online`;
  }
}

export const HOME_CATALOG_BENCHMARKS = [
  {
    room: 'Living Room',
    category: 'Sofa & Seating',
    name: '3-Seater Fabric L-Shape Sectional Sofa',
    priceINR: 28500,
    priceUSD: 360,
    specs: 'High-density foam, stain-resistant linen blend, solid pine frame',
    platforms: ['IKEA', 'Pepperfry', 'Amazon'],
    budgetTier: 'Mid-range' as const,
  },
  {
    room: 'Living Room',
    category: 'Lighting & Chandeliers',
    name: 'Nordic Warm Minimalist Pendant Chandelier',
    priceINR: 5200,
    priceUSD: 65,
    specs: 'Tri-color dimmable LED, brushed brass aluminum finish',
    platforms: ['Amazon', 'Flipkart'],
    budgetTier: 'Value' as const,
  },
  {
    room: 'Living Room',
    category: 'Ceiling Fans',
    name: 'BLDC Aerodynamic Smart Ceiling Fan with Remote',
    priceINR: 3800,
    priceUSD: 48,
    specs: '28W energy saving BLDC motor, 1200mm sweep, whisper quiet',
    platforms: ['Amazon', 'Flipkart'],
    budgetTier: 'Value' as const,
  },
  {
    room: 'Dining Room',
    category: 'Dining Table & Chairs',
    name: 'Solid Sheesham Wood 4-Seater Dining Table Set',
    priceINR: 19500,
    priceUSD: 245,
    specs: 'Handcrafted seasoned Sheesham with honey teak polish and upholstered cushioned chairs',
    platforms: ['Pepperfry', 'Urban Ladder', 'Amazon'],
    budgetTier: 'Mid-range' as const,
  },
  {
    room: 'Bedroom',
    category: 'Bed & Mattress',
    name: 'Queen Size Engineered Wood Bed with Hydraulic Box Storage',
    priceINR: 21900,
    priceUSD: 275,
    specs: 'European standard particle board, headboard shelf, hydraulic lift-up base',
    platforms: ['IKEA', 'Flipkart', 'Pepperfry'],
    budgetTier: 'Mid-range' as const,
  },
  {
    room: 'Bedroom',
    category: 'Wardrobes & Storage',
    name: '3-Door Sliding Wardrobe with Full-Length Mirror',
    priceINR: 24000,
    priceUSD: 300,
    specs: 'Scratch-proof matte laminate, hanging rails, interior drawers, soft-close sliders',
    platforms: ['IKEA', 'Pepperfry'],
    budgetTier: 'Mid-range' as const,
  },
  {
    room: 'Kitchen',
    category: 'Modular Storage & Racks',
    name: 'Stainless Steel 3-Tier Rolling Kitchen Island & Spice Rack',
    priceINR: 4200,
    priceUSD: 52,
    specs: 'Heavy-duty 304 food-grade stainless steel with lockable castor wheels',
    platforms: ['Amazon', 'IKEA'],
    budgetTier: 'Value' as const,
  },
  {
    room: 'Home Office',
    category: 'Desk & Ergonomic Chair',
    name: 'Ergonomic Mesh High-Back Chair with Lumbar Support',
    priceINR: 7800,
    priceUSD: 98,
    specs: 'Pneumatic height adjustment, 2D armrests, breathable Korean mesh',
    platforms: ['Amazon', 'Flipkart'],
    budgetTier: 'Value' as const,
  }
];

export const PARTY_CATALOG_BENCHMARKS = [
  {
    category: 'Catering & Food/Beverages',
    service: 'Buffet Catering Package (3 Starters, 4 Mains, 2 Desserts)',
    pricePerPlateINR: 480,
    pricePerPlateUSD: 6.5,
    provider: 'Swiggy / Zomato Catering Partner',
    platforms: ['Swiggy', 'Zomato'],
  },
  {
    category: 'Venue Rental & Setup',
    service: 'Boutique AC Banquet Hall with Audio & Stage setup',
    priceFixedINR: 25000,
    priceFixedUSD: 320,
    provider: 'OYO Townhouse / Banquet Partner',
    platforms: ['OYO', 'Other'],
  },
  {
    category: 'Theme Decoration & Florals',
    service: 'Custom Balloon Arch, Welcome Board & Photo Booth Backdrop',
    priceFixedINR: 8500,
    priceFixedUSD: 110,
    provider: 'Local Event Decorators & Party Pros',
    platforms: ['Flipkart', 'Amazon', 'Other'],
  },
  {
    category: 'DJ, Music & Sound Entertainment',
    service: 'Professional Sound System, Console, Mic & DJ 4-Hour Set',
    priceFixedINR: 12000,
    priceFixedUSD: 150,
    provider: 'BookMyShow Live / Local Sound Artists',
    platforms: ['Other'],
  },
  {
    category: 'Photography & Videography',
    service: 'Candid Event Photographer with Edited High-Res Album & Teaser Reel',
    priceFixedINR: 11000,
    priceFixedUSD: 140,
    provider: 'Freelance Studio Photographer',
    platforms: ['Other'],
  }
];

export const JEWELRY_CATALOG_BENCHMARKS = [
  {
    type: 'Necklace',
    name: '18K Yellow Gold Floral Choker with Cubic Zirconia Accents',
    material: '18K Gold',
    priceINR: 38000,
    priceUSD: 480,
    platforms: ['Tanishq', 'CaratLane', 'Amazon'],
    style: 'Contemporary Chic',
  },
  {
    type: 'Earrings',
    name: '925 Sterling Silver Antique Temple Jhumkas',
    material: '925 Sterling Silver',
    priceINR: 4800,
    priceUSD: 60,
    platforms: ['Giva', 'Amazon', 'Flipkart'],
    style: 'Royal Traditional Heritage',
  },
  {
    type: 'Rings',
    name: 'Lab-Grown Solitaire Diamond Ring in Platinum Band',
    material: 'Platinum / Diamond',
    priceINR: 24500,
    priceUSD: 310,
    platforms: ['CaratLane', 'Bluestone'],
    style: 'Minimalist Everyday',
  },
  {
    type: 'Bangles / Bracelets',
    name: 'Rose Gold Plated Adjustable Tennis Bracelet with Swiss Crystals',
    material: 'Rose Gold Plated',
    priceINR: 3200,
    priceUSD: 42,
    platforms: ['Giva', 'Amazon', 'Flipkart'],
    style: 'Contemporary Chic',
  },
  {
    type: 'Pendant Set',
    name: '22K Hallmarked Gold Infinity Pendant with Matching Studs',
    material: '22K Gold',
    priceINR: 29800,
    priceUSD: 375,
    platforms: ['Tanishq', 'CaratLane'],
    style: 'Minimalist Everyday',
  }
];
