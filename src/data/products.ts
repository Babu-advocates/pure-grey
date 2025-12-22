import featuredImage from "@/assets/featured-products.jpg";

export interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  image: string;
  description: string;
  unit?: string;
}

export interface Category {
  id: string;
  name: string;
}

export const categories: Category[] = [
  { id: "all", name: "All Products" },
  { id: "ground-chakkars", name: "Ground Chakkars" },
  { id: "flower-pots", name: "Flower Pots" },
  { id: "fountains", name: "Fountains" },
  { id: "candles", name: "Candles & Pencils" },
  { id: "twinkling-stars", name: "Twinkling Stars" },
  { id: "bombs", name: "Bombs" },
  { id: "rockets", name: "Rockets" },
  { id: "single-shot", name: "Single Shot Crackers" },
  { id: "electric-crackers", name: "Electric Crackers" },
  { id: "deluxe-crackers", name: "Deluxe Crackers" },
  { id: "giant-crackers", name: "Giant Crackers" },
  { id: "fancy", name: "Fancy Items" },
  { id: "aerial-items", name: "Aerial Items" },
  { id: "penta", name: "Penta" },
  { id: "mini-series", name: "Mini Series" },
  { id: "multiple-aerial", name: "Multiple Aerial" },
  { id: "fancy-novelties", name: "Fancy Novelties" },
  { id: "single-sound", name: "Single Sound" },
  { id: "fancy-shots", name: "Fancy Shots" },
  { id: "mega-shots", name: "Mega Multi Colour Shots" },
  { id: "special-items", name: "Special Items" },
  { id: "gift-boxes", name: "Gift Boxes" },
  { id: "novelty-items", name: "Novelty Items" },
  { id: "sparklers-cm", name: "Sparklers (cm sizes)" },
];

export const products: Product[] = [
  // Ground Chakkars (1-7)
  { id: 1, name: "Ground Chakkar Big (25 Pcs)", price: "₹172", category: "ground-chakkars", image: featuredImage, description: "Premium quality ground chakkar - Pack of 25", unit: "Box" },
  { id: 2, name: "Ground Chakkar Big (10 Pcs)", price: "₹77", category: "ground-chakkars", image: featuredImage, description: "Premium quality ground chakkar - Pack of 10", unit: "Box" },
  { id: 3, name: "Ground Chakkar Special", price: "₹156", category: "ground-chakkars", image: featuredImage, description: "Special ground chakkar with vibrant colors", unit: "Box" },
  { id: 4, name: "Ground Chakkar Deluxe", price: "₹305", category: "ground-chakkars", image: featuredImage, description: "Deluxe ground chakkar for grand celebrations", unit: "Box" },
  { id: 5, name: "Dancing Chakkar", price: "₹397", category: "ground-chakkars", image: featuredImage, description: "Mesmerizing dancing chakkar display", unit: "Box" },
  { id: 6, name: "Lotus Wheel", price: "₹332", category: "ground-chakkars", image: featuredImage, description: "Beautiful lotus wheel spinning display", unit: "Box" },
  { id: 7, name: "Eye Wheel", price: "₹200", category: "ground-chakkars", image: featuredImage, description: "Captivating eye wheel effect", unit: "Box" },

  // Flower Pots (8-18)
  { id: 8, name: "Flower Pots Small", price: "₹113", category: "flower-pots", image: featuredImage, description: "Small size flower pots for beautiful displays", unit: "Box" },
  { id: 9, name: "Flower Pots Big", price: "₹177", category: "flower-pots", image: featuredImage, description: "Big size flower pots with stunning effects", unit: "Box" },
  { id: 10, name: "Flower Pots Special", price: "₹211", category: "flower-pots", image: featuredImage, description: "Special flower pots with vibrant colors", unit: "Box" },
  { id: 11, name: "Flower Pots Asoka", price: "₹331", category: "flower-pots", image: featuredImage, description: "Premium Asoka flower pots", unit: "Box" },
  { id: 12, name: "Flower Pots Deluxe (5 Pcs)", price: "₹626", category: "flower-pots", image: featuredImage, description: "Deluxe flower pots - Pack of 5", unit: "Box" },
  { id: 13, name: "Flower Pots Super Deluxe (2 Pcs)", price: "₹511", category: "flower-pots", image: featuredImage, description: "Super deluxe flower pots - Pack of 2", unit: "Box" },
  { id: 14, name: "Colour Koti", price: "₹571", category: "flower-pots", image: featuredImage, description: "Multicolor koti display", unit: "Box" },
  { id: 15, name: "Green Pots (5 Pcs)", price: "₹626", category: "flower-pots", image: featuredImage, description: "Green colored flower pots - Pack of 5", unit: "Box" },
  { id: 16, name: "Red Pots (5 Pcs)", price: "₹626", category: "flower-pots", image: featuredImage, description: "Red colored flower pots - Pack of 5", unit: "Box" },
  { id: 17, name: "Red & Green Pots (5 Pcs)", price: "₹626", category: "flower-pots", image: featuredImage, description: "Red & green combination - Pack of 5", unit: "Box" },
  { id: 18, name: "Multi Colour Pots (5 Pcs)", price: "₹626", category: "flower-pots", image: featuredImage, description: "Multi color flower pots - Pack of 5", unit: "Box" },

  // Fountains (19-21)
  { id: 19, name: "Giltring Koti (5 Pcs)", price: "₹490", category: "fountains", image: featuredImage, description: "Glittering fountain koti - Pack of 5", unit: "Box" },
  { id: 20, name: "Siron (2 Pcs)", price: "₹665", category: "fountains", image: featuredImage, description: "Premium siron fountain - Pack of 2", unit: "Box" },
  { id: 21, name: "Ganga Jamuna", price: "₹324", category: "fountains", image: featuredImage, description: "Classic Ganga Jamuna fountain", unit: "Box" },

  // Candles (22-25)
  { id: 22, name: '7" Pencil', price: "₹80", category: "candles", image: featuredImage, description: "7 inch pencil sparklers", unit: "Box" },
  { id: 23, name: '10" Magic Pencil', price: "₹152", category: "candles", image: featuredImage, description: "10 inch magic pencil sparklers", unit: "Box" },
  { id: 24, name: '12" Pencil', price: "₹192", category: "candles", image: featuredImage, description: "12 inch pencil sparklers", unit: "Box" },
  { id: 25, name: "Fancy Pencil (2 Pcs)", price: "₹526", category: "candles", image: featuredImage, description: "Fancy pencil sparklers - Pack of 2", unit: "Box" },

  // Twinkling Stars (26-28)
  { id: 26, name: '1½" Twinkling Star', price: "₹84", category: "twinkling-stars", image: featuredImage, description: "1.5 inch twinkling star sparklers", unit: "Box" },
  { id: 27, name: '4" Twinkling Star', price: "₹170", category: "twinkling-stars", image: featuredImage, description: "4 inch twinkling star sparklers", unit: "Box" },
  { id: 28, name: "Jil Jil", price: "₹55", category: "twinkling-stars", image: featuredImage, description: "Popular jil jil sparklers", unit: "Box" },

  // Bombs (29-38)
  { id: 29, name: "Cit Put", price: "₹66", category: "bombs", image: featuredImage, description: "Cit put crackers", unit: "Box" },
  { id: 30, name: "Bomb Bullet", price: "₹114", category: "bombs", image: featuredImage, description: "Bullet bomb crackers", unit: "Box" },
  { id: 31, name: "Atom Bomb Big", price: "₹114", category: "bombs", image: featuredImage, description: "Big atom bomb crackers", unit: "Box" },
  { id: 32, name: "Hydro Bomb (Green)", price: "₹138", category: "bombs", image: featuredImage, description: "Green hydro bomb", unit: "Box" },
  { id: 33, name: "Hydro Bomb (Foils)", price: "₹145", category: "bombs", image: featuredImage, description: "Foil wrapped hydro bomb", unit: "Box" },
  { id: 34, name: "King of King (Green)", price: "₹211", category: "bombs", image: featuredImage, description: "King of King green variant", unit: "Box" },
  { id: 35, name: "King of King (Foils)", price: "₹233", category: "bombs", image: featuredImage, description: "King of King foil variant", unit: "Box" },
  { id: 36, name: "Classic Bomb (Green)", price: "₹239", category: "bombs", image: featuredImage, description: "Classic bomb green variant", unit: "Box" },
  { id: 37, name: "Classic Bomb (Foils)", price: "₹265", category: "bombs", image: featuredImage, description: "Classic bomb foil variant", unit: "Box" },
  { id: 38, name: "7 Ply Bomb", price: "₹336", category: "bombs", image: featuredImage, description: "Premium 7 ply bomb", unit: "Box" },

  // Rockets (39-45)
  { id: 39, name: "Baby Rocket", price: "₹80", category: "rockets", image: featuredImage, description: "Small baby rockets", unit: "Box" },
  { id: 40, name: "Color Rocket", price: "₹130", category: "rockets", image: featuredImage, description: "Colorful rockets display", unit: "Box" },
  { id: 41, name: "Rocket Bomb", price: "₹136", category: "rockets", image: featuredImage, description: "Rocket with bomb effect", unit: "Box" },
  { id: 42, name: "Lunik Express", price: "₹296", category: "rockets", image: featuredImage, description: "High-flying lunik express", unit: "Box" },
  { id: 43, name: "2 Sound Rocket", price: "₹312", category: "rockets", image: featuredImage, description: "Rocket with 2 sound effects", unit: "Box" },
  { id: 44, name: "3 Sound Rocket", price: "₹322", category: "rockets", image: featuredImage, description: "Rocket with 3 sound effects", unit: "Box" },
  { id: 45, name: "Whistling Rocket", price: "₹325", category: "rockets", image: featuredImage, description: "Whistling effect rocket", unit: "Box" },

  // Single Shot Crackers (46-52)
  { id: 46, name: '2" Laxmi', price: "₹26", category: "single-shot", image: featuredImage, description: "2 inch laxmi crackers", unit: "Pkt" },
  { id: 47, name: '2¾" Kuriv 5 x 1000', price: "₹26", category: "single-shot", image: featuredImage, description: "Kuriv crackers pack", unit: "Pkt" },
  { id: 48, name: '4" Laxmi / Parrot 5 x 500', price: "₹48", category: "single-shot", image: featuredImage, description: "4 inch laxmi/parrot crackers", unit: "Pkt" },
  { id: 49, name: "Two Sound 5 x 500", price: "₹64", category: "single-shot", image: featuredImage, description: "Two sound crackers pack", unit: "Pkt" },
  { id: 50, name: "Three Sound", price: "₹66", category: "single-shot", image: featuredImage, description: "Three sound crackers", unit: "Pkt" },
  { id: 51, name: '4" Gold Laxmi', price: "₹64", category: "single-shot", image: featuredImage, description: "4 inch gold laxmi crackers", unit: "Pkt" },
  { id: 52, name: '4" Giant Laxmi', price: "₹77", category: "single-shot", image: featuredImage, description: "4 inch giant laxmi crackers", unit: "Pkt" },

  // Electric Crackers (53)
  { id: 53, name: "28 Chorsa / Taj / Turky", price: "₹36", category: "electric-crackers", image: featuredImage, description: "Electric crackers combo", unit: "Pkt" },

  // Deluxe Super Crackers (54-57)
  { id: 54, name: "24 x 250 Tiger", price: "₹108", category: "deluxe-crackers", image: featuredImage, description: "Tiger deluxe crackers", unit: "Pkt" },
  { id: 55, name: "28 x 250 Taj / Tiger", price: "₹116", category: "deluxe-crackers", image: featuredImage, description: "Taj/Tiger deluxe crackers", unit: "Pkt" },
  { id: 56, name: "50 Deluxe", price: "₹101", category: "deluxe-crackers", image: featuredImage, description: "50 deluxe crackers pack", unit: "Pkt" },
  { id: 57, name: "100 Deluxe", price: "₹448", category: "deluxe-crackers", image: featuredImage, description: "100 deluxe crackers pack", unit: "Pkt" },

  // Giant Super Crackers (58-66)
  { id: 58, name: "28 x 1000 Giant Taj", price: "₹52", category: "giant-crackers", image: featuredImage, description: "Giant taj crackers", unit: "Pkt" },
  { id: 59, name: "56 x 500 Giant Taj", price: "₹108", category: "giant-crackers", image: featuredImage, description: "Giant taj crackers pack", unit: "Pkt" },
  { id: 60, name: "100 x 200 Super Taj", price: "₹186", category: "giant-crackers", image: featuredImage, description: "Super taj crackers pack", unit: "Pkt" },
  { id: 61, name: "100 x 400 Giant Taj", price: "₹336", category: "giant-crackers", image: featuredImage, description: "Giant taj mega pack", unit: "Pkt" },
  { id: 62, name: "120 x 200 Grand Taj", price: "₹211", category: "giant-crackers", image: featuredImage, description: "Grand taj crackers", unit: "Pkt" },
  { id: 63, name: "180 x 200 Grand Taj", price: "₹300", category: "giant-crackers", image: featuredImage, description: "Grand taj mega pack", unit: "Pkt" },
  { id: 64, name: "1000 Wala Red", price: "₹34", category: "giant-crackers", image: featuredImage, description: "1000 wala red crackers", unit: "Pkt" },
  { id: 65, name: "2000 Wala Red", price: "₹68", category: "giant-crackers", image: featuredImage, description: "2000 wala red crackers", unit: "Pkt" },
  { id: 66, name: "5000 Wala Red", price: "₹170", category: "giant-crackers", image: featuredImage, description: "5000 wala red crackers", unit: "Pkt" },

  // Fancy Items (67-94)
  { id: 67, name: "Chota Fancy", price: "₹89", category: "fancy", image: featuredImage, description: "Small fancy crackers", unit: "Piece" },
  { id: 68, name: "4 CM Fancy", price: "₹94", category: "fancy", image: featuredImage, description: "4 cm fancy crackers", unit: "Piece" },
  { id: 69, name: "Little Stars", price: "₹106", category: "fancy", image: featuredImage, description: "Little stars display", unit: "Piece" },
  { id: 70, name: "Colour Koti Ground", price: "₹113", category: "fancy", image: featuredImage, description: "Color koti ground display", unit: "Piece" },
  { id: 71, name: "Butter Fly", price: "₹127", category: "fancy", image: featuredImage, description: "Butterfly effect fancy", unit: "Piece" },
  { id: 72, name: "Shower Shower (Rain)", price: "₹134", category: "fancy", image: featuredImage, description: "Rain shower effect", unit: "Piece" },
  { id: 73, name: "Photo Flash (Green)", price: "₹148", category: "fancy", image: featuredImage, description: "Green photo flash", unit: "Piece" },
  { id: 74, name: "Photo Flash (Silver)", price: "₹162", category: "fancy", image: featuredImage, description: "Silver photo flash", unit: "Piece" },
  { id: 75, name: "Photo Flash (Colour)", price: "₹177", category: "fancy", image: featuredImage, description: "Multi color photo flash", unit: "Piece" },
  { id: 76, name: "Photo Flash D/D (Silver)", price: "₹305", category: "fancy", image: featuredImage, description: "Double deluxe silver flash", unit: "Piece" },
  { id: 77, name: "Photo Flash D/D (Colour)", price: "₹336", category: "fancy", image: featuredImage, description: "Double deluxe color flash", unit: "Piece" },
  { id: 78, name: "Colour Paper (Hand)", price: "₹170", category: "fancy", image: featuredImage, description: "Hand held color paper", unit: "Piece" },
  { id: 79, name: "Colour Paper (Ground)", price: "₹192", category: "fancy", image: featuredImage, description: "Ground color paper", unit: "Piece" },
  { id: 80, name: "China Tola", price: "₹200", category: "fancy", image: featuredImage, description: "China tola crackers", unit: "Piece" },
  { id: 81, name: "Wonder Light", price: "₹215", category: "fancy", image: featuredImage, description: "Wonder light display", unit: "Piece" },
  { id: 82, name: "Colour Sound (Hand)", price: "₹218", category: "fancy", image: featuredImage, description: "Hand color sound", unit: "Piece" },
  { id: 83, name: "Wonder Light Big", price: "₹232", category: "fancy", image: featuredImage, description: "Big wonder light", unit: "Piece" },
  { id: 84, name: "Tango & Jango", price: "₹244", category: "fancy", image: featuredImage, description: "Tango & jango combo", unit: "Piece" },
  { id: 85, name: "Peacock Blue", price: "₹253", category: "fancy", image: featuredImage, description: "Blue peacock display", unit: "Piece" },
  { id: 86, name: "Jango Unchained", price: "₹265", category: "fancy", image: featuredImage, description: "Jango unchained effect", unit: "Piece" },
  { id: 87, name: "Green Anaconda", price: "₹277", category: "fancy", image: featuredImage, description: "Green anaconda display", unit: "Piece" },
  { id: 88, name: "Disco Blue", price: "₹290", category: "fancy", image: featuredImage, description: "Disco blue effect", unit: "Piece" },
  { id: 89, name: "Tom Cat", price: "₹290", category: "fancy", image: featuredImage, description: "Tom cat crackers", unit: "Piece" },
  { id: 90, name: "Delux Anaconda", price: "₹305", category: "fancy", image: featuredImage, description: "Deluxe anaconda", unit: "Piece" },
  { id: 91, name: "Lava", price: "₹312", category: "fancy", image: featuredImage, description: "Lava effect display", unit: "Piece" },
  { id: 92, name: "Jetix Green", price: "₹322", category: "fancy", image: featuredImage, description: "Green jetix", unit: "Piece" },
  { id: 93, name: "Jolly Jolly Multi Colour", price: "₹402", category: "fancy", image: featuredImage, description: "Multi color jolly display", unit: "Piece" },
  { id: 94, name: "Striking force", price: "₹425", category: "fancy", image: featuredImage, description: "Striking force crackers", unit: "Piece" },

  // Penta (95-96)
  { id: 95, name: "Penta (5 Pcs)", price: "₹275", category: "penta", image: featuredImage, description: "Penta pack of 5", unit: "Box" },
  { id: 96, name: "Penta (10 Pcs)", price: "₹512", category: "penta", image: featuredImage, description: "Penta pack of 10", unit: "Box" },

  // New Fancy Arrival (97-102)
  { id: 97, name: "Wonder (Green)", price: "₹249", category: "fancy", image: featuredImage, description: "Green wonder display", unit: "Box" },
  { id: 98, name: "Wonder (Red)", price: "₹249", category: "fancy", image: featuredImage, description: "Red wonder display", unit: "Box" },
  { id: 99, name: "Wonder (Silver)", price: "₹249", category: "fancy", image: featuredImage, description: "Silver wonder display", unit: "Box" },
  { id: 100, name: "Wonder (Colour)", price: "₹249", category: "fancy", image: featuredImage, description: "Multi color wonder", unit: "Box" },
  { id: 101, name: "Partys Papers (Hand)", price: "₹461", category: "fancy", image: featuredImage, description: "Party papers hand held", unit: "Box" },
  { id: 102, name: "Joot (Ground)", price: "₹483", category: "fancy", image: featuredImage, description: "Joot ground display", unit: "Box" },

  // Mini Series (103-111)
  { id: 103, name: "Romeo (3 Pcs)", price: "₹391", category: "mini-series", image: featuredImage, description: "Romeo mini series - 3 pcs", unit: "Box" },
  { id: 104, name: "Juliet (3 Pcs)", price: "₹391", category: "mini-series", image: featuredImage, description: "Juliet mini series - 3 pcs", unit: "Box" },
  { id: 105, name: "Colour Collection (5 Pcs)", price: "₹655", category: "mini-series", image: featuredImage, description: "Color collection - 5 pcs", unit: "Box" },
  { id: 106, name: "Alexander (Boom with Golden Colour)", price: "₹141", category: "mini-series", image: featuredImage, description: "Alexander golden boom", unit: "Box" },
  { id: 107, name: "Power Rangers (Boom with Yellow Colour)", price: "₹141", category: "mini-series", image: featuredImage, description: "Power Rangers yellow boom", unit: "Box" },
  { id: 108, name: "Robo (Boom with Silver Colour)", price: "₹141", category: "mini-series", image: featuredImage, description: "Robo silver boom", unit: "Box" },
  { id: 109, name: "Sagana (Boom with Green Colour)", price: "₹141", category: "mini-series", image: featuredImage, description: "Sagana green boom", unit: "Box" },
  { id: 110, name: "Jetli (Boom with Red Colour)", price: "₹141", category: "mini-series", image: featuredImage, description: "Jetli red boom", unit: "Box" },
  { id: 111, name: "Pogo (Boom with Red & Green Colour)", price: "₹141", category: "mini-series", image: featuredImage, description: "Pogo red & green boom", unit: "Box" },

  // Multiple Aerial (112-161)
  { id: 112, name: "Australian Delight", price: "₹531", category: "multiple-aerial", image: featuredImage, description: "Australian delight aerial - 3 pcs", unit: "Box" },
  { id: 113, name: "Indian Delight", price: "₹531", category: "multiple-aerial", image: featuredImage, description: "Indian delight aerial - 3 pcs", unit: "Box" },
  { id: 114, name: "African Delight", price: "₹531", category: "multiple-aerial", image: featuredImage, description: "African delight aerial - 3 pcs", unit: "Box" },
  { id: 115, name: "European Delight", price: "₹531", category: "multiple-aerial", image: featuredImage, description: "European delight aerial - 3 pcs", unit: "Box" },
  { id: 116, name: "Italian Delight", price: "₹531", category: "multiple-aerial", image: featuredImage, description: "Italian delight aerial - 3 pcs", unit: "Box" },
  { id: 117, name: "Platina", price: "₹531", category: "multiple-aerial", image: featuredImage, description: "Platina aerial display", unit: "Box" },
  { id: 118, name: "American Delight", price: "₹531", category: "multiple-aerial", image: featuredImage, description: "American delight aerial - 3 pcs", unit: "Box" },
  { id: 119, name: "Multiple Aerial Star Bomb", price: "₹531", category: "multiple-aerial", image: featuredImage, description: "Aerial star bomb", unit: "Box" },
  { id: 120, name: "Asian Delight", price: "₹531", category: "multiple-aerial", image: featuredImage, description: "Asian delight aerial - 3 pcs", unit: "Box" },
  { id: 121, name: "Chinese", price: "₹531", category: "multiple-aerial", image: featuredImage, description: "Chinese aerial display", unit: "Box" },
  { id: 122, name: "Crazy Crozy (Boom with Green Colour)", price: "₹531", category: "multiple-aerial", image: featuredImage, description: "Crazy crozy green crackling", unit: "Box" },
  { id: 123, name: "Rosy Rosy (Boom with Red Colour)", price: "₹531", category: "multiple-aerial", image: featuredImage, description: "Rosy rosy red crackling", unit: "Box" },
  { id: 124, name: "Darzen (Boom with Red & Green Colour)", price: "₹531", category: "multiple-aerial", image: featuredImage, description: "Darzen red & green crackling", unit: "Box" },
  { id: 125, name: "Rozzle Dozzle (Boom with Yellow Colour)", price: "₹531", category: "multiple-aerial", image: featuredImage, description: "Rozzle dozzle yellow crackling", unit: "Box" },
  { id: 126, name: "Cow Boys (Boom with Yellow Tail)", price: "₹531", category: "multiple-aerial", image: featuredImage, description: "Cow boys yellow tail", unit: "Box" },
  { id: 127, name: "Leena (Boom with Silver Colour)", price: "₹531", category: "multiple-aerial", image: featuredImage, description: "Leena silver crackling", unit: "Box" },
  { id: 128, name: "Magic Pots (Golden)", price: "₹633", category: "multiple-aerial", image: featuredImage, description: "Golden magic pots", unit: "Box" },
  { id: 129, name: "Magic Pots (Silver)", price: "₹656", category: "multiple-aerial", image: featuredImage, description: "Silver magic pots", unit: "Box" },
  { id: 130, name: "Magic Pots (Green)", price: "₹633", category: "multiple-aerial", image: featuredImage, description: "Green magic pots", unit: "Box" },
  { id: 131, name: "Magic Pots (Red)", price: "₹633", category: "multiple-aerial", image: featuredImage, description: "Red magic pots", unit: "Box" },
  { id: 132, name: "Super Fun (Golden)", price: "₹655", category: "multiple-aerial", image: featuredImage, description: "Golden super fun", unit: "Box" },
  { id: 133, name: "Super Fun (Silver)", price: "₹677", category: "multiple-aerial", image: featuredImage, description: "Silver super fun", unit: "Box" },
  { id: 134, name: "Super Fun (Green)", price: "₹655", category: "multiple-aerial", image: featuredImage, description: "Green super fun", unit: "Box" },
  { id: 135, name: "Super Fun (Red)", price: "₹655", category: "multiple-aerial", image: featuredImage, description: "Red super fun", unit: "Box" },
  { id: 136, name: "Colour Trails (Golden)", price: "₹677", category: "multiple-aerial", image: featuredImage, description: "Golden color trails", unit: "Box" },
  { id: 137, name: "Colour Trails (Silver)", price: "₹700", category: "multiple-aerial", image: featuredImage, description: "Silver color trails", unit: "Box" },
  { id: 138, name: "Colour Trails (Green)", price: "₹677", category: "multiple-aerial", image: featuredImage, description: "Green color trails", unit: "Box" },
  { id: 139, name: "Colour Trails (Red)", price: "₹677", category: "multiple-aerial", image: featuredImage, description: "Red color trails", unit: "Box" },
  { id: 140, name: "Colour Rain (Green)", price: "₹714", category: "multiple-aerial", image: featuredImage, description: "Green color rain", unit: "Box" },
  { id: 141, name: "Colour Rain (Silver)", price: "₹736", category: "multiple-aerial", image: featuredImage, description: "Silver color rain", unit: "Box" },
  { id: 142, name: "Colour Rain (Golden)", price: "₹714", category: "multiple-aerial", image: featuredImage, description: "Golden color rain", unit: "Box" },
  { id: 143, name: "Colour Rain (Red)", price: "₹714", category: "multiple-aerial", image: featuredImage, description: "Red color rain", unit: "Box" },
  { id: 144, name: "Jaguar (Green)", price: "₹714", category: "multiple-aerial", image: featuredImage, description: "Green jaguar aerial", unit: "Box" },
  { id: 145, name: "Jaguar (Silver)", price: "₹736", category: "multiple-aerial", image: featuredImage, description: "Silver jaguar aerial", unit: "Box" },
  { id: 146, name: "Jaguar (Golden)", price: "₹714", category: "multiple-aerial", image: featuredImage, description: "Golden jaguar aerial", unit: "Box" },
  { id: 147, name: "Jaguar (Red)", price: "₹714", category: "multiple-aerial", image: featuredImage, description: "Red jaguar aerial", unit: "Box" },
  { id: 148, name: "Mega Lena (Green)", price: "₹759", category: "multiple-aerial", image: featuredImage, description: "Green mega lena", unit: "Box" },
  { id: 149, name: "Mega Lena (Silver)", price: "₹781", category: "multiple-aerial", image: featuredImage, description: "Silver mega lena", unit: "Box" },
  { id: 150, name: "Mega Lena (Golden)", price: "₹759", category: "multiple-aerial", image: featuredImage, description: "Golden mega lena", unit: "Box" },
  { id: 151, name: "Mega Lena (Red)", price: "₹759", category: "multiple-aerial", image: featuredImage, description: "Red mega lena", unit: "Box" },
  { id: 152, name: "Colour Rain (Red & Green)", price: "₹737", category: "multiple-aerial", image: featuredImage, description: "Red & green color rain", unit: "Box" },
  { id: 153, name: "Colour Rain (MultiColour)", price: "₹760", category: "multiple-aerial", image: featuredImage, description: "Multi color rain", unit: "Box" },
  { id: 154, name: "Magic Pots (Red & Green)", price: "₹656", category: "multiple-aerial", image: featuredImage, description: "Red & green magic pots", unit: "Box" },
  { id: 155, name: "Magic Pots (MultiColour)", price: "₹678", category: "multiple-aerial", image: featuredImage, description: "Multi color magic pots", unit: "Box" },
  { id: 156, name: "Super Fun (Red & Green)", price: "₹677", category: "multiple-aerial", image: featuredImage, description: "Red & green super fun", unit: "Box" },
  { id: 157, name: "Super Fun (MultiColour)", price: "₹700", category: "multiple-aerial", image: featuredImage, description: "Multi color super fun", unit: "Box" },
  { id: 158, name: "Jaguar (Red & Green)", price: "₹737", category: "multiple-aerial", image: featuredImage, description: "Red & green jaguar", unit: "Box" },
  { id: 159, name: "Jaguar (MultiColour)", price: "₹760", category: "multiple-aerial", image: featuredImage, description: "Multi color jaguar", unit: "Box" },
  { id: 160, name: "Mega Lena (Red & Green)", price: "₹782", category: "multiple-aerial", image: featuredImage, description: "Red & green mega lena", unit: "Box" },
  { id: 161, name: "Mega Lena (MultiColour)", price: "₹804", category: "multiple-aerial", image: featuredImage, description: "Multi color mega lena", unit: "Box" },

  // Fancy Shots (162-165)
  { id: 162, name: "12 Shots (Rock Rain) (Red & Green)", price: "₹211", category: "fancy-shots", image: featuredImage, description: "12 shots rock rain", unit: "Piece" },
  { id: 163, name: "25 Shots (Holimela) (Red & Green)", price: "₹345", category: "fancy-shots", image: featuredImage, description: "25 shots holimela", unit: "Piece" },
  { id: 164, name: "25 Shots (Carnival) (Red & Green)", price: "₹370", category: "fancy-shots", image: featuredImage, description: "25 shots carnival", unit: "Piece" },
  { id: 165, name: "50 Shots (Multi Colour Shots)", price: "₹666", category: "fancy-shots", image: featuredImage, description: "50 multi color shots", unit: "Piece" },

  // Mega Multi Colour Shots (166-173)
  { id: 166, name: "Holiday Special (15 Shots)", price: "₹200", category: "mega-shots", image: featuredImage, description: "15 shots holiday special", unit: "Piece" },
  { id: 167, name: "Sunday (30 Shots)", price: "₹400", category: "mega-shots", image: featuredImage, description: "30 shots sunday special", unit: "Piece" },
  { id: 168, name: "Sunday Special (30 Shots)", price: "₹450", category: "mega-shots", image: featuredImage, description: "30 shots sunday deluxe", unit: "Piece" },
  { id: 169, name: "Lovers Day (60 Shots)", price: "₹800", category: "mega-shots", image: featuredImage, description: "60 shots lovers day", unit: "Piece" },
  { id: 170, name: "Every Day (60 Shots)", price: "₹850", category: "mega-shots", image: featuredImage, description: "60 shots everyday celebration", unit: "Piece" },
  { id: 171, name: "Freedom (100 Shots)", price: "₹1330", category: "mega-shots", image: featuredImage, description: "100 shots freedom", unit: "Piece" },
  { id: 172, name: "Republic Day (120 Shots)", price: "₹1600", category: "mega-shots", image: featuredImage, description: "120 shots republic day", unit: "Piece" },
  { id: 173, name: "Independence Day (240 Shots)", price: "₹3200", category: "mega-shots", image: featuredImage, description: "240 shots independence day", unit: "Piece" },

  // Special Items (174-187)
  { id: 174, name: "Festival", price: "₹8000", category: "special-items", image: featuredImage, description: "Festival mega pack", unit: "Piece" },
  { id: 175, name: "Legend", price: "₹13420", category: "special-items", image: featuredImage, description: "Legend premium pack", unit: "Piece" },
  { id: 176, name: "Mass (80 Shots)", price: "₹1066", category: "special-items", image: featuredImage, description: "80 shots mass display", unit: "Piece" },
  { id: 177, name: "Power Play (100 Shots)", price: "₹1333", category: "special-items", image: featuredImage, description: "100 shots power play", unit: "Piece" },
  { id: 178, name: "High Speed Raider (100 Shots)", price: "₹1700", category: "special-items", image: featuredImage, description: "100 shots high speed raider", unit: "Piece" },
  { id: 179, name: "Paradise (160 Shots)", price: "₹2130", category: "special-items", image: featuredImage, description: "160 shots paradise", unit: "Piece" },
  { id: 180, name: 'Bollywood Queen Hollywood Queen (1¼" Pipe) (30 Pcs)', price: "₹2747", category: "special-items", image: featuredImage, description: "Bollywood/Hollywood queen pipes", unit: "Box" },
  { id: 181, name: 'Euro (2" Pipe-30 Pcs)', price: "₹5421", category: "special-items", image: featuredImage, description: "Euro 2 inch pipes - 30 pcs", unit: "Box" },
  { id: 182, name: '21 Century (3" Pipe 30 Pcs)', price: "₹13149", category: "special-items", image: featuredImage, description: "21 century 3 inch pipes - 30 pcs", unit: "Box" },
  { id: 183, name: "1000 Lar", price: "₹250", category: "special-items", image: featuredImage, description: "1000 lar crackers", unit: "Piece" },
  { id: 184, name: "2000 Lar", price: "₹500", category: "special-items", image: featuredImage, description: "2000 lar crackers", unit: "Piece" },
  { id: 185, name: "3000 Lar", price: "₹750", category: "special-items", image: featuredImage, description: "3000 lar crackers", unit: "Piece" },
  { id: 186, name: "5000 Lar", price: "₹1250", category: "special-items", image: featuredImage, description: "5000 lar crackers", unit: "Piece" },
  { id: 187, name: "10000 Lar", price: "₹2500", category: "special-items", image: featuredImage, description: "10000 lar crackers", unit: "Piece" },

  // Gift Boxes (188-194)
  { id: 188, name: "Gift Box (18 Items)", price: "₹250", category: "gift-boxes", image: featuredImage, description: "Gift box with 18 items", unit: "Box" },
  { id: 189, name: "Vinayaga (21 Items)", price: "₹300", category: "gift-boxes", image: featuredImage, description: "Vinayaga gift box - 21 items", unit: "Box" },
  { id: 190, name: "Ben 10 (26 Items)", price: "₹420", category: "gift-boxes", image: featuredImage, description: "Ben 10 gift box - 26 items", unit: "Box" },
  { id: 191, name: "Chotta Bheem (31 Items)", price: "₹530", category: "gift-boxes", image: featuredImage, description: "Chotta Bheem gift box - 31 items", unit: "Box" },
  { id: 192, name: "Family Pack (36 Items)", price: "₹680", category: "gift-boxes", image: featuredImage, description: "Family pack - 36 items", unit: "Box" },
  { id: 193, name: "Jackpot (41 Items)", price: "₹800", category: "gift-boxes", image: featuredImage, description: "Jackpot gift box - 41 items", unit: "Box" },
  { id: 194, name: "Andal (46 Items)", price: "₹1400", category: "gift-boxes", image: featuredImage, description: "Andal premium box - 46 items", unit: "Box" },

  // Novelty Items (195-201)
  { id: 195, name: "Colour Smoke", price: "₹150", category: "novelty-items", image: featuredImage, description: "Color smoke display", unit: "Box" },
  { id: 196, name: 'Adiyal ¼"', price: "₹60", category: "novelty-items", image: featuredImage, description: "Adiyal quarter inch", unit: "Box" },
  { id: 197, name: 'Adiyal ½"', price: "₹120", category: "novelty-items", image: featuredImage, description: "Adiyal half inch", unit: "Box" },
  { id: 198, name: "Drone", price: "₹150", category: "novelty-items", image: featuredImage, description: "Drone flying crackers", unit: "Box" },
  { id: 199, name: "Water Falls", price: "₹100", category: "novelty-items", image: featuredImage, description: "Waterfall effect", unit: "Box" },
  { id: 200, name: "Peacock", price: "₹120", category: "novelty-items", image: featuredImage, description: "Peacock display", unit: "Box" },
  { id: 201, name: "Selfiestick", price: "₹150", category: "novelty-items", image: featuredImage, description: "Selfie stick crackers", unit: "Box" },

  // Sparklers (cm sizes) (202-230)
  { id: 202, name: "7 cm Electric Sparklers", price: "₹18", category: "sparklers-cm", image: featuredImage, description: "7 cm electric sparklers", unit: "Box" },
  { id: 203, name: "7 cm Glittering Sparklers", price: "₹19", category: "sparklers-cm", image: featuredImage, description: "7 cm glittering sparklers", unit: "Box" },
  { id: 204, name: "7 cm Green Sparklers", price: "₹20", category: "sparklers-cm", image: featuredImage, description: "7 cm green sparklers", unit: "Box" },
  { id: 205, name: "7 cm Red Sparklers", price: "₹21", category: "sparklers-cm", image: featuredImage, description: "7 cm red sparklers", unit: "Box" },
  { id: 206, name: "7 cm Silver Sparklers", price: "₹24", category: "sparklers-cm", image: featuredImage, description: "7 cm silver sparklers", unit: "Box" },
  { id: 207, name: "10 cm Electric Sparklers", price: "₹20", category: "sparklers-cm", image: featuredImage, description: "10 cm electric sparklers", unit: "Box" },
  { id: 208, name: "10 cm Glittering Sparklers", price: "₹21", category: "sparklers-cm", image: featuredImage, description: "10 cm glittering sparklers", unit: "Box" },
  { id: 209, name: "10 cm Green Sparklers", price: "₹23", category: "sparklers-cm", image: featuredImage, description: "10 cm green sparklers", unit: "Box" },
  { id: 210, name: "10 cm Red Sparklers", price: "₹24", category: "sparklers-cm", image: featuredImage, description: "10 cm red sparklers", unit: "Box" },
  { id: 211, name: "10 cm Silver Sparklers", price: "₹26", category: "sparklers-cm", image: featuredImage, description: "10 cm silver sparklers", unit: "Box" },
  { id: 212, name: "12 cm Electric Sparklers", price: "₹30", category: "sparklers-cm", image: featuredImage, description: "12 cm electric sparklers", unit: "Box" },
  { id: 213, name: "12 cm Glittering Sparklers", price: "₹32", category: "sparklers-cm", image: featuredImage, description: "12 cm glittering sparklers", unit: "Box" },
  { id: 214, name: "12 cm Green Sparklers", price: "₹33", category: "sparklers-cm", image: featuredImage, description: "12 cm green sparklers", unit: "Box" },
  { id: 215, name: "12 cm Red Sparklers", price: "₹34", category: "sparklers-cm", image: featuredImage, description: "12 cm red sparklers", unit: "Box" },
  { id: 216, name: "12 cm Silver Sparklers", price: "₹38", category: "sparklers-cm", image: featuredImage, description: "12 cm silver sparklers", unit: "Box" },
  { id: 217, name: "15 cm Electric Sparklers", price: "₹43", category: "sparklers-cm", image: featuredImage, description: "15 cm electric sparklers", unit: "Box" },
  { id: 218, name: "15 cm Glittering Sparklers", price: "₹46", category: "sparklers-cm", image: featuredImage, description: "15 cm glittering sparklers", unit: "Box" },
  { id: 219, name: "15 cm Green Sparklers", price: "₹47", category: "sparklers-cm", image: featuredImage, description: "15 cm green sparklers", unit: "Box" },
  { id: 220, name: "15 cm Red Sparklers", price: "₹49", category: "sparklers-cm", image: featuredImage, description: "15 cm red sparklers", unit: "Box" },
  { id: 221, name: "15 cm Silver Sparklers", price: "₹50", category: "sparklers-cm", image: featuredImage, description: "15 cm silver sparklers", unit: "Box" },
  { id: 222, name: "30 cm Electric Sparklers", price: "₹43", category: "sparklers-cm", image: featuredImage, description: "30 cm electric sparklers", unit: "Box" },
  { id: 223, name: "30 cm Glittering Sparklers", price: "₹45", category: "sparklers-cm", image: featuredImage, description: "30 cm glittering sparklers", unit: "Box" },
  { id: 224, name: "30 cm Green Sparklers", price: "₹46", category: "sparklers-cm", image: featuredImage, description: "30 cm green sparklers", unit: "Box" },
  { id: 225, name: "30 cm Red Sparklers", price: "₹49", category: "sparklers-cm", image: featuredImage, description: "30 cm red sparklers", unit: "Box" },
  { id: 226, name: "30 cm Silver Sparklers", price: "₹50", category: "sparklers-cm", image: featuredImage, description: "30 cm silver sparklers", unit: "Box" },
  { id: 227, name: "50 cm Electric Sparklers", price: "₹230", category: "sparklers-cm", image: featuredImage, description: "50 cm electric sparklers", unit: "Box" },
  { id: 228, name: "50 cm Glittering Sparklers", price: "₹252", category: "sparklers-cm", image: featuredImage, description: "50 cm glittering sparklers", unit: "Box" },
  { id: 229, name: "Roll Cap", price: "₹201", category: "novelty-items", image: featuredImage, description: "Roll cap crackers", unit: "Box" },
  { id: 230, name: "S. Table", price: "₹336", category: "novelty-items", image: featuredImage, description: "S table crackers", unit: "Box" },
];
