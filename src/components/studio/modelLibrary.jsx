// ─── CURATED CLOTHING MODEL LIBRARY ─────────────────────────────────────────
// Rules enforced per model:
//   Full Body  → head-to-toe visible, full outfit shown
//   Upper Body → waist-up clearly showing top/jacket/hoodie
//   Lower Body → hip-to-floor clearly showing pants/skirt/shorts
// Only neutral standing/posed shots. No headshots. No duplicates.

export const FEMALE_MODELS = [

  // ── FULL BODY ─────────────────────────────────────────────────────────────

  {
    id: 'f-slim-full-casual-1',
    name: 'Lily',
    gender: 'female',
    body_type: 'Slim',
    style: 'Casual',
    age_group: 'Young Adult',
    view_type: 'Full Body',
    // Full body, white background, jeans + top clearly visible head to toe
    thumbnail_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop&crop=center',
  },
  {
    id: 'f-slim-full-fashion-1',
    name: 'Chloe',
    gender: 'female',
    body_type: 'Slim',
    style: 'Fashion',
    age_group: 'Young Adult',
    view_type: 'Full Body',
    // Full body street fashion, full outfit visible
    thumbnail_url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&h=600&fit=crop&crop=center',
  },
  {
    id: 'f-regular-full-casual-1',
    name: 'Sofia',
    gender: 'female',
    body_type: 'Regular',
    style: 'Casual',
    age_group: 'Adult',
    view_type: 'Full Body',
    // Full body, dress clearly visible
    thumbnail_url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=600&fit=crop&crop=center',
  },
  {
    id: 'f-regular-full-street-1',
    name: 'Jade',
    gender: 'female',
    body_type: 'Regular',
    style: 'Streetwear',
    age_group: 'Young Adult',
    view_type: 'Full Body',
    // Full body, street outfit head to toe
    thumbnail_url: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=600&fit=crop&crop=center',
  },
  {
    id: 'f-regular-full-fashion-1',
    name: 'Leila',
    gender: 'female',
    body_type: 'Regular',
    style: 'Fashion',
    age_group: 'Young Adult',
    view_type: 'Full Body',
    // Full body fashion shot, complete outfit visible
    thumbnail_url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=600&fit=crop&crop=center',
  },
  {
    id: 'f-curvy-full-casual-1',
    name: 'Bianca',
    gender: 'female',
    body_type: 'Curvy',
    style: 'Casual',
    age_group: 'Adult',
    view_type: 'Full Body',
    // Full body, curvy silhouette clearly visible
    thumbnail_url: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=400&h=600&fit=crop&crop=center',
  },
  {
    id: 'f-plus-full-casual-1',
    name: 'Nia',
    gender: 'female',
    body_type: 'Plus Size',
    style: 'Casual',
    age_group: 'Adult',
    view_type: 'Full Body',
    // Full body plus size, complete outfit visible
    thumbnail_url: 'https://images.unsplash.com/photo-1588117305388-c2631a279f82?w=400&h=600&fit=crop&crop=center',
  },
  {
    id: 'f-mature-full-casual-1',
    name: 'Diane',
    gender: 'female',
    body_type: 'Regular',
    style: 'Mature',
    age_group: 'Mature',
    view_type: 'Full Body',
    // Full body, mature woman, full outfit visible
    thumbnail_url: 'https://images.unsplash.com/photo-1566206091558-7f218b696731?w=400&h=600&fit=crop&crop=center',
  },

  // ── UPPER BODY ────────────────────────────────────────────────────────────

  {
    id: 'f-slim-upper-casual-1',
    name: 'Maya',
    gender: 'female',
    body_type: 'Slim',
    style: 'Casual',
    age_group: 'Young Adult',
    view_type: 'Upper Body',
    // Waist-up, top/sweater clearly visible
    thumbnail_url: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=400&h=550&fit=crop&crop=top',
  },
  {
    id: 'f-slim-upper-street-1',
    name: 'Raya',
    gender: 'female',
    body_type: 'Slim',
    style: 'Streetwear',
    age_group: 'Young Adult',
    view_type: 'Upper Body',
    // Waist-up streetwear top clearly shown
    thumbnail_url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=550&fit=crop&crop=top',
  },
  {
    id: 'f-regular-upper-casual-1',
    name: 'Jordan',
    gender: 'female',
    body_type: 'Regular',
    style: 'Casual',
    age_group: 'Young Adult',
    view_type: 'Upper Body',
    // Torso clearly showing casual top
    thumbnail_url: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400&h=550&fit=crop&crop=top',
  },
  {
    id: 'f-regular-upper-fashion-1',
    name: 'Nina',
    gender: 'female',
    body_type: 'Regular',
    style: 'Fashion',
    age_group: 'Adult',
    view_type: 'Upper Body',
    // Torso fashion top clearly visible
    thumbnail_url: 'https://images.unsplash.com/photo-1542295669297-4d352b042bca?w=400&h=550&fit=crop&crop=top',
  },
  {
    id: 'f-plus-upper-casual-1',
    name: 'Rosa',
    gender: 'female',
    body_type: 'Plus Size',
    style: 'Casual',
    age_group: 'Adult',
    view_type: 'Upper Body',
    // Plus size upper body, top clearly visible
    thumbnail_url: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=400&h=550&fit=crop&crop=top',
  },

  // ── LOWER BODY ────────────────────────────────────────────────────────────

  {
    id: 'f-slim-lower-casual-1',
    name: 'Mia',
    gender: 'female',
    body_type: 'Slim',
    style: 'Casual',
    age_group: 'Young Adult',
    view_type: 'Lower Body',
    // Hip-to-floor, pants/legs clearly visible
    thumbnail_url: 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=400&h=550&fit=crop&crop=bottom',
  },
  {
    id: 'f-regular-lower-casual-1',
    name: 'Nadia',
    gender: 'female',
    body_type: 'Regular',
    style: 'Casual',
    age_group: 'Adult',
    view_type: 'Lower Body',
    // Hip-to-floor, jeans/skirt visible
    thumbnail_url: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=400&h=550&fit=crop&crop=bottom',
  },

];

export const MALE_MODELS = [

  // ── FULL BODY ─────────────────────────────────────────────────────────────

  {
    id: 'm-slim-full-casual-1',
    name: 'Liam',
    gender: 'male',
    body_type: 'Slim',
    style: 'Casual',
    age_group: 'Young Adult',
    view_type: 'Full Body',
    // Full body, casual outfit head to toe
    thumbnail_url: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400&h=600&fit=crop&crop=center',
  },
  {
    id: 'm-slim-full-street-1',
    name: 'Kai',
    gender: 'male',
    body_type: 'Slim',
    style: 'Streetwear',
    age_group: 'Young Adult',
    view_type: 'Full Body',
    // Full body streetwear, complete outfit visible
    thumbnail_url: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=600&fit=crop&crop=center',
  },
  {
    id: 'm-slim-full-fashion-1',
    name: 'James',
    gender: 'male',
    body_type: 'Slim',
    style: 'Fashion',
    age_group: 'Adult',
    view_type: 'Full Body',
    // Full body fashion shot, suit/outfit fully visible
    thumbnail_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=600&fit=crop&crop=center',
  },
  {
    id: 'm-regular-full-casual-1',
    name: 'Cole',
    gender: 'male',
    body_type: 'Regular',
    style: 'Casual',
    age_group: 'Adult',
    view_type: 'Full Body',
    // Full body casual, entire outfit shown
    thumbnail_url: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=400&h=600&fit=crop&crop=center',
  },
  {
    id: 'm-regular-full-street-1',
    name: 'Darius',
    gender: 'male',
    body_type: 'Regular',
    style: 'Streetwear',
    age_group: 'Young Adult',
    view_type: 'Full Body',
    // Full body streetwear outfit clearly visible
    thumbnail_url: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=400&h=600&fit=crop&crop=center',
  },
  {
    id: 'm-athletic-full-1',
    name: 'Alex',
    gender: 'male',
    body_type: 'Athletic',
    style: 'Athletic',
    age_group: 'Young Adult',
    view_type: 'Full Body',
    // Full body athletic build, sportswear visible
    thumbnail_url: 'https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?w=400&h=600&fit=crop&crop=center',
  },
  {
    id: 'm-plus-full-casual-1',
    name: 'Omar',
    gender: 'male',
    body_type: 'Plus Size',
    style: 'Casual',
    age_group: 'Adult',
    view_type: 'Full Body',
    // Full body plus size, casual outfit clearly shown
    thumbnail_url: 'https://images.unsplash.com/photo-1604072366595-e75dc92d6bdc?w=400&h=600&fit=crop&crop=center',
  },
  {
    id: 'm-mature-full-casual-1',
    name: 'Devon',
    gender: 'male',
    body_type: 'Regular',
    style: 'Mature',
    age_group: 'Mature',
    view_type: 'Full Body',
    // Full body mature man, full outfit visible
    thumbnail_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=600&fit=crop&crop=center',
  },

  // ── UPPER BODY ────────────────────────────────────────────────────────────

  {
    id: 'm-slim-upper-casual-1',
    name: 'Noah',
    gender: 'male',
    body_type: 'Slim',
    style: 'Casual',
    age_group: 'Young Adult',
    view_type: 'Upper Body',
    // Waist-up, casual shirt/top clearly visible
    thumbnail_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=550&fit=crop&crop=top',
  },
  {
    id: 'm-slim-upper-street-1',
    name: 'Zion',
    gender: 'male',
    body_type: 'Slim',
    style: 'Streetwear',
    age_group: 'Young Adult',
    view_type: 'Upper Body',
    // Waist-up streetwear top clearly shown
    thumbnail_url: 'https://images.unsplash.com/photo-1530268729831-4b0b9e170218?w=400&h=550&fit=crop&crop=top',
  },
  {
    id: 'm-regular-upper-casual-1',
    name: 'Evan',
    gender: 'male',
    body_type: 'Regular',
    style: 'Casual',
    age_group: 'Adult',
    view_type: 'Upper Body',
    // Torso clearly showing casual top
    thumbnail_url: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=550&fit=crop&crop=top',
  },
  {
    id: 'm-regular-upper-street-1',
    name: 'Reuben',
    gender: 'male',
    body_type: 'Regular',
    style: 'Streetwear',
    age_group: 'Young Adult',
    view_type: 'Upper Body',
    // Torso streetwear hoodie/jacket clearly visible
    thumbnail_url: 'https://images.unsplash.com/photo-1583468982228-19f19164aee2?w=400&h=550&fit=crop&crop=top',
  },
  {
    id: 'm-athletic-upper-1',
    name: 'Caden',
    gender: 'male',
    body_type: 'Athletic',
    style: 'Athletic',
    age_group: 'Young Adult',
    view_type: 'Upper Body',
    // Torso athletic shirt clearly visible
    thumbnail_url: 'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?w=400&h=550&fit=crop&crop=top',
  },
  {
    id: 'm-plus-upper-casual-1',
    name: 'Bruno',
    gender: 'male',
    body_type: 'Plus Size',
    style: 'Casual',
    age_group: 'Adult',
    view_type: 'Upper Body',
    // Torso plus size, casual top clearly visible
    thumbnail_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=550&fit=crop&crop=top',
  },

  // ── LOWER BODY ────────────────────────────────────────────────────────────

  {
    id: 'm-slim-lower-casual-1',
    name: 'Ethan',
    gender: 'male',
    body_type: 'Slim',
    style: 'Casual',
    age_group: 'Young Adult',
    view_type: 'Lower Body',
    // Hip-to-floor, pants/shoes clearly visible
    thumbnail_url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=550&fit=crop&crop=bottom',
  },
  {
    id: 'm-regular-lower-casual-1',
    name: 'Caleb',
    gender: 'male',
    body_type: 'Regular',
    style: 'Casual',
    age_group: 'Adult',
    view_type: 'Lower Body',
    // Hip-to-floor, jeans/pants clearly visible
    thumbnail_url: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=400&h=550&fit=crop&crop=bottom',
  },
  {
    id: 'm-regular-lower-street-1',
    name: 'Jason',
    gender: 'male',
    body_type: 'Regular',
    style: 'Streetwear',
    age_group: 'Young Adult',
    view_type: 'Lower Body',
    // Hip-to-floor streetwear pants visible
    thumbnail_url: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=550&fit=crop&crop=bottom',
  },
  {
    id: 'm-athletic-lower-1',
    name: 'Finn',
    gender: 'male',
    body_type: 'Athletic',
    style: 'Athletic',
    age_group: 'Young Adult',
    view_type: 'Lower Body',
    // Hip-to-floor athletic shorts/pants visible
    thumbnail_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=550&fit=crop&crop=bottom',
  },
];

// Smart garment → model suggestion
export function getSuggestedModelId(garmentType, gender = 'female') {
  const map = {
    hoodie:     gender === 'male' ? 'm-regular-upper-street-1' : 'f-regular-upper-casual-1',
    tshirt:     gender === 'male' ? 'm-slim-upper-casual-1'    : 'f-slim-upper-casual-1',
    jacket:     gender === 'male' ? 'm-regular-full-casual-1'  : 'f-regular-full-casual-1',
    dress:      'f-regular-full-fashion-1',
    pants:      gender === 'male' ? 'm-regular-lower-casual-1' : 'f-regular-lower-casual-1',
    activewear: gender === 'male' ? 'm-athletic-lower-1'       : 'f-slim-lower-casual-1',
  };
  return map[garmentType] || (gender === 'male' ? 'm-regular-full-casual-1' : 'f-regular-full-casual-1');
}