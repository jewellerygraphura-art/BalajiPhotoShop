export const products = [
  {
    id: "JW-NEC-0001", // Retained SKU for compatibility
    slug: "rajasthani-wooden-toy-horse",
    name: "Rajasthani Hand-Painted Wooden Toy Horse",
    category: "Traditional Indian Toys",
    collection: "New Arrivals",
    occasion: "Festive",
    gender: "Kids",

    metalType: "Solid Wood",
    metalPurity: "Hand-Painted",
    color: "Multi-Color",
    grossWeight: 450, // weight in grams
    stones: [],

    price: 1200, // Dynamic retail price
    mrp: 1500,
    currency: "INR",
    inStock: true,
    stockQty: 30,

    // Dynamic B2B wholesale prices (for quantity >= 3)
    b2bPrice: {
      mrp: 1500,
      sale: 850 // When ordering 3 or more, wholesale discount applies!
    },
    b2bMoq: 3,

    tags: ["Best Seller", "New", "Handmade"],
    country: "India",

    images: {
      thumbnail: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=600",
      gallery: [
        "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=800",
      ],
      modelShots: [],
    },

    shortDescription:
      "Charming traditional Rajasthani wooden toy horse, meticulously hand-painted by heritage artisans using organic clay colors.",

    description: {
      overview:
        "Handcrafted in Udaipur, Rajasthan, this solid wood toy horse is a timeless piece of Indian heritage. Decorated with ornate traditional floral motifs and clay embossing, it serves as both a delightful children's toy and a majestic decorative accent for any Indian home.",
      features: [
        { label: "Material", value: "Premium Solid Mango Wood" },
        { label: "Colors Used", value: "100% Non-Toxic Organic Lacquer" },
        { label: "Weight", value: "450 grams" },
        { label: "Occasion", value: "Housewarming / Kids Birthday / Festive Gift" },
        { label: "Brand", value: "Balaji Gift Store" },
      ],
      additionalInfo: [
        {
          label: "Care",
          value: "Wipe gently with a soft dry cloth. Avoid exposure to water.",
        },
        {
          label: "Authenticity",
          value: "Handcrafted by GI-certified Rajasthani wooden toy artisans.",
        },
        {
          label: "Shipping",
          value: "Double-boxed packing with bubble protection to prevent paint chipping.",
        },
      ],
    },

    variants: [
      {
        id: "JW-NEC-0001-SM",
        size: "Small (6 inches)",
        price: 1200,
        stockQty: 20,
      },
      {
        id: "JW-NEC-0001-LG",
        size: "Large (10 inches)",
        price: 1800,
        stockQty: 10,
      },
    ],

    rating: 4.8,
    ratingCount: 52,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    createdAt: "2025-11-15T00:00:00.000Z",
  },

  {
    id: "JW-RNG-0002",
    slug: "brass-peacock-photo-frame",
    name: "Imperial Brass Peacock Photo Frame",
    category: "Premium Photo Frames",
    collection: "Luxury",
    occasion: "Anniversary",
    gender: "Unisex",

    metalType: "Solid Brass",
    metalPurity: "Polished Gold",
    color: "Imperial Gold",
    grossWeight: 950,
    stones: [],

    price: 2400,
    mrp: 3000,
    currency: "INR",
    inStock: true,
    stockQty: 40,

    b2bPrice: {
      mrp: 3000,
      sale: 1650 // Wholesale discount for 3+ units
    },
    b2bMoq: 3,

    tags: ["Best Seller", "Artisan"],
    country: "India",

    images: {
      thumbnail: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600",
      gallery: [
        "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800",
      ],
      modelShots: [],
    },

    shortDescription:
      "Heavyweight solid brass photo frame featuring exquisite hand-carved dancing peacock borders.",

    description: {
      overview:
        "Preserve your most precious memories in this majestic photo frame. Hand-cast in pure brass by generational metalsmiths in Aligarh, it features intricate details of dancing peacocks—the national bird of India—embellished with a rich antique gold finish.",
      features: [
        { label: "Material", value: "100% Solid Polished Brass" },
        { label: "Frame Size", value: "Holds 5x7 inch photograph" },
        { label: "Weight", value: "950 grams" },
        { label: "Stand Material", value: "Durable Velvet-Lined Wood Backing" },
        { label: "Brand", value: "Balaji Gift Store" },
      ],
      additionalInfo: [
        { label: "Care", value: "Clean with dry soft fiber cloth. Do not use chemical cleaners." },
        { label: "Occasion", value: "Perfect for Wedding / Parents Anniversary / Corporate Gift" },
      ],
    },

    variants: [
      { id: "JW-RNG-0002-5X7", size: "Standard 5x7 Inch", price: 2400, stockQty: 25 },
      { id: "JW-RNG-0002-8X10", size: "Grand 8x10 Inch", price: 3400, stockQty: 15 },
    ],

    rating: 4.9,
    ratingCount: 39,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    createdAt: "2025-11-20T00:00:00.000Z",
  },

  {
    id: "JW-EAR-0003",
    slug: "silver-plated-ganesha-frame",
    name: "Ornate Silver-Plated Ganesha Frame",
    category: "Premium Photo Frames",
    collection: "Festive",
    occasion: "Housewarming",
    gender: "Unisex",

    metalType: "Silver-Plated",
    metalPurity: "925 Silver Touch",
    color: "Bright Silver",
    grossWeight: 600,
    stones: [],

    price: 1950,
    mrp: 2500,
    currency: "INR",
    inStock: true,
    stockQty: 50,

    b2bPrice: {
      mrp: 2500,
      sale: 1250 // Wholesale pricing
    },
    b2bMoq: 3,

    tags: ["Auspicious", "Festive Pick"],
    country: "India",

    images: {
      thumbnail: "https://images.unsplash.com/photo-1544982503-9f984c14501a?q=80&w=600",
      gallery: [
        "https://images.unsplash.com/photo-1544982503-9f984c14501a?q=80&w=800",
      ],
      modelShots: [],
    },

    shortDescription:
      "Auspicious silver-plated Lord Ganesha photo frame with royal filigree borders, perfect for housewarmings.",

    description: {
      overview:
        "Invite prosperity and positive energy into your home with this beautiful silver-plated frame depicting Lord Ganesha. The frame features gorgeous filigree borders hand-carved in premium copper base and heavily plated with pure 999 silver.",
      features: [
        { label: "Plating", value: "99.9% Pure Silver Plating" },
        { label: "Core Material", value: "Premium Sturdy Copper Alloys" },
        { label: "Frame Size", value: "Holds 4x6 inch photograph" },
        { label: "Anti-Tarnish", value: "Triple Lacquer Coated to Prevent Tarnishing" },
        { label: "Brand", value: "Balaji Gift Store" },
      ],
      additionalInfo: [
        { label: "Gift Pack", value: "Arrives in our signature red velvet Ganesha gold-foiled gift box." },
        { label: "Occasion", value: "Ideal for Diwali / Griha Pravesh Housewarming / New Office Openings" },
      ],
    },

    variants: [],

    rating: 4.9,
    ratingCount: 74,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
    createdAt: "2025-10-10T00:00:00.000Z",
  },

  {
    id: "JW-BRC-0004",
    slug: "traditional-kathputli-puppets",
    name: "Traditional Kathputli Puppet Pair",
    category: "Traditional Indian Toys",
    collection: "Everyday Luxe",
    occasion: "Homewarming",
    gender: "Unisex",

    metalType: "Organic Cotton",
    metalPurity: "Handcrafted Wood",
    color: "Vibrant Pink & Yellow",
    grossWeight: 350,
    stones: [],

    price: 950,
    mrp: 1200,
    currency: "INR",
    inStock: true,
    stockQty: 30,

    b2bPrice: {
      mrp: 1200,
      sale: 550 // Wholesale pricing
    },
    b2bMoq: 3,

    tags: ["Handmade", "Home Decor"],
    country: "India",

    images: {
      thumbnail: "https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?q=80&w=600",
      gallery: [
        "https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?q=80&w=800",
      ],
      modelShots: [],
    },

    shortDescription:
      "A stunning pair of traditional Rajasthani Kathputli puppets depicting a King and Queen, hand-stitched with vintage fabrics.",

    description: {
      overview:
        "Bring the vibrant energy of Rajasthani puppet theater into your space. These authentic Kathputlis are hand-carved in mango wood, draped in exquisite hand-embroidered bandhani textiles, and accented with mirrors and golden threads (Gota Patti).",
      features: [
        { label: "Puppet Type", value: "Traditional Rajasthani String Puppet Pair (King & Queen)" },
        { label: "Materials", value: "Mango Wood, Premium Bandhani Cotton, Gota Patti, Glass Mirrors" },
        { label: "Height", value: "18 inches each" },
        { label: "Artisan Base", value: "Hand-stitched by traditional puppeteers of Jaipur" },
      ],
      additionalInfo: [
        { label: "Display", value: "Includes integrated cotton hanging strings." },
        { label: "Note", value: "Since it is 100% handmade, slight variations in dress color may occur." },
      ],
    },

    variants: [],

    rating: 4.7,
    ratingCount: 46,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
    createdAt: "2025-09-05T00:00:00.000Z",
  },

  {
    id: "JW-SET-0005",
    slug: "maharaja-carved-rosewood-frame",
    name: "Maharaja Hand-Carved Rosewood Frame",
    category: "Premium Photo Frames",
    collection: "Luxury",
    occasion: "Wedding",
    gender: "Unisex",

    metalType: "Sheesham Wood",
    metalPurity: "Artisan Carved",
    color: "Rich Sheesham Dark Brown",
    grossWeight: 1200,
    stones: [],

    price: 3600,
    mrp: 4500,
    currency: "INR",
    inStock: true,
    stockQty: 10,

    b2bPrice: {
      mrp: 4500,
      sale: 2350 // Deep wholesale pricing
    },
    b2bMoq: 3,

    tags: ["Luxury Pick", "Woodcraft"],
    country: "India",

    images: {
      thumbnail: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600",
      gallery: [
        "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800",
      ],
      modelShots: [],
    },

    shortDescription:
      "Exquisite royal Maharaja rosewood (Sheesham) photo frame, deep hand-carved with traditional royal patterns.",

    description: {
      overview:
        "Crafted in Saharanpur, Uttar Pradesh, this solid Sheesham rosewood photo frame is carved completely by hand using traditional chiseling techniques. Features heavy floral lattice work (Jali carving), representing classical Indian Mughal palace decor.",
      features: [
        { label: "Wood Type", value: "100% Solid Aged Sheesham (Rosewood)" },
        { label: "Carving Style", value: "Deep Hand-Chiseled Lattice Jali Work" },
        { label: "Holds Photo", value: "8x10 Inch Photograph" },
        { label: "Glass Shield", value: "Premium High-Clarity Acrylic Shield Included" },
      ],
      additionalInfo: [
        { label: "Care", value: "Polish occasionally with beeswax to preserve deep grain glow." },
        { label: "Certification", value: "Balaji Gift Store artisan authenticity card included." },
      ],
    },

    variants: [],

    rating: 4.8,
    ratingCount: 28,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: false,
    createdAt: "2025-08-18T00:00:00.000Z",
  },

  {
    id: "JW-NEC-0006",
    slug: "channapatna-wooden-stacking-toy",
    name: "Channapatna Wooden Stacking Ring Toy",
    category: "Traditional Indian Toys",
    collection: "New Arrivals",
    occasion: "Kids Celebration",
    gender: "Kids",

    metalType: "Wrightia Wood",
    metalPurity: "Lacquer Finished",
    color: "Vibrant Lacquer Colors",
    grossWeight: 380,
    stones: [],

    price: 850,
    mrp: 1100,
    currency: "INR",
    inStock: true,
    stockQty: 60,

    b2bPrice: {
      mrp: 1100,
      sale: 490 // Wholesale pricing
    },
    b2bMoq: 3,

    tags: ["GI Tagged", "Organic", "Safe for Kids"],
    country: "India",

    images: {
      thumbnail: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=600",
      gallery: [
        "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=800",
      ],
      modelShots: [],
    },

    shortDescription:
      "A famous GI-tagged organic lacquer wooden stacking toy handcrafted in Channapatna, Karnataka.",

    description: {
      overview:
        "Made from medicinal ivory-wood (Aale Mara) and colored strictly using organic vegetable dyes (turmeric, indigo, kumkum) mixed with natural shellac lacquer, this iconic toy is 100% natural, biodegradable, and perfectly safe for babies and toddlers.",
      features: [
        { label: "Wood Base", value: "Ivory Wood ( Wrightia Tinctoria )" },
        { label: "Color Technique", value: "Hand-Polished Natural Shellac & Vegetable Lacquer Dyes" },
        { label: "GI Status", value: "Geographical Indication (GI) Tagged Authentic Toy" },
        { label: "Safety Purity", value: "Chemical-Free, Plastic-Free, Non-Toxic Rounded Edges" },
      ],
      additionalInfo: [
        { label: "Sourcing", value: "Directly sourced from rural toys cooperatives of Channapatna." },
      ],
    },

    variants: [],

    rating: 4.9,
    ratingCount: 110,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    createdAt: "2025-12-01T00:00:00.000Z",
  },
];
