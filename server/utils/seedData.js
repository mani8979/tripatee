import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load models
import User from '../models/User.js';
import Destination from '../models/Destination.js';
import Package from '../models/Package.js';
import Review from '../models/Review.js';
import Blog from '../models/Blog.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import Newsletter from '../models/Newsletter.js';
import Contact from '../models/Contact.js';

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tripatee');
    console.log('Seed: Connected to Database...');

    // Clear all existing data
    await User.deleteMany();
    await Destination.deleteMany();
    await Package.deleteMany();
    await Review.deleteMany();
    await Blog.deleteMany();
    await Booking.deleteMany();
    await Payment.deleteMany();
    await Newsletter.deleteMany();
    await Contact.deleteMany();
    console.log('Seed: Cleared old collections...');

    // 1. Create Users
    const admin = await User.create({
      name: 'Admin Tripatee',
      email: 'admin@tripatee.com',
      password: 'password123',
      role: 'admin',
      isVerified: true,
    });

    const client = await User.create({
      name: 'John Doe',
      email: 'user@tripatee.com',
      password: 'password123',
      role: 'user',
      isVerified: true,
    });

    console.log('Seed: Created Admin and Standard User...');

    // 2. Create Destinations
    const destinations = await Destination.insertMany([
      {
        name: 'Paris',
        country: 'France',
        description: 'The city of light, culinary arts, fashion, and romance. Paris hosts world-renowned landmarks like the Eiffel Tower and Louvre Museum.',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop',
        bannerImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1600&auto=format&fit=crop',
        popular: true,
      },
      {
        name: 'Tokyo',
        country: 'Japan',
        description: 'A neon-lit metropolis blending ancient temples, ultramodern architecture, historic gardens, and Michelin-starred culinary sushi experiences.',
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=800&auto=format&fit=crop',
        bannerImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1600&auto=format&fit=crop',
        popular: true,
      },
      {
        name: 'Maldives',
        country: 'Maldives',
        description: 'A tropical paradise of pristine white-sand beaches, overwater luxury villas, and crystal-clear turquoise waters rich in coral reefs.',
        image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&auto=format&fit=crop',
        bannerImage: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1600&auto=format&fit=crop',
        popular: true,
      },
      {
        name: 'Swiss Alps',
        country: 'Switzerland',
        description: 'Breathtaking snow-capped peaks, dramatic green valleys, pristine mountain lakes, and luxury Alpine ski chalet resorts.',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop',
        bannerImage: 'https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?w=1600&auto=format&fit=crop',
        popular: true,
      },
      {
        name: 'Machu Picchu',
        country: 'Peru',
        description: 'An ancient Incan citadel high in the Andes mountains, offering mysterious stone structures and breathtaking cloud forest views.',
        image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&auto=format&fit=crop',
        bannerImage: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1600&auto=format&fit=crop',
        popular: false,
      },
      {
        name: 'United States',
        country: 'USA',
        description: 'From the glittering lights of Times Square in New York to the breathtaking depths of the Grand Canyon, the USA offers a journey of iconic experiences.',
        image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format&fit=crop',
        bannerImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop',
        popular: true,
      },
      {
        name: 'Australia',
        country: 'Australia',
        description: 'Explore the iconic Sydney Opera House, dive into the colorful marine life of the Great Barrier Reef, and wander through ancient tropical rainforests.',
        image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&auto=format&fit=crop',
        bannerImage: 'https://images.unsplash.com/photo-1523482596112-99d81b109867?w=1600&auto=format&fit=crop',
        popular: true,
      },
      {
        name: 'India',
        country: 'India',
        description: 'Immerse yourself in a vibrant kaleidoscope of heritage, from the majestic Taj Mahal in Agra to the royal desert palaces of Rajasthan.',
        image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop',
        bannerImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600&auto=format&fit=crop',
        popular: true,
      },
    ]);

    console.log('Seed: Created Destinations...');

    const parisId = destinations[0]._id;
    const tokyoId = destinations[1]._id;
    const maldivesId = destinations[2]._id;
    const swissId = destinations[3]._id;
    const peruId = destinations[4]._id;
    const usaId = destinations[5]._id;
    const ausId = destinations[6]._id;
    const indId = destinations[7]._id;

    // 3. Create Packages
    const packages = await Package.insertMany([
      {
        title: 'Romantic Parisian Escape',
        destination: parisId,
        description: 'Experience the magic of Paris. Walk along the Seine, climb the Eiffel Tower, dine in fine-dining bistros, and wander through artistic Montmartre.',
        price: 1899,
        duration: '5 Days / 4 Nights',
        maxGroupSize: 12,
        featured: true,
        inclusions: ['4-star hotel stay', 'Daily gourmet breakfast', 'Eiffel Tower skip-the-line ticket', 'Seine River cruise', 'Louvre Museum guided tour'],
        exclusions: ['International flights', 'Dinner & drinks', 'Personal travel insurance'],
        availableDates: [
          new Date('2026-07-15'),
          new Date('2026-08-10'),
          new Date('2026-09-05'),
        ],
        gallery: [
          'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1503152394-c571994fd383?w=800&auto=format&fit=crop',
        ],
        itinerary: [
          {
            day: 1,
            title: 'Arrival in Paris',
            description: 'Arrive at Charles de Gaulle Airport, transfer to your luxury hotel, and enjoy a romantic welcome dinner.',
          },
          {
            day: 2,
            title: 'Louvre & Eiffel Tower',
            description: 'Guided tour of Louvre masterpieces followed by Eiffel Tower ascent at sunset for stunning panorama views.',
          },
          {
            day: 3,
            title: 'Artistic Montmartre & Seine Cruise',
            description: 'Explore painter stalls at Place du Tertre, visit Sacré-Cœur, and board a dinner cruise down the Seine.',
          },
          {
            day: 4,
            title: 'Versailles Palace Excursion',
            description: 'Half-day tour of the historic Royal Palace of Versailles, wandering the majestic Hall of Mirrors and grand gardens.',
          },
          {
            day: 5,
            title: 'Farewell Paris',
            description: 'Enjoy free time for shopping on the Champs-Élysées before transferring to the airport for departure.',
          },
        ],
      },
      {
        title: 'Neon & Temples of Tokyo',
        destination: tokyoId,
        description: 'Immerse yourself in Japan. Tour ancient shrines in Asakusa, shop in futuristic Akihabara, and dine in hidden Izakayas.',
        price: 2499,
        duration: '7 Days / 6 Nights',
        maxGroupSize: 15,
        featured: true,
        inclusions: ['Premium city hotel lodging', 'Local tour guide', 'All temple entry fees', 'Shinkansen Bullet train experience', 'Sushi-making masterclass'],
        exclusions: ['Lunch meals', 'Flights', 'Tips & gratuities'],
        availableDates: [
          new Date('2026-10-12'),
          new Date('2026-11-04'),
          new Date('2026-12-20'),
        ],
        gallery: [
          'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop',
        ],
        itinerary: [
          {
            day: 1,
            title: 'Welcome to Tokyo',
            description: 'Arrive in Tokyo. Check in to your hotel in Shinjuku and enjoy a neon-lit night city walk.',
          },
          {
            day: 2,
            title: 'Asakusa & Meiji Shrine',
            description: 'Experience history. Visit Tokyo’s oldest temple Senso-ji, then walk through the serene forest of Meiji Shrine.',
          },
          {
            day: 3,
            title: 'Shibuya Crossing & Harajuku',
            description: 'Cross the famous Shibuya crossing, tour quirky Takeshita Street, and enjoy coffee in a designer cat cafe.',
          },
          {
            day: 4,
            title: 'Mount Fuji Day Trip',
            description: 'Travel to Lake Kawaguchiko to capture stunning panoramic vistas of snow-capped Mt. Fuji.',
          },
          {
            day: 5,
            title: 'Akihabara Tech & Sushi Class',
            description: 'Explore gadget towers, participate in a professional sushi-making masterclass, and dine on fresh sashimi.',
          },
          {
            day: 6,
            title: 'TeamLab Borderless Digital Art',
            description: 'Spend the day interacting with digital art installations at Odaiba’s teamLab museum.',
          },
          {
            day: 7,
            title: 'Sayonara Tokyo',
            description: 'Transfer to Narita/Haneda airport for your return flight home.',
          },
        ],
      },
      {
        title: 'Maldives Overwater Luxury Retreat',
        destination: maldivesId,
        description: 'Escape to a secluded water villa. Swim in turquoise lagoons, indulge in overwater spa treatments, and dine under the stars.',
        price: 3499,
        duration: '6 Days / 5 Nights',
        maxGroupSize: 8,
        featured: true,
        inclusions: ['5-star overwater villa accommodation', 'All-inclusive meals and premium drinks', 'Speedboat transfers', 'Snorkeling equipment', 'Couples massage'],
        exclusions: ['Scenic seaplane upgrades', 'Motorized water sports', 'Diving certifications'],
        availableDates: [
          new Date('2026-08-01'),
          new Date('2026-09-18'),
          new Date('2026-11-10'),
        ],
        gallery: [
          'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop',
        ],
        itinerary: [
          {
            day: 1,
            title: 'Island Arrival',
            description: 'Transfer via private speedboat to your luxury resort, check into your overwater villa, and watch the ocean sunset.',
          },
          {
            day: 2,
            title: 'Reef Snorkeling & Sea Turtles',
            description: 'Morning guided snorkeling safari swimming alongside reef sharks, sea turtles, and colorful manta rays.',
          },
          {
            day: 3,
            title: 'Luxury Wellness Spa Day',
            description: 'A relaxing day at the overwater spa, featuring a signature full-body treatment and aromatherapy session.',
          },
          {
            day: 4,
            title: 'Private Sandbank Picnic',
            description: 'Spend the afternoon on a completely deserted sandbank with a private chef serving seafood barbecue.',
          },
          {
            day: 5,
            title: 'Sunset Dolphin Cruise',
            description: 'Board a traditional Dhoni boat for champagne and dolphin spotting as the sun goes down.',
          },
          {
            day: 6,
            title: 'Departure',
            description: 'Checkout from your water villa and take a speedboat back to Malé International Airport.',
          },
        ],
      },
      {
        title: 'Swiss Alpine Winter Wonderland',
        destination: swissId,
        description: 'Experience winter luxury in Zermatt. Ski the world-famous slopes under the Matterhorn, ride scenic trains, and enjoy fondue.',
        price: 2999,
        duration: '6 Days / 5 Nights',
        maxGroupSize: 10,
        featured: false,
        inclusions: ['Luxury Alpine chalet stay', 'Daily breakfast & three fondue dinners', 'Zermatt ski pass', 'Glacier Express train journey', 'Heated pool spa access'],
        exclusions: ['Ski gear rentals', 'Flights to Zurich', 'Lunch meals'],
        availableDates: [
          new Date('2026-12-15'),
          new Date('2026-01-20'),
          new Date('2026-02-10'),
        ],
        gallery: [
          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=800&auto=format&fit=crop',
        ],
        itinerary: [
          {
            day: 1,
            title: 'Arrival in Zermatt',
            description: 'Take the train from Zurich to car-free Zermatt. Settle into your mountain chalet.',
          },
          {
            day: 2,
            title: 'Skiing & Matterhorn Vistas',
            description: 'Spend the day on Zermatt’s world-class slopes, enjoying unobstructed views of the majestic Matterhorn.',
          },
          {
            day: 3,
            title: 'Glacier Express Panoramic Ride',
            description: 'Board the historic Glacier Express train through snowy gorges and alpine bridges.',
          },
          {
            day: 4,
            title: 'Gornergrat Cogwheel Train',
            description: 'Ride Europe’s highest open-air cogwheel railway up to 3,089 meters for incredible glacier panoramas.',
          },
          {
            day: 5,
            title: 'Traditional Cheese Fondue & Spa',
            description: 'Soak in outdoor thermal pools, followed by a cozy dinner of traditional hot Swiss cheese fondue.',
          },
          {
            day: 6,
            title: 'Zurich Return',
            description: 'Scenic train ride back to Zurich airport for your flight home.',
          },
        ],
      },
      {
        title: 'Classic Inca Trail to Machu Picchu',
        destination: peruId,
        description: 'Trek the legendary Inca Trail. Climb through beautiful cloud forests, view remote ruins, and watch the sunrise over Machu Picchu.',
        price: 1599,
        duration: '5 Days / 4 Nights',
        maxGroupSize: 14,
        featured: false,
        inclusions: ['Boutique hotel in Cusco', 'Inca Trail trekking permits', 'Professional mountain guides and porters', 'Camping gear & meals during trek', 'Vistadome return train'],
        exclusions: ['Sleeping bag rentals', 'Flights to Lima/Cusco', 'Personal tips'],
        availableDates: [
          new Date('2026-06-25'),
          new Date('2026-07-28'),
          new Date('2026-08-15'),
        ],
        gallery: [
          'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1509024644558-2f56ce76c490?w=800&auto=format&fit=crop',
        ],
        itinerary: [
          {
            day: 1,
            title: 'Acclimatization in Cusco',
            description: 'Arrive in Cusco (3,400m). Enjoy a gentle walking tour of the historic Plaza de Armas and rest.',
          },
          {
            day: 2,
            title: 'Sacred Valley Exploration',
            description: 'Tour Pisac ruins and Ollantaytambo fortress, learning about ancient Incan astronomical architecture.',
          },
          {
            day: 3,
            title: 'Inca Trail Trek Commences',
            description: 'Begin trekking at KM 82. Hike along the Urubamba River, ending at the campsite of Wayllabamba.',
          },
          {
            day: 4,
            title: 'Dead Woman’s Pass to Wiñay Wayna',
            description: 'Ascend the steep path through Dead Woman’s Pass (4,215m) before descending into luxury cloud forests.',
          },
          {
            day: 5,
            title: 'Machu Picchu Sun Gate Sunrise',
            description: 'A pre-dawn hike to Inti Punku (Sun Gate) for your first panoramic glimpse of Machu Picchu at sunrise. Return train to Cusco.',
          },
        ],
      },
      {
        title: 'American Grandeur: NYC & The Grand Canyon',
        destination: usaId,
        description: 'Experience the best of both worlds in America. Walk through Central Park, watch a Broadway show, then fly to Las Vegas and helicopter over the stunning Grand Canyon.',
        price: 2799,
        duration: '8 Days / 7 Nights',
        maxGroupSize: 12,
        featured: true,
        inclusions: ['4-star Manhattan hotel stay', 'Grand Canyon helicopter tour', 'Daily breakfast & select dinners', 'Broadway show ticket', 'Internal flight NYC to Las Vegas'],
        exclusions: ['International flights', 'Personal purchases', 'Visa fees'],
        availableDates: [
          new Date('2026-07-20'),
          new Date('2026-08-15'),
          new Date('2026-09-10'),
        ],
        gallery: [
          'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1522083165195-3427e0297db4?w=800&auto=format&fit=crop',
        ],
        itinerary: [
          {
            day: 1,
            title: 'Arrival in New York City',
            description: 'Arrive at JFK/Newark Airport. Private transfer to your luxury hotel in Times Square. Enjoy a welcome dinner.',
          },
          {
            day: 2,
            title: 'Manhattan & Broadway',
            description: 'Guided tour of Central Park, Fifth Avenue, and Empire State Building. Tonight, experience a premier Broadway show.',
          },
          {
            day: 3,
            title: 'Statue of Liberty & Soho',
            description: 'Ferry to the Statue of Liberty and Ellis Island. Afternoon exploring Soho and Greenwich Village boutiques.',
          },
          {
            day: 4,
            title: 'Fly to Las Vegas',
            description: 'Morning flight to Las Vegas. Check into your luxury resort on the Strip and experience a night tour.',
          },
          {
            day: 5,
            title: 'Grand Canyon Helicopter Tour',
            description: 'Fly in style over the Hoover Dam and land deep inside the Grand Canyon for a Champagne toast.',
          },
          {
            day: 6,
            title: 'Death Valley or Valley of Fire',
            description: 'Choose between a day excursion to Death Valley National Park or hiking in the Valley of Fire.',
          },
          {
            day: 7,
            title: 'Leisure Day in Las Vegas',
            description: 'Relax at the resort pool, shop at luxury forums, or try your luck at the casinos.',
          },
          {
            day: 8,
            title: 'Departure',
            description: 'Transfer to Las Vegas McCarran Airport for your flight home.',
          },
        ],
      },
      {
        title: 'Ultimate Australian Discovery',
        destination: ausId,
        description: 'Explore Australia’s gems: the iconic Sydney Opera House, Bondi Beach, and the breathtaking Great Barrier Reef, alongside the Daintree Rainforest.',
        price: 3199,
        duration: '9 Days / 8 Nights',
        maxGroupSize: 10,
        featured: true,
        inclusions: ['Boutique hotel accommodation', 'Great Barrier Reef catamaran cruise', 'Sydney Harbour private yacht dinner', 'Taronga Zoo entry ticket', 'Domestic flights between Sydney and Cairns'],
        exclusions: ['International airfare', 'Travel insurance', 'Optional scuba diving fees'],
        availableDates: [
          new Date('2026-08-05'),
          new Date('2026-09-22'),
          new Date('2026-11-12'),
        ],
        gallery: [
          'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1523482596112-99d81b109867?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1529142918809-5a507851b68f?w=800&auto=format&fit=crop',
        ],
        itinerary: [
          {
            day: 1,
            title: "G'day Sydney",
            description: 'Arrive at Sydney Kingsford Smith Airport. Transfer to your luxury harbor view hotel and dine at Sydney Tower.',
          },
          {
            day: 2,
            title: 'Sydney Opera House & Bridge Climb',
            description: 'VIP tour of the Sydney Opera House. Afternoon walk across the Sydney Harbour Bridge.',
          },
          {
            day: 3,
            title: 'Bondi Beach & Coastal Walk',
            description: 'Explore Bondi Beach, learn to surf with a private instructor, and walk the scenic Bondi to Coogee path.',
          },
          {
            day: 4,
            title: 'Fly to Cairns & Tropical North',
            description: 'Fly to Cairns, the gateway to the Great Barrier Reef. Settle into your beachfront resort in Port Douglas.',
          },
          {
            day: 5,
            title: 'Great Barrier Reef Cruise',
            description: 'Board a luxury sailing catamaran for a day of snorkeling and diving in the outer Great Barrier Reef.',
          },
          {
            day: 6,
            title: 'Daintree Rainforest & Cape Tribulation',
            description: 'Discover the oldest continuously surviving tropical rainforest in the world with an indigenous guide.',
          },
          {
            day: 7,
            title: 'Kuranda Scenic Railway',
            description: 'Travel via the historic scenic railway and return on the Skyrail Rainforest Cableway above the canopy.',
          },
          {
            day: 8,
            title: 'Leisure Day in Tropical North',
            description: 'Relax by the resort lagoon pool or stroll the boutique shops and markets of Port Douglas.',
          },
          {
            day: 9,
            title: 'Farewell Australia',
            description: 'Transfer to Cairns Airport for your departure flight.',
          },
        ],
      },
      {
        title: 'Imperial India: Golden Triangle & Palaces',
        destination: indId,
        description: 'A luxurious journey across India’s Golden Triangle: delve into historic Delhi, view the sunset over the Taj Mahal in Agra, and discover regal palaces in Jaipur.',
        price: 1699,
        duration: '7 Days / 6 Nights',
        maxGroupSize: 14,
        featured: true,
        inclusions: ['Luxury heritage hotel stays', 'Private air-conditioned SUV transport', 'Professional local guides', 'Taj Mahal VIP entry', 'Traditional Rajasthani dinner'],
        exclusions: ['International airfare', 'Alcoholic beverages', 'Camera fees at monuments'],
        availableDates: [
          new Date('2026-07-01'),
          new Date('2026-08-10'),
          new Date('2026-10-05'),
        ],
        gallery: [
          'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1477584322902-471a5db55d3b?w=800&auto=format&fit=crop',
        ],
        itinerary: [
          {
            day: 1,
            title: 'Arrival in New Delhi',
            description: 'Welcome to India! Traditional garland greeting. Transfer to your luxury hotel and enjoy a Mughlai dinner.',
          },
          {
            day: 2,
            title: 'Old & New Delhi Tour',
            description: 'Visit the majestic Red Fort, Jama Masjid, Humayun’s Tomb, and drive past the India Gate.',
          },
          {
            day: 3,
            title: 'Agra & The Taj Mahal',
            description: 'Drive to Agra. Visit Agra Fort, and watch the sunset over the white marble Taj Mahal from across the Yamuna River.',
          },
          {
            day: 4,
            title: 'Sunrise Taj Mahal & Fatehpur Sikri',
            description: 'Behold the Taj Mahal at sunrise. Afterwards, travel to Jaipur, stopping at the ghost city of Fatehpur Sikri.',
          },
          {
            day: 5,
            title: 'Jaipur - The Pink City',
            description: 'Tour Amber Fort on a jeep, visit City Palace, Hawa Mahal (Palace of Winds), and the Jantar Mantar observatory.',
          },
          {
            day: 6,
            title: 'Jaipur Heritage & Cuisine',
            description: 'Experience an authentic Rajasthani cooking class and explore the bustling Johari bazaar for textiles and jewelry.',
          },
          {
            day: 7,
            title: 'Return to Delhi',
            description: 'Transfer back to Delhi International Airport for your flight home.',
          },
        ],
      },
    ]);

    console.log('Seed: Created Tour Packages...');

    // 4. Create Reviews (linked to John Doe user)
    await Review.insertMany([
      {
        user: client._id,
        package: packages[0]._id,
        rating: 5,
        comment: 'Absolutely magical trip! The hotel in Paris was incredible, and skipping the lines at the Eiffel Tower saved us hours. Highly recommend Tripatee!',
      },
      {
        user: client._id,
        package: packages[1]._id,
        rating: 5,
        comment: 'Tokyo was mind-blowing! The tour guide was extremely knowledgeable, and the sushi-making class was a highlight of my life. 10/10.',
      },
      {
        user: client._id,
        package: packages[2]._id,
        rating: 4,
        comment: 'Beautiful resort. The water villa was pure luxury. Snorkeling with sea turtles was spectacular. Docked 1 star because seaplane got delayed, but still amazing.',
      },
    ]);

    // Force recalculate reviews for average ratings on package model
    for (const pkg of packages) {
      await Review.getAverageRating(pkg._id);
    }

    console.log('Seed: Created Reviews & Aggregated Ratings...');

    // 5. Create Blog Posts
    await Blog.insertMany([
      {
        title: 'Top 10 Things to Know Before Visiting Tokyo',
        content: `Planning a trip to Tokyo? Japan's capital is a fascinating blend of the ultra-modern and the deeply traditional, but it can be overwhelming for first-time visitors. Here are the top 10 things you need to know before you fly:
        
        1. Cash is still king: While cards are increasingly accepted, many smaller shops and ramen joints only take yen cash. Keep some on you.
        2. Get a Suica or Pasmo Card: Essential for riding the incredibly efficient subway systems. You can load it onto your digital wallet.
        3. Do not tip: Tipping is not part of Japanese culture and can actually be seen as confusing or rude.
        4. Trash cans are rare: Tokyo is pristine, yet public bins are almost non-existent. Keep a small bag to carry your garbage.
        5. Learn basic phrases: "Arigatou gozaimasu" (Thank you) and "Sumimasen" (Excuse me) go a long way.
        
        Follow these tips and you will navigate Tokyo like a seasoned pro!`,
        author: admin._id,
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=800&auto=format&fit=crop',
        category: 'Travel Tips',
        tags: ['Tokyo', 'Japan', 'First Time Travel'],
        readTime: '4 min read',
      },
      {
        title: 'Chasing the Sunset in Maldives Resorts',
        content: `There are few places in the world that evoke images of pure luxury and ultimate relaxation quite like the Maldives. Located in the middle of the Indian Ocean, this archipelago of over a thousand coral islands is the definition of a tropical getaway.
        
        If you are planning an escape, staying in an overwater villa is an absolute must. Waking up to the gentle sound of the waves below your floorboards and stepping directly into crystal-clear water is a bucket-list experience. 
        
        Make sure to schedule a sunset dolphin cruise during your stay. Watching wild spinner dolphins leap out of the ocean while enjoying a glass of champagne is a memory you will cherish forever.`,
        author: admin._id,
        image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&auto=format&fit=crop',
        category: 'Luxury',
        tags: ['Maldives', 'Beach', 'Romantic'],
        readTime: '6 min read',
      },
      {
        title: 'Packing Guide for Alpine Winter Trekking',
        content: `Heading to Switzerland or the Dolomites this winter? Winter trekking is a beautiful experience, but packing the wrong gear can turn an adventure into an freezing nightmare. Here is our essential gear checklist:
        
        - Layering is key: A thermal base layer, a fleece mid-layer, and a waterproof shell jacket.
        - Waterproof hiking boots: Buy boots with good ankle support and winter grip.
        - Microspikes: Extremely useful for packed snow or icy path inclines.
        - High-quality sunglasses: The glare from mountain snow is intense.
        - Thermos: Keep hot tea or coffee handy to warm up on trail breaks.
        
        Stay warm and happy hiking!`,
        author: admin._id,
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop',
        category: 'Adventure',
        tags: ['Hiking', 'Switzerland', 'Gear Guide'],
        readTime: '5 min read',
      },
    ]);

    console.log('Seed: Created Blog Posts...');

    // 6. Create active bookings & payments for John Doe to populate user dashboard charts
    const johnBooking = await Booking.create({
      user: client._id,
      package: packages[0]._id,
      travelersCount: 2,
      travelersDetails: [
        { name: 'John Doe', age: 32, gender: 'Male' },
        { name: 'Jane Doe', age: 30, gender: 'Female' },
      ],
      bookingDate: new Date('2026-07-15'),
      totalAmount: packages[0].price * 2,
      status: 'confirmed',
      paymentStatus: 'paid',
    });

    await Payment.create({
      booking: johnBooking._id,
      user: client._id,
      amount: johnBooking.totalAmount,
      transactionId: 'TXN-MOCK123456',
      paymentMethod: 'Credit Card',
      status: 'completed',
    });

    console.log('Seed: Created Pre-paid booking for client dashboard integration...');

    console.log('Seed: Database seeded successfully!');
    mongoose.disconnect();
  } catch (error) {
    console.error('Seed: Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
