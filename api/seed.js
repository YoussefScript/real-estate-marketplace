import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/user.model.js";
import Listing from "./models/listing.model.js";

dotenv.config();

const demoUserEmail = "demo@primeestate.com";
const demoPassword = "demo1234";

const placeholderImages = [
  "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
];

const sampleListings = [
  {
    name: "Skyline Loft",
    description:
      "Bright open-plan loft with panoramic city views, premium finishes, and warm natural light.",
    address: "245 Harbor View, Miami, FL",
    regularPrice: 580000,
    discountPrice: 535000,
    bathrooms: 2,
    bedrooms: 3,
    furnished: true,
    parking: true,
    type: "sale",
    offer: true,
    contactInfo:
      "Call or WhatsApp: +1 (305) 555-0148\nEmail: skyline.loft@primeestate.com\nBest time to reach: Weekdays after 5 PM",
    imageUrls: [
      placeholderImages[0],
      placeholderImages[1],
      placeholderImages[2],
    ],
  },
  {
    name: "Cedar Grove Villa",
    description:
      "Spacious family home with landscaped yard, open kitchen, and quiet residential setting.",
    address: "88 Cedar Lane, Austin, TX",
    regularPrice: 760000,
    discountPrice: 725000,
    bathrooms: 3,
    bedrooms: 4,
    furnished: false,
    parking: true,
    type: "sale",
    offer: true,
    contactInfo:
      "Email: cedar.grove@primeestate.com\nPhone: +1 (512) 555-0191\nPlease message before 8 PM for viewings",
    imageUrls: [
      placeholderImages[3],
      placeholderImages[4],
      placeholderImages[5],
    ],
  },
  {
    name: "Lakeside Apartment",
    description:
      "Modern apartment near the lakefront with minimalist decor and excellent natural light.",
    address: "17 Lakepoint Blvd, Seattle, WA",
    regularPrice: 3200,
    discountPrice: 2900,
    bathrooms: 2,
    bedrooms: 2,
    furnished: true,
    parking: true,
    type: "rent",
    offer: true,
    contactInfo:
      "Text: +1 (206) 555-0134\nEmail: lakeside.apartment@primeestate.com\nAvailable for immediate move-in",
    imageUrls: [
      placeholderImages[6],
      placeholderImages[7],
      placeholderImages[8],
    ],
  },
  {
    name: "Maple Terrace House",
    description:
      "Elegant home with a large patio, contemporary styling, and a calm family-friendly layout.",
    address: "41 Maple Terrace, Denver, CO",
    regularPrice: 640000,
    discountPrice: 640000,
    bathrooms: 3,
    bedrooms: 4,
    furnished: false,
    parking: true,
    type: "sale",
    offer: false,
    contactInfo:
      "Contact the owner at +1 (303) 555-0169\nEmail: maple.terrace@primeestate.com\nOpen house every Saturday morning",
    imageUrls: [
      placeholderImages[0],
      placeholderImages[4],
      placeholderImages[6],
    ],
  },
  {
    name: "Downtown Studio Plus",
    description:
      "Chic studio apartment with city access, high ceilings, and premium fixtures throughout.",
    address: "101 Market Street, New York, NY",
    regularPrice: 2600,
    discountPrice: 2400,
    bathrooms: 1,
    bedrooms: 1,
    furnished: true,
    parking: false,
    type: "rent",
    offer: true,
    contactInfo:
      "Email: downtown.studio@primeestate.com\nPhone: +1 (212) 555-0173\nText preferred for quick replies",
    imageUrls: [
      placeholderImages[1],
      placeholderImages[7],
      placeholderImages[9],
    ],
  },
  {
    name: "Sunset Heights Residence",
    description:
      "A refined residence offering sunset views, an airy layout, and premium finishes.",
    address: "11 Sunset Hills, Los Angeles, CA",
    regularPrice: 890000,
    discountPrice: 840000,
    bathrooms: 3,
    bedrooms: 5,
    furnished: true,
    parking: true,
    type: "sale",
    offer: true,
    imageUrls: [
      placeholderImages[2],
      placeholderImages[5],
      placeholderImages[8],
    ],
  },
  {
    name: "Oak & Pine Townhome",
    description:
      "Townhome with a chef's kitchen, natural wood tones, and a private balcony for relaxing.",
    address: "90 Oak Avenue, Portland, OR",
    regularPrice: 3100,
    discountPrice: 3100,
    bathrooms: 2,
    bedrooms: 3,
    furnished: false,
    parking: true,
    type: "rent",
    offer: false,
    imageUrls: [
      placeholderImages[3],
      placeholderImages[6],
      placeholderImages[9],
    ],
  },
  {
    name: "Willow Creek Manor",
    description:
      "Luxury property with generous living spaces, outdoor entertaining areas, and modern comforts.",
    address: "33 Willow Creek Road, Phoenix, AZ",
    regularPrice: 820000,
    discountPrice: 780000,
    bathrooms: 4,
    bedrooms: 5,
    furnished: false,
    parking: true,
    type: "sale",
    offer: true,
    imageUrls: [
      placeholderImages[0],
      placeholderImages[5],
      placeholderImages[7],
    ],
  },
  {
    name: "Garden Courtyard Flat",
    description:
      "A cozy courtyard apartment with greenery, quiet interiors, and efficient modern finishes.",
    address: "12 Garden Walk, Charlotte, NC",
    regularPrice: 2200,
    discountPrice: 2050,
    bathrooms: 1,
    bedrooms: 2,
    furnished: true,
    parking: false,
    type: "rent",
    offer: true,
    imageUrls: [
      placeholderImages[1],
      placeholderImages[4],
      placeholderImages[8],
    ],
  },
  {
    name: "Bayside Modern",
    description:
      "Contemporary beachfront home with open terraces, high-end finishes, and a serene setting.",
    address: "5 Bayview Drive, San Diego, CA",
    regularPrice: 980000,
    discountPrice: 940000,
    bathrooms: 3,
    bedrooms: 4,
    furnished: true,
    parking: true,
    type: "sale",
    offer: true,
    imageUrls: [
      placeholderImages[2],
      placeholderImages[6],
      placeholderImages[9],
    ],
  },
  {
    name: "Northline Condo",
    description:
      "Well-designed condo in a lively neighborhood with sleek interiors and city convenience.",
    address: "88 Northline Avenue, Chicago, IL",
    regularPrice: 2800,
    discountPrice: 2600,
    bathrooms: 2,
    bedrooms: 2,
    furnished: true,
    parking: true,
    type: "rent",
    offer: true,
    imageUrls: [
      placeholderImages[3],
      placeholderImages[5],
      placeholderImages[8],
    ],
  },
  {
    name: "Stonebridge House",
    description:
      "Classic family residence with clean lines, generous square footage, and flexible spaces.",
    address: "201 Stonebridge Ave, Nashville, TN",
    regularPrice: 670000,
    discountPrice: 670000,
    bathrooms: 3,
    bedrooms: 4,
    furnished: false,
    parking: true,
    type: "sale",
    offer: false,
    imageUrls: [
      placeholderImages[0],
      placeholderImages[7],
      placeholderImages[9],
    ],
  },
  {
    name: "Elm View Apartments",
    description:
      "A stylish rental with granite surfaces, airy rooms, and excellent access to transit and dining.",
    address: "77 Elm Street, Boston, MA",
    regularPrice: 3000,
    discountPrice: 2750,
    bathrooms: 2,
    bedrooms: 2,
    furnished: true,
    parking: false,
    type: "rent",
    offer: true,
    imageUrls: [
      placeholderImages[1],
      placeholderImages[6],
      placeholderImages[8],
    ],
  },
  {
    name: "Horizon Penthouse",
    description:
      "A luxe penthouse with wraparound light, premium views, and premium interior detailing.",
    address: "19 Horizon Tower, Las Vegas, NV",
    regularPrice: 1150000,
    discountPrice: 1090000,
    bathrooms: 3,
    bedrooms: 4,
    furnished: true,
    parking: true,
    type: "sale",
    offer: true,
    imageUrls: [
      placeholderImages[2],
      placeholderImages[4],
      placeholderImages[7],
    ],
  },
  {
    name: "Rosewood Cottage",
    description:
      "Warm and inviting cottage with a private garden and natural textures throughout.",
    address: "46 Rosewood Lane, Savannah, GA",
    regularPrice: 480000,
    discountPrice: 480000,
    bathrooms: 2,
    bedrooms: 3,
    furnished: false,
    parking: true,
    type: "sale",
    offer: false,
    imageUrls: [
      placeholderImages[3],
      placeholderImages[5],
      placeholderImages[9],
    ],
  },
  {
    name: "Terrace on 8th",
    description:
      "Modern residence with a rooftop terrace, open living areas, and thoughtful design details.",
    address: "8 Terrace Road, Dallas, TX",
    regularPrice: 3400,
    discountPrice: 3150,
    bathrooms: 2,
    bedrooms: 3,
    furnished: true,
    parking: true,
    type: "rent",
    offer: true,
    imageUrls: [
      placeholderImages[0],
      placeholderImages[8],
      placeholderImages[9],
    ],
  },
  {
    name: "Summit Ridge Estate",
    description:
      "Elegant hillside estate with green views, abundant light, and refined family spaces.",
    address: "120 Summit Ridge, Boise, ID",
    regularPrice: 910000,
    discountPrice: 860000,
    bathrooms: 4,
    bedrooms: 5,
    furnished: false,
    parking: true,
    type: "sale",
    offer: true,
    imageUrls: [
      placeholderImages[1],
      placeholderImages[5],
      placeholderImages[7],
    ],
  },
  {
    name: "Marlow Residences",
    description:
      "Charming rental residence with landscaped grounds and a relaxed, welcoming atmosphere.",
    address: "14 Marlow Court, Richmond, VA",
    regularPrice: 2500,
    discountPrice: 2380,
    bathrooms: 2,
    bedrooms: 2,
    furnished: true,
    parking: true,
    type: "rent",
    offer: true,
    imageUrls: [
      placeholderImages[2],
      placeholderImages[6],
      placeholderImages[8],
    ],
  },
  {
    name: "Crescent Heights Home",
    description:
      "Contemporary home with an elegant entrance, generous proportions, and high-end functionality.",
    address: "65 Crescent Heights, Orlando, FL",
    regularPrice: 610000,
    discountPrice: 610000,
    bathrooms: 3,
    bedrooms: 4,
    furnished: false,
    parking: true,
    type: "sale",
    offer: false,
    imageUrls: [
      placeholderImages[3],
      placeholderImages[4],
      placeholderImages[6],
    ],
  },
  {
    name: "Harbor Lights Duplex",
    description:
      "A bright duplex with a coastal feel, outdoor lounge area, and flexible living spaces.",
    address: "22 Harbor Lights Way, Tampa, FL",
    regularPrice: 2900,
    discountPrice: 2700,
    bathrooms: 2,
    bedrooms: 3,
    furnished: true,
    parking: true,
    type: "rent",
    offer: true,
    imageUrls: [
      placeholderImages[0],
      placeholderImages[5],
      placeholderImages[9],
    ],
  },
  {
    name: "Granite Point Villa",
    description:
      "Lush villa with warm stone textures, a large pool area, and elegant indoor-outdoor living.",
    address: "99 Granite Point, Scottsdale, AZ",
    regularPrice: 1200000,
    discountPrice: 1140000,
    bathrooms: 4,
    bedrooms: 6,
    furnished: true,
    parking: true,
    type: "sale",
    offer: true,
    imageUrls: [
      placeholderImages[1],
      placeholderImages[7],
      placeholderImages[8],
    ],
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");

    let demoUser = await User.findOne({ email: demoUserEmail });

    if (!demoUser) {
      const hashedPassword = await bcrypt.hash(demoPassword, 10);
      demoUser = await User.create({
        username: "primeestate_demo",
        email: demoUserEmail,
        password: hashedPassword,
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80",
      });
      console.log("Created demo user");
    }

    await Listing.deleteMany({ userRef: demoUser._id.toString() });
    const listingsToInsert = sampleListings.map((listing, index) => ({
      ...listing,
      contactInfo:
        listing.contactInfo ||
        `Call or WhatsApp: +1 (555) ${String(100 + index).padStart(3, "0")}-${String(2000 + index).slice(-4)}\nEmail: owner${index + 1}@primeestate.com\nBest time to contact: ${index % 2 === 0 ? "Evenings" : "Weekends"}`,
      userRef: demoUser._id.toString(),
    }));

    await Listing.insertMany(listingsToInsert);

    console.log(
      `Seeded ${listingsToInsert.length} listings for screenshot/demo use.`,
    );
    console.log(`Demo login: ${demoUserEmail} / ${demoPassword}`);
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }
};

seedDatabase();
