// Offline Mock Data for Colombo National Museum

export const mockCategories = [
  { _id: 'cat1', name: 'Ancient Sculptures', description: 'Carvings and status in stone, wood, or bronze' },
  { _id: 'cat2', name: 'Royal Antiquities', description: 'Artifacts, crowns, and weapons belonging to ancient kings' },
  { _id: 'cat3', name: 'Prehistoric Sri Lanka', description: 'Tools and evidence of early human settlements' },
  { _id: 'cat4', name: 'Traditional Costumes', description: 'Heritage jewelry, clothes, and regalia' }
];

export const mockMuseums = [
  {
    _id: 'mus1',
    name: 'National Museum of Colombo',
    description: 'Established in 1877, the National Museum of Colombo stands as the guardian of Sri Lanka\'s rich historical legacy. Housing thousands of antiquities, it exhibits the cultural, artistic, and social evolution of the island from prehistoric eras up to the Kandyan kingdom.',
    coverImage: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=800',
    openingHours: {
      weekdays: '09:00 AM - 05:00 PM',
      weekends: '09:00 AM - 06:00 PM'
    },
    location: {
      address: 'Sir Marcus Fernando Mawatha, Colombo 00700, Sri Lanka',
      lat: 6.9113,
      lng: 79.8654
    },
    galleriesCount: 4
  }
];

export const mockGalleries = [
  {
    _id: 'gal1',
    name: 'Stone Antiquities Gallery',
    description: 'Features masterpieces of Sri Lankan stone carvings including guard stones, moonstones, and statues dating from the Anuradhapura and Polonnaruwa periods.',
    coverImage: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=600',
    museumId: 'mus1',
    exhibitsCount: 2
  },
  {
    _id: 'gal2',
    name: 'Kandyan Kingdom Gallery',
    description: 'Exhibits regalia, royal swords, throne, and traditional jewelry of the last independent kingdom of Sri Lanka.',
    coverImage: 'https://images.unsplash.com/photo-1599733589046-9b8308b5b50d?auto=format&fit=crop&q=80&w=600',
    museumId: 'mus1',
    exhibitsCount: 2
  },
  {
    _id: 'gal3',
    name: 'Prehistoric & Protohistoric Gallery',
    description: 'Walk through the life of Balangoda Man and early settlements with ancient pottery, beads, and stone axes.',
    coverImage: 'https://images.unsplash.com/photo-1569783046476-0f33923ef1e2?auto=format&fit=crop&q=80&w=600',
    museumId: 'mus1',
    exhibitsCount: 0
  },
  {
    _id: 'gal4',
    name: 'Bronzes and Art Gallery',
    description: 'Displays a rich collection of Hindu and Buddhist bronzes dating from the 5th to the 12th century AD.',
    coverImage: 'https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&q=80&w=600',
    museumId: 'mus1',
    exhibitsCount: 0
  }
];

export const mockExhibits = [
  {
    _id: 'ex1',
    title: 'The Toluvila Buddha Statue',
    description: 'One of the most famous seated Buddha statues in Sri Lanka, displaying the supreme calm of the Samadhi meditative posture.',
    historicalInfo: 'Discovered in Toluvila, Anuradhapura in 1900, this statue is carved from a single block of granite. It belongs to the late Anuradhapura period (circa 4th-5th century AD). The statue showcases the elegant simplicity of early Buddhist sculpture on the island.',
    timeline: [
      { year: '450 AD', title: 'Carving of the Statue', description: 'Sculpted by expert stonemasons using local granite during the Anuradhapura Golden Age.' },
      { year: '1900 AD', title: 'Excavation & Retrieval', description: 'Excavated from the Toluvila monastery ruins by British archaeologists.' },
      { year: '1901 AD', title: 'Museum Installation', description: 'Transported to the Colombo Museum where it occupies the central foyer entrance.' }
    ],
    images: [
      'https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=600'
    ],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    categoryId: { _id: 'cat1', name: 'Ancient Sculptures' },
    galleryId: { _id: 'gal1', name: 'Stone Antiquities Gallery' },
    museumId: { _id: 'mus1', name: 'National Museum of Colombo' },
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=http://localhost:5173/exhibit/ex1',
    relatedArtifacts: ['ex2']
  },
  {
    _id: 'ex2',
    title: 'Anuradhapura Moonstone (Sandakada Pahana)',
    description: 'A beautifully carved semi-circular stone slab placed at the foot of temple stairways, symbolizing the cycle of Samsara.',
    historicalInfo: 'This moonstone is widely considered the finest example of Anuradhapura stone craftsmanship. Its concentric bands feature carving of ducks, creepers, four animals (elephant, horse, lion, bull), and central lotus petals, detailing the stages of worldly suffering and ultimate nirvana.',
    timeline: [
      { year: '600 AD', title: 'Royal Temple Entrance Placement', description: 'Created for the entrance of the Mahavihara monastery.' },
      { year: '1880 AD', title: 'Rediscovered in Ancient Forest', description: 'Located by early antiquarian surveyors.' }
    ],
    images: [
      'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=600'
    ],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    videoUrl: '',
    categoryId: { _id: 'cat1', name: 'Ancient Sculptures' },
    galleryId: { _id: 'gal1', name: 'Stone Antiquities Gallery' },
    museumId: { _id: 'mus1', name: 'National Museum of Colombo' },
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=http://localhost:5173/exhibit/ex2',
    relatedArtifacts: ['ex1']
  },
  {
    _id: 'ex3',
    title: 'Throne of the Last King of Kandy',
    description: 'The golden throne of King Sri Vikrama Rajasinha, the last monarch of Sri Lanka.',
    historicalInfo: 'Constructed in Kandy, this magnificent throne is covered with gold sheets and decorated with intricate filigree and red rubies. It features symbols of the sun and moon representing absolute sovereignty. The throne was taken to Windsor Castle in 1815 after the fall of Kandy and returned by King George V in 1934.',
    timeline: [
      { year: '1798 AD', title: 'Royal Coronation Use', description: 'Used during the coronation of King Sri Vikrama Rajasinha.' },
      { year: '1815 AD', title: 'Exile to Britain', description: 'Shipped to Windsor Castle following the signing of the Kandyan Convention.' },
      { year: '1934 AD', title: 'Repatriation to Sri Lanka', description: 'Returned to Colombo with royal honors by the British Crown.' }
    ],
    images: [
      'https://images.unsplash.com/photo-1599733589046-9b8308b5b50d?auto=format&fit=crop&q=80&w=600'
    ],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    videoUrl: '',
    categoryId: { _id: 'cat2', name: 'Royal Antiquities' },
    galleryId: { _id: 'gal2', name: 'Kandyan Kingdom Gallery' },
    museumId: { _id: 'mus1', name: 'National Museum of Colombo' },
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=http://localhost:5173/exhibit/ex3',
    relatedArtifacts: ['ex4']
  },
  {
    _id: 'ex4',
    title: 'Royal Crown of Kandy',
    description: 'The crown worn by King Sri Vikrama Rajasinha, encrusted with diamonds, emeralds, and rubies.',
    historicalInfo: 'The royal crown is a unique heptagonal hat style adorned with gold lace and precious gems. It marks the pinnacle of Kandyan metalwork and royal identity, combining traditional motifs with European textile influences.',
    timeline: [
      { year: '1815 AD', title: 'Captured by British Forces', description: 'Removed from the palace and kept as treasury war loot.' },
      { year: '1934 AD', title: 'Returned to the Public', description: 'Repatriated along with the royal throne and placed in the Colombo Museum.' }
    ],
    images: [
      'https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&q=80&w=600'
    ],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    videoUrl: '',
    categoryId: { _id: 'cat2', name: 'Royal Antiquities' },
    galleryId: { _id: 'gal2', name: 'Kandyan Kingdom Gallery' },
    museumId: { _id: 'mus1', name: 'National Museum of Colombo' },
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=http://localhost:5173/exhibit/ex4',
    relatedArtifacts: ['ex3']
  }
];

export const mockQuizzes = [
  {
    _id: 'q1',
    title: 'Anuradhapura Sculptures Masterclass',
    description: 'Test your knowledge about the seated Toluvila Buddha and early Sinhala carvings.',
    difficulty: 'medium',
    pointsReward: 50,
    museumId: 'mus1',
    galleryId: 'gal1',
    questions: [
      {
        _id: 'qq1',
        text: 'Where was the Toluvila Buddha Statue discovered?',
        options: ['Anuradhapura', 'Polonnaruwa', 'Kandy', 'Colombo'],
        correctAnswer: 'Anuradhapura'
      },
      {
        _id: 'qq2',
        text: 'Which century does the Toluvila Buddha Statue belong to?',
        options: ['12th Century', '4th-5th Century', '18th Century', '1st Century BC'],
        correctAnswer: '4th-5th Century'
      },
      {
        _id: 'qq3',
        text: 'The Toluvila Buddha statue is carved from a single block of granite.',
        options: ['True', 'False'],
        correctAnswer: 'True'
      }
    ]
  },
  {
    _id: 'q2',
    title: 'Regalia of the last Kandyan Monarchy',
    description: 'Journey to the hill country and test your knowledge on royal crowns and thrones.',
    difficulty: 'hard',
    pointsReward: 80,
    museumId: 'mus1',
    galleryId: 'gal2',
    questions: [
      {
        _id: 'qq4',
        text: 'In which year did the Kingdom of Kandy fall to the British?',
        options: ['1505', '1658', '1815', '1948'],
        correctAnswer: '1815'
      },
      {
        _id: 'qq5',
        text: 'Who returned the Royal Throne of Kandy to Sri Lanka in 1934?',
        options: ['Queen Victoria', 'King George V', 'Lord Mountbatten', 'Queen Elizabeth II'],
        correctAnswer: 'King George V'
      }
    ]
  }
];
