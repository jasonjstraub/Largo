/* =====================================================================
   LARGO SOURCES. Edit this file on GitHub to change what students see.
   (Click the pencil icon, make changes, then Commit. Render updates Largo.)
   ---------------------------------------------------------------------
   helperUrl     your Cloudflare Worker address (see SETUP). Leave "" and
                 Largo still works using the teacher-picked videos, articles
                 and Facebook pages below. It just won't pull new uploads.
   youtube       channels Largo follows. auto:true = their NEW uploads flow
                 into the feed automatically (titles are run through a clean
                 filter). auto:false = only teacher-picked videos show.
   videos        teacher-picked YouTube videos (always shown)
   articles      free articles / resources (link cards)
   facebook      Facebook Pages shown as live timeline cards
   reels         individual public Facebook reels/videos to embed
   artists       musicians whose songs appear as 30-second Apple Music
                 previews (only songs Apple marks "not explicit")
   block         YouTube video IDs or words you never want shown
   ===================================================================== */
const LARGO_CONFIG = {
  helperUrl: "https://largo-helper.jasonjstraub.workers.dev",

  youtube: [
    // ---- choirs & vocal ensembles ----
    { id: "UC3UpGPbOIOG6IaUijyRpp6Q", name: "VOCES8", topic: "perform", auto: true },
    { id: "UCr7FxpiZjb9f-XVmyO82bZA", name: "VOCES8 (archive)", topic: "perform", auto: true },
    { id: "UC-1Fp9nN91mjOTn9z_mozsg", name: "The King's Singers", topic: "perform", auto: true },
    { id: "UCLa8WdKAdt49Q_mE0Tp407g", name: "Chanticleer", topic: "perform", auto: true },
    { id: "UC4hGgdm9QG1m0bl753JoN6Q", name: "APOLLO5", topic: "perform", auto: true },
    { id: "UC-_wCM5NIu2W9CwCLAGIxkg", name: "The Gesualdo Six", topic: "perform", auto: true },
    { id: "UCl-WbRCwODSd2BRQSxJcq2g", name: "Tenebrae Choir", topic: "perform", auto: true },
    { id: "UCTWBXmgr1YUartTXG-kEdvQ", name: "The Sixteen", topic: "perform", auto: true },
    { id: "UCNY02mhMxIA401SzGixUgFw", name: "The Swingles", topic: "perform", auto: true },
    { id: "UCWBZyeDFzGGupDpo7P_LRpw", name: "Conspirare", topic: "perform", auto: true },
    { id: "UCD3fBgytmupruK7ZyXyIbNw", name: "The Crossing", topic: "perform", auto: true },
    { id: "UCtUIftki14LRx2yob6Vm1eg", name: "The Tallis Scholars", topic: "perform", auto: true },
    { id: "UCJi5mMtySnmoGwTqsZE9XkQ", name: "Stile Antico", topic: "perform", auto: true },
    { id: "UCO0r6SOnNdbpwEZhnZq-0cQ", name: "Seraphic Fire", topic: "perform", auto: true },
    { id: "UCwrrivh8AevjukLv3xIy_pw", name: "Los Angeles Master Chorale", topic: "perform", auto: true },
    { id: "UCiAkukrUIRCwaLaFx_MJq7Q", name: "The Tabernacle Choir", topic: "perform", auto: true },
    { id: "UC6nakm6OTA7KFaScVexvDRA", name: "King's College Choir", topic: "perform", auto: true },
    { id: "UCBYbc4_3QJ9YEhXJtCTVO0A", name: "Monteverdi Choir", topic: "perform", auto: true },
    { id: "UCeGFQT691TW1VW5Z1wy-oAg", name: "Cappella Romana", topic: "perform", auto: true },
    { id: "UCbb0ex8oFF9qCSMDg76cqcg", name: "Lorelei Ensemble", topic: "perform", auto: true },
    { id: "UC8_TuFm6-8E31dI9xAa4maA", name: "Roomful of Teeth", topic: "perform", auto: true },
    { id: "UCQKJ8B_6lcfN4nlmdlpfX6g", name: "Westminster Choir College", topic: "perform", auto: true },
    { id: "UCrjq25xbdEiL8jH28FR38Ow", name: "Eric Whitacre's Virtual Choir", topic: "perform", auto: true },
    { id: "UCqXwdCqE2uURfXO2Y_A6yyw", name: "Ladysmith Black Mambazo", topic: "perform", auto: true },
    { id: "UCPloaRfzzzReb84HvvSVQqw", name: "Sweet Honey in the Rock", topic: "perform", auto: true },
    { id: "UC9qItJ2Gs8Xfu6y_ERKNsxw", name: "Voices of Music", topic: "perform", auto: true },
    // ---- a cappella ----
    { id: "UCIE6_c6qPrHzuVRssQ5B0lQ", name: "Pentatonix", topic: "perform", auto: true },
    { id: "UCKb63xBY-hnVbQ82sxfzXEQ", name: "Voctave", topic: "perform", auto: true },
    { id: "UCFA0Hqio3RdsQU-cQrrn9ag", name: "VoicePlay", topic: "perform", auto: true },
    { id: "UCTFuNYrqAcsmSjgqYMvxOqw", name: "Home Free", topic: "perform", auto: true },
    { id: "UCiZeZ-IA5Qk_B2iu0GFWm-w", name: "Straight No Chaser", topic: "perform", auto: true },
    { id: "UCgITW_70LNZFkNna7VsXbuQ", name: "Peter Hollens", topic: "perform", auto: true },
    { id: "UCzpdgMjpMUunL9ObB6WZxPQ", name: "BYU Vocal Point", topic: "perform", auto: true },
    { id: "UCErjRQAX9ZV_AxuLmh8kfPg", name: "BYU Noteworthy", topic: "perform", auto: true },
    { id: "UCbB-5jeWvw5cfD14q7Vz48w", name: "Naturally 7", topic: "perform", auto: true },
    { id: "UCbI8NiUif-Ein7UHeKdec2A", name: "The Real Group", topic: "perform", auto: true },
    { id: "UC67rfRvn6bw-bChtOwMNeYA", name: "Rajaton", topic: "perform", auto: true },
    { id: "UCRo1OSKmBh6oxs6R0ANvINg", name: "Bobby McFerrin", topic: "perform", auto: true },
    { id: "UCGY1B_NqHQt6qdx7I-Y4Ydw", name: "The Manhattan Transfer", topic: "perform", auto: true },
    { id: "UCqoOdM1lRzFnSVwd3jIU8LQ", name: "New York Voices", topic: "perform", auto: true },
    { id: "UCjJn75rK6lUaYwal1Ald1gg", name: "Barbershop Harmony Society", topic: "perform", auto: true },
    { id: "UCgUcqm-tK9Cx599e2rFN5pA", name: "Westminster Chorus", topic: "perform", auto: true },
    { id: "UCuE4tRwz3em6J0klLdx64Fw", name: "Varsity Vocals", topic: "perform", auto: true },
    // ---- composers ----
    { id: "UCdR_-X6pbG7Zy8peXfuTBQQ", name: "Eric Whitacre", topic: "perform", auto: true },
    { id: "UCU9Z3FVJ_gR_6FCIgZJF-_g", name: "Ola Gjeilo", topic: "perform", auto: true },
    { id: "UC71XJLzA965uRK4GGTb8E_w", name: "Jake Runestad", topic: "perform", auto: true },
    { id: "UCV3VuQuT2Frr9rqvjkIP-VA", name: "Elaine Hagenberg", topic: "perform", auto: true },
    { id: "UC6UdtPVgOiIKh4S2KxdZfKA", name: "Dan Forrest", topic: "perform", auto: true },
    { id: "UCDOZCD8r5E4HjlLg5BanIng", name: "Kim André Arnesen", topic: "perform", auto: true },
    { id: "UC55kqa2D_OIosQ1Wr6mCClw", name: "Choristers Guild", topic: "voice", auto: true },
    // ---- orchestras, classical, world ----
    { id: "UCFDAPHp97JRPFNT-CnTwKcg", name: "The Philadelphia Orchestra", topic: "perform", auto: true },
    { id: "UCXurQhbWuJW7FatrU_y88BQ", name: "New York Philharmonic", topic: "perform", auto: true },
    { id: "UC34DbNyD_0t8tnOc5V38Big", name: "Deutsche Grammophon", topic: "perform", auto: true },
    { id: "UCw7UqWQHu9ouxy6laSdtiiw", name: "Classic FM", topic: "history", auto: true },
    { id: "UCWgEWXnFFFeoXMJ766CfDLw", name: "Smithsonian Folkways", topic: "history", auto: true },
    { id: "UCmKurapML4BF9Bjtj4RbvXw", name: "The Piano Guys", topic: "perform", auto: true },
    { id: "UCyC_4jvPzLiSkJkLIkA7B8g", name: "Lindsey Stirling", topic: "perform", auto: true },
    { id: "UCPhq7iR65k0gWcraXgLiY1A", name: "Nigel John Stanford", topic: "sound", auto: true },
    // ---- music education ----
    { id: "UCTUtqcDkzw7bisadh6AOx5w", name: "12tone", topic: "harmony", auto: true },
    { id: "UCNBiLBQrKrnvwcVRD5fS8aA", name: "Michael New", topic: "harmony", auto: true },
    { id: "UCz2iUx-Imr6HgDC3zAFpjOw", name: "David Bennett Music Theory", topic: "harmony", auto: true },
    { id: "UCi7l9chXMljpUft67vw78qw", name: "Sideways", topic: "harmony", auto: true },
    { id: "UCYvO0FPpDlJA8S5n9elvQuw", name: "Singeo", topic: "ear", auto: true },
    { id: "UCjHDlJq5iNaQ_aIKyqyR76g", name: "Logan James Music", topic: "ear", auto: true },
    { id: "UCwHBGpmobNVGYU57XAZ0n8w", name: "In Unison Music Lessons", topic: "solfege", auto: true },
    { id: "UCcueqsFShdlJ3tmeKhC0yMA", name: "Mrs. Musical Pants", topic: "solfege", auto: true },
    { id: "UCyrpCduEp6H61SvacMtq3dw", name: "Roger Hale", topic: "voice", auto: true },
    { id: "UCiuFR-m7cy1GW-JMMYBd1TQ", name: "Cheryl Porter Vocal Coach", topic: "voice", auto: true },
    { id: "UC6x5NRBmotXDEvLDDFWlLvA", name: "Ken Tamplin Vocal Academy", topic: "voice", auto: true },
    { id: "UCGu4Zti5tsEPchFFswvL-Gg", name: "NATS (Teachers of Singing)", topic: "voice", auto: true },
    // ---- teacher-picked videos only (channel posts other topics too) ----
    { id: "UCnkp4xDOwqqJD7sSM3xdUiQ", name: "Adam Neely", topic: "harmony", auto: false },
    { id: "UC4PIiYewI1YGyiZvgNlJNrA", name: "Charles Cornell", topic: "harmony", auto: false },
    { id: "UCtmY49Zn4l0RMJnTWfV7Wsg", name: "Jacob Collier", topic: "perform", auto: false }
  ],

  videos: [
    // 1. Music theory
    { id: "lz3WR-F_pnM", title: "The 7 Levels of Jazz Harmony", channel: "Adam Neely", topic: "harmony", level: "mss", note: "One chord progression built through seven levels of harmony, from triads to full jazz reharmonization." },
    { id: "VPWQC4pdEco", title: "Building Blocks: The Modes", channel: "12tone", topic: "scales", level: "hcc", note: "A short, friendly animated explainer of the church modes and how they relate to the major scale." },
    { id: "5Y01jIorpeA", title: "How Basic Chords Work", channel: "Michael New", topic: "harmony", level: "msc", note: "How major and minor triads are built from scales, shown at the piano." },
    { id: "M2skX-SNIvA", title: "How the Roman Numeral System Works", channel: "Michael New", topic: "harmony", level: "hcc", note: "Roman numeral analysis and chord function, step by step. Try labeling the chords in a piece you're singing!" },
    { id: "62tIvfP9A2w", title: "The most feared song in jazz, explained", channel: "Vox", topic: "harmony", level: "mss", note: "Coltrane's “Giant Steps” and its three-key chord cycle, with Adam Neely." },
    { id: "HzzmqUoQobc", title: "Why we really really really like repetition in music", channel: "Vox", topic: "notation", level: "msc", note: "The psychology of repetition and musical form." },
    { id: "eRkgK4jfi6M", title: "Jacob Collier Explains Music in 5 Levels of Difficulty ft. Herbie Hancock", channel: "WIRED", topic: "harmony", level: "hcc", note: "Harmony explained to five people, from a child to Herbie Hancock." },
    { id: "5iH_rrY3rB0", title: "This Mario 2 Theme Is An ENTIRE Jazz Piano Masterclass", channel: "Charles Cornell", topic: "harmony", level: "hcc", note: "The jazz harmony hiding in a Super Mario Bros. 2 theme." },
    { id: "ZFonFfFsXcQ", title: "How Trailer Music Tricks You", channel: "Sideways", topic: "expression", level: "msc", note: "How trailer music uses harmony and orchestration to make you feel things." },
    // 2. Ear training & solfege
    { id: "LF6Zl-Uu-Ls", title: "Ear Training for SINGERS (sing-along practice)", channel: "Singeo", topic: "ear", level: "msc", note: "A sing-along ear-training workout made for voices." },
    { id: "d9glE7p0KZA", title: "Best Ear Training Exercise I Know (for ALL musicians)", channel: "Logan James Music", topic: "ear", level: "hcc", note: "A simple daily ear exercise you can add to your own practice." },
    { id: "CT8x2bdOtD8", title: "5 Fun Vocal Warmups (SOLFEGE Sing-Along)", channel: "In Unison Music Lessons", topic: "solfege", level: "msc", note: "Five solfege warm-up sing-alongs." },
    { id: "fmpGD8JQ2RU", title: "ULTIMATE! Solfege Practice #1: Solfege Hand Signs", channel: "Mrs. Musical Pants", topic: "solfege", level: "msc", note: "Guided solfege practice with Curwen hand signs." },
    // 3. Voice & vocal health
    { id: "tnJW-8a26OA", title: "Choral Warm up #1: Full Vocal Warm up", channel: "Roger Hale", topic: "voice", level: "msc", note: "A complete choir warm-up led by a choral educator." },
    { id: "1XHXezdnL0A", title: "10 Minute Daily VOCAL WORKOUT!", channel: "Cheryl Porter Vocal Coach", topic: "voice", level: "msc", note: "A follow-along vocal workout for range and agility." },
    { id: "tHucfipASpo", title: "How do Straw Exercises Help the Voice Get Better?", channel: "Fauquier ENT", topic: "voice", level: "msc", note: "A voice specialist explains why straw (semi-occluded) exercises help your voice." },
    { id: "Xa2vgEyQE9o", title: "How To Heal, Restore, And Rehabilitate Your Voice", channel: "Ken Tamplin Vocal Academy", topic: "voice", level: "hcc", note: "Resting and rebuilding a tired voice during busy performance weeks." },
    // 4. Choral & a cappella
    { id: "52aIwvbzJ4g", title: "VOCES8: Sing Joyfully (Byrd)", channel: "VOCES8", topic: "perform", level: "msc", note: "William Byrd's sparkling “Sing Joyfully.” A model of blend and Renaissance style." },
    { id: "R2D4E3YkCsw", title: "VOCES8: Let My Love Be Heard (Jake Runestad)", channel: "VOCES8", topic: "perform", level: "msc", note: "Listen for expressive phrasing and dynamic control." },
    { id: "SfGTq71VXfo", title: "The King's Singers: Danny Boy", channel: "The King's Singers", topic: "perform", level: "msc", note: "A masterclass in close-harmony tuning and ensemble listening." },
    { id: "DxENaHLZAPE", title: "Chanticleer: Both Sides Now (arr. Vince Peterson)", channel: "Chanticleer", topic: "perform", level: "msc", note: "A lush choral arrangement of a Joni Mitchell song." },
    { id: "3MteSlpxCpo", title: "Pentatonix: Daft Punk (Official Video)", channel: "Pentatonix", topic: "perform", level: "msc", note: "Grammy-winning medley made entirely of voices and vocal percussion." },
    { id: "OPtM9PByK_4", title: "Jacob Collier Harmonises The Audience", channel: "Jacob Collier", topic: "perform", level: "msc", note: "An arena audience sings improvised harmony in real time. Anyone can sing in parts!" },
    { id: "irnyDlE4IbY", title: "Water Fountain (Kristopher Fulton): EVSC High School Honors Choir", channel: "EVSC", topic: "perform", level: "msc", note: "A high school honors choir with rhythmic body percussion." },
    // 5. History & great performances
    { id: "WzuQRbV6Vx0", title: "Leonard Bernstein: Young People's Concerts: What Is Classical Music?", channel: "Trillo", topic: "history", level: "msc", note: "Bernstein's famous televised lesson, with live orchestra examples." },
    { id: "gigp9lvA5rc", title: "Leonard Bernstein: The Anatomy of a Symphony Orchestra", channel: "Trillo", topic: "history", level: "msc", note: "The orchestra taken apart section by section." },
    { id: "D7o7BrlbaDs", title: "Eric Whitacre's Virtual Choir: Lux Aurumque", channel: "Eric Whitacre's Virtual Choir", topic: "perform", level: "msc", note: "185 singers from 12 countries, all singing from their webcams." },
    { id: "FZEusNJLoRw", title: "Mahler: Symphony No. 2 “Resurrection”, Finale (Bernstein, LSO)", channel: "Deutsche Grammophon", topic: "history", level: "hcc", note: "A towering orchestra-plus-choir climax." },
    { id: "GBaHPND2QJg", title: "Som Sabadell flashmob: Ode to Joy", channel: "Banco Sabadell", topic: "perform", level: "msc", note: "Beethoven's “Ode to Joy” grows from one cellist to a full orchestra and choir in a town square." },
    // 6. Music science
    { id: "ne6tB2KiZuk", title: "Bobby McFerrin Demonstrates the Power of the Pentatonic Scale", channel: "World Science Festival", topic: "sound", level: "msc", note: "An audience sings the pentatonic scale without being taught it." },
    { id: "1Hqm0dYKUx4", title: "Why It's Impossible to Tune a Piano", channel: "minutephysics", topic: "sound", level: "hcc", note: "The math behind tuning, and why choirs can tune more purely than pianos." },
    { id: "lvmzgVtZtUQ", title: "Why Does Music Only Use 12 Different Notes?", channel: "David Bennett Music Theory", topic: "sound", level: "hcc", note: "Tuning systems and the harmonic series." },
    { id: "Q3oItpVa9fs", title: "CYMATICS: Science Vs. Music", channel: "Nigel John Stanford", topic: "sound", level: "msc", note: "Sound made visible with sand, water and fire." },
    { id: "0K8zs-KSitc", title: "Acoustic Levitation in Ultra Slow Motion", channel: "SmarterEveryDay", topic: "sound", level: "msc", note: "Standing waves can make droplets float!" },
    { id: "3NE_OoO-N54", title: "Earworms: Those songs that get stuck in your head", channel: "TED-Ed", topic: "sound", level: "msc", note: "Why songs loop in our brains." },
    // 7. Clean entertainment
    { id: "mJ_fkw5j-t0", title: "Beethoven's 5 Secrets: OneRepublic Meets Beethoven", channel: "The Piano Guys", topic: "perform", level: "msc", note: "A pop song woven into Beethoven's Fifth." },
    { id: "09RUuTAM2H0", title: "Code Name Vivaldi (Piano & Cello Mashup)", channel: "The Piano Guys", topic: "perform", level: "msc", note: "Vivaldi's “Winter” meets the Bourne theme." },
    { id: "aHjpOzsQ9YI", title: "Lindsey Stirling: Crystallize", channel: "Lindsey Stirling", topic: "perform", level: "msc", note: "Violin meets electronic music." },
    { id: "d9NF2edxy-M", title: "5 People 1 Guitar!", channel: "Walk off the Earth", topic: "perform", level: "msc", note: "Five musicians play one guitar at the same time." },
    { id: "uy1Mv2of_kI", title: "Bad Timing: The Musical", channel: "Studio C", topic: "perform", level: "msc", note: "A clean comedy sketch about life turning into a musical at the worst moments." },
    { id: "0NmKp5A8i3M", title: "Shenandoah (A Cappella)", channel: "Peter Hollens", topic: "perform", level: "msc", note: "One singer, many layered voices." }
  ],

  articles: [
    { url: "https://nafme.org/blog/music-education-advocacy-pays-off/", title: "Music Education Advocacy Pays Off!", source: "NAfME", topic: "news", desc: "How federal funding for music and arts education was preserved, and how advocacy made the difference." },
    { url: "https://nammfoundation.org/why-learn-to-play/", title: "Why Learn to Play Music?", source: "The NAMM Foundation", topic: "news", desc: "The research-backed case for learning music." },
    { url: "https://nammfoundation.org/resources/research/", title: "Music Education Research", source: "The NAMM Foundation", topic: "sound", desc: "Research on music's impact on learning, the brain and well-being." },
    { url: "https://theviolinchannel.com/classical-music-news/", title: "Classical Music News", source: "The Violin Channel", topic: "news", desc: "Daily classical music news: artists, awards, new commissions and orchestras." },
    { url: "https://choralnet.org/archives/423212", title: "Composition Spotlight: Composers of Choral Music Showcase", source: "ChoralNet", topic: "voice", desc: "Composers share choral works with recordings and scores, searchable by voicing." },
    { url: "https://nafme.org/blog/vocal-health-how-choral-directors-can-help-students/", title: "Vocal Health for Young Singers", source: "NAfME", topic: "voice", desc: "Hydration, healthy warm-ups, changing voices, and habits to avoid." },
    { url: "https://nafme.org/blog/20-surefire-ways-to-warm-up-your-choir/", title: "20+ Surefire Ways to Warm Up Your Choir", source: "NAfME", topic: "voice", desc: "Breathing, vocalises, blend and solfege-with-hand-signs warm-ups." },
    { url: "https://nafme.org/blog/preparing-students-for-auditions/", title: "Preparing for Auditions", source: "NAfME", topic: "voice", desc: "Honor choir, musical and college auditions, including handling nerves." },
    { url: "https://acda.org/show-choir", title: "Show Choir Resources", source: "ACDA", topic: "voice", desc: "Show choir repertoire, arrangers and all-state links." },
    { url: "https://www.musictheory.net/lessons", title: "Free Music Theory Lessons", source: "musictheory.net", topic: "notation", desc: "Animated lessons from the basics through scales, intervals, chords and progressions." },
    { url: "https://teoria.com/", title: "teoria: Music Theory Web", source: "teoria.com", topic: "ear", desc: "Theory tutorials plus ear training for intervals, chords, scales and rhythm." },
    { url: "https://www.musicca.com", title: "Musicca: Theory Games", source: "Musicca", topic: "notation", desc: "Game-style note reading and theory practice, free forever." },
    { url: "https://viva.pressbooks.pub/openmusictheorycopy/front-matter/introduction/musescore-embed/", title: "Open Music Theory", source: "Open Music Theory", topic: "harmony", desc: "A complete free theory textbook and workbook." },
    { url: "https://www.kennedy-center.org/education/resources-for-educators/classroom-resources/media-and-interactives/interactives/whack-a-note/", title: "Whack-A-Note", source: "The Kennedy Center", topic: "notation", desc: "A carnival-style game for note reading on the staff." },
    { url: "https://folkways.si.edu/lesson-plans", title: "World Music Lesson Plans", source: "Smithsonian Folkways", topic: "history", desc: "Lessons with recordings from music cultures around the world." },
    { url: "https://folkways.si.edu/learn", title: "Music Pathways", source: "Smithsonian Folkways", topic: "history", desc: "Learning journeys: blues women, Cajun and zydeco, instruments of Asia and more." },
    { url: "https://www.bbc.co.uk/teach/ten-pieces", title: "BBC Ten Pieces", source: "BBC Teach", topic: "history", desc: "Films and resources built around ten pieces of classical music." },
    { url: "https://www.classicfm.com/discover-music/instruments/bassoon/", title: "Discover Music: Instrument Guides", source: "Classic FM", topic: "history", desc: "Guides to every orchestral instrument and composer." },
    { url: "https://www.classicsforkids.com/", title: "Classics for Kids", source: "Classics for Kids", topic: "history", desc: "Composer features, listening lessons and music games." },
    { url: "https://www.nyphil.org/education/school-programs/very-young-composers", title: "Very Young Composers", source: "New York Philharmonic", topic: "history", desc: "How students' musical ideas become pieces played by professionals." },
    { url: "https://musopen.org/", title: "Musopen: Free Classical Music", source: "Musopen", topic: "history", desc: "Free public-domain recordings, sheet music and textbooks." },
    { url: "https://www.kennedy-center.org/education/resources-for-educators/classroom-resources/lessons-and-activities/lessons/9-12/the-poetics-of-hip-hop/", title: "The Poetics of Hip Hop", source: "The Kennedy Center", topic: "history", level: "hcc", desc: "Rhyme, meter and form in Shakespeare's sonnets and hip-hop." },
    { url: "https://www.savethemusic.org/blog/research/benefits-to-the-brain/", title: "Music and the Brain", source: "Save The Music Foundation", topic: "sound", desc: "How music study engages the brain and supports learning." },
    { url: "https://musiclab.chromeexperiments.com/", title: "Chrome Music Lab", source: "Google", topic: "sound", desc: "Experiments that make sound visible: spectrogram, harmonics, Song Maker and more." },
    { url: "https://nafme.org/blog/new-from-j-w-pepper-wellness-resources-for-musicians/", title: "Wellness Resources for Musicians", source: "NAfME", topic: "voice", desc: "Hearing protection, injury prevention and performance anxiety." },
    { url: "https://www.michelletuesday.com/careers-in-music-beyond-the-stage/", title: "Where Can Music Take You? Careers Beyond Performing", source: "Michelle Tuesday Music School", topic: "news", desc: "Sound engineering, game audio, music therapy, instrument repair and more." },
    { url: "https://majormatch.us/blog/what-can-you-do-with-a-music-degree/", title: "What Can You Do With a Music Degree?", source: "MajorMatch", topic: "news", desc: "Music careers with real pay data and education requirements." },
    { url: "https://orphiq.com/resources/music-industry-jobs-careers", title: "Music Industry Jobs", source: "Orphiq", topic: "news", desc: "Record labels, management, publishing, touring and music tech." },
    { url: "https://nafme.org/blog/how-mister-rogers-neighborhood-impacted-music-education/", title: "How Mister Rogers Impacted Music Education", source: "NAfME", topic: "history", desc: "Fred Rogers was a trained composer who built music into his show." }
  ],

  facebook: [
    { url: "https://www.facebook.com/VOCES8", name: "VOCES8" },
    { url: "https://www.facebook.com/ChanticleerSings", name: "Chanticleer" },
    { url: "https://www.facebook.com/kingssingers", name: "The King's Singers" },
    { url: "https://www.facebook.com/apollo5.uk", name: "Apollo5" },
    { url: "https://www.facebook.com/TheGesualdoSix", name: "The Gesualdo Six" },
    { url: "https://www.facebook.com/tenebraechoir", name: "Tenebrae Choir" },
    { url: "https://www.facebook.com/thesixteenchoir", name: "The Sixteen" },
    { url: "https://www.facebook.com/Conspirare", name: "Conspirare" },
    { url: "https://www.facebook.com/crossingchoir", name: "The Crossing" },
    { url: "https://www.facebook.com/westminsterchoircollege", name: "Westminster Choir College" },
    { url: "https://www.facebook.com/stolafchoir", name: "The St. Olaf Choir" },
    { url: "https://www.facebook.com/TheSwingles", name: "The Swingles" },
    { url: "https://www.facebook.com/Pentatonix", name: "Pentatonix" },
    { url: "https://www.facebook.com/voctavesings", name: "Voctave" },
    { url: "https://www.facebook.com/TheVoicePlay", name: "VoicePlay" },
    { url: "https://www.facebook.com/homefreevocalband", name: "Home Free" },
    { url: "https://www.facebook.com/StraightNoChaser", name: "Straight No Chaser" },
    { url: "https://www.facebook.com/PeterHollensMusic", name: "Peter Hollens" },
    { url: "https://www.facebook.com/Take6Official", name: "TAKE 6" },
    { url: "https://www.facebook.com/bobbymcferrin", name: "Bobby McFerrin" },
    { url: "https://www.facebook.com/JCollierMusic", name: "Jacob Collier" },
    { url: "https://www.facebook.com/BYUVocalPoint", name: "BYU Vocal Point" },
    { url: "https://www.facebook.com/varsityvocals", name: "Varsity Vocals" },
    { url: "https://www.facebook.com/EricWhitacreOfficial", name: "Eric Whitacre" },
    { url: "https://www.facebook.com/JakeRunestadMusic", name: "Jake Runestad" },
    { url: "https://www.facebook.com/elaine.hagenberg", name: "Elaine Hagenberg" },
    { url: "https://www.facebook.com/rosephanye", name: "Rosephanye Powell" },
    { url: "https://www.facebook.com/danforrestmusician", name: "Dan Forrest" },
    { url: "https://www.facebook.com/olagjeilo", name: "Ola Gjeilo" },
    { url: "https://www.facebook.com/OfficialNATS", name: "NATS" },
    { url: "https://www.facebook.com/TVFPhiladelphia", name: "The Voice Foundation" },
    { url: "https://www.facebook.com/ACDANational", name: "ACDA" },
    { url: "https://www.facebook.com/nafme", name: "NAfME" },
    { url: "https://www.facebook.com/SingUpFanPage", name: "Sing Up" },
    { url: "https://www.facebook.com/ThetaMusicTrainer", name: "Theta Music" },
    { url: "https://www.facebook.com/Playbill", name: "Playbill" },
    { url: "https://www.facebook.com/BroadwayWorld", name: "BroadwayWorld" },
    { url: "https://www.facebook.com/walnutstreettheatre", name: "Walnut Street Theatre" },
    { url: "https://www.facebook.com/GIAMUSIC", name: "GIA Publications" },
    { url: "https://www.facebook.com/ChoristersGuild", name: "Choristers Guild" },
    { url: "https://www.facebook.com/KennedyCenter", name: "The Kennedy Center" },
    { url: "https://www.facebook.com/nyphilharmonic", name: "New York Philharmonic" },
    { url: "https://www.facebook.com/PhilOrch", name: "The Philadelphia Orchestra" },
    { url: "https://www.facebook.com/ClassicFM", name: "Classic FM" },
    { url: "https://www.facebook.com/smithsonianfolkways", name: "Smithsonian Folkways" },
    { url: "https://www.facebook.com/barbershopharmonysociety", name: "Barbershop Harmony Society" },
    { url: "https://www.facebook.com/ThePianoGuys", name: "The Piano Guys" },
    { url: "https://www.facebook.com/lindseystirlingmusic", name: "Lindsey Stirling" },
    { url: "https://www.facebook.com/studioctv", name: "Studio C" }
  ],

  // Only reels whose owners allow embedding will play (the opera warm-up reel does not).
  reels: [],

  artists: [
    "VOCES8", "Chanticleer", "The King's Singers", "The Swingles", "Apollo5", "The Gesualdo Six", "Tenebrae",
    "The Sixteen", "Conspirare", "Seraphic Fire", "The Tallis Scholars", "Stile Antico", "The Crossing",
    "Los Angeles Master Chorale", "The Tabernacle Choir at Temple Square", "Choir of King's College, Cambridge",
    "Monteverdi Choir", "Trio Mediaeval", "Anonymous 4", "Cappella Romana", "Lorelei Ensemble", "Skylark Vocal Ensemble",
    "Phoenix Chorale", "Eric Whitacre Singers", "Ola Gjeilo", "Elaine Hagenberg", "Jake Runestad",
    "Pentatonix", "Voctave", "VoicePlay", "Home Free", "Straight No Chaser", "Peter Hollens", "Take 6",
    "Naturally 7", "The Real Group", "Rajaton", "Ladysmith Black Mambazo", "Sweet Honey in the Rock",
    "Bobby McFerrin", "Jacob Collier", "BYU Vocal Point", "BYU Noteworthy", "The Manhattan Transfer",
    "New York Voices", "Samara Joy", "The Piano Guys", "Lindsey Stirling", "Westminster Chorus", "Roomful of Teeth"
  ],

  /* Memes: images live in the memes/ folder. "note" adds a short "music behind the meme" line.
     "lessons" ties a meme to Measure Up lessons so it shows up around the time students learn that idea. */
  memes: [
    { file: "brass-my-time-has-come.webp", caption: "Brass players when they see ffff 🎺", lessons: ["d1","bd1","e2"], note: "<b>ffff</b> means louder than fortissimo! The <b>&gt;</b> marks are accents, and <b>tr~~~</b> is a trill: rapidly alternating between two neighboring notes." },
    { file: "paganini-is-dead.webp", caption: "Violinists know 😭", lessons: ["r3","br2"], note: "Niccolò Paganini (1782–1840) was a violin superstar. His music is packed with fast sixteenth-note runs. The little numbers above the notes are <b>fingerings</b>." },
    { file: "new-napping-spot.webp", caption: "Orchestra room after lunch", lessons: [] },
    { file: "chopin-messing-with-you.webp", caption: "Chopin: 😇 … then 😈", lessons: ["r5","br5","i8","bi8"], note: "<b>Lento</b> means slow. <b>Allegro con brio</b> means fast and with fire. The <b>8va</b> line above the notes means play them an octave higher." },
    { file: "its-all-coming-together.webp", caption: "That first time all four parts click 🥹", lessons: ["hm2","bhm2","hm1"], note: "That’s <b>harmony</b>: each section sings a different note of the chord at the same time. Learn your part, then listen for how it fits." },
    { file: "choir-michael-scott.webp", caption: "Which one are you? 😂", lessons: [], note: "Voice parts from highest to lowest: <b>soprano, mezzo-soprano, alto</b> (treble voices) and <b>tenor, baritone, bass</b>." },
    { file: "every-choir-has-one.webp", caption: "Silence is part of the music too 🤫", lessons: ["e4","be4"], note: "Hold still until the conductor lowers their hands. The final chord needs time to ring. A <b>fermata</b> or <b>caesura</b> (//) means the silence matters." },
    { file: "descant-or-lost.webp", caption: "Sopranos, are we okay? 👀", lessons: [], note: "A <b>descant</b> is a separate, higher melody sung above the main tune, often by sopranos on the last verse." },
    { file: "tenor-bass-baritones.webp", caption: "Baritones, we see you 💚", lessons: [], note: "<b>Baritone</b> sits between tenor and bass, and it’s the most common adult male voice type." },
    { file: "choir-spongebob.webp", caption: "Choir sections, explained 🧽", lessons: [] },
    { file: "choir-starter-pack.webp", caption: "Choir starter pack 🎼", lessons: ["erm","berm"], note: "<b>D.S. al Coda</b>: go back to the sign (segno), then jump to the <b>Coda</b> when you see “To Coda.”" },
    { file: "non-choir-kids.webp", caption: "Choir kids have the best inside jokes", lessons: [] },
    { file: "forgot-music-share.webp", caption: "We’ve all been there 😅", lessons: [], note: "Sharing tip: hold the folder up and out so you can see the conductor over the top." },
    { file: "tenors-tempo.webp", caption: "Tempo, tenors! TEMPO! ⏱️", lessons: ["r5","br5"], note: "<b>Dragging</b> means falling behind the beat; <b>rushing</b> means getting ahead. Watch the conductor’s beat pattern to stay together." },
    { file: "what-i-look-at-pie.webp", caption: "Be honest 📊", lessons: [], note: "Watch the conductor! Most choir mystery problems (entrances, cutoffs, tempo) are solved by looking up." },
    { file: "conducting-along.webp", caption: "“Studying” with classical music 🎻", lessons: ["rm1","brm1"], note: "Conductors show the beat with patterns. In 4/4 it’s <b>down – in – out – up</b>. Try conducting along!" },
    { file: "cat-listening.webp", caption: "Me listening to music 🐱", lessons: [] },
    { file: "musician-not-stressful.webp", caption: "Perfectly normal musician life", lessons: [] },
    { file: "normal-vs-pianists.webp", caption: "Pianist budgeting 🎹", lessons: [], note: "A concert grand piano has 88 keys and about 230 strings." },
    { file: "rachmaninoff-paw.webp", caption: "Rachmaninoff’s hands were built different 🖐️", lessons: ["i6","bi2"], note: "Sergei Rachmaninoff had famously huge hands; he could reportedly stretch a 13th on the keyboard. That’s why his chords are so wide!" },
    { file: "giving-these-bars-everything.webp", caption: "Giving it 110% 😂", lessons: ["nks","bn2","r1"], note: "That <b>4</b> over a long bar is a <b>multi-measure rest</b>: rest for 4 whole measures. And 7 sharps is <b>C♯ major</b>, where every note is sharp!" },
    { file: "most-songs-4-4.webp", caption: "Technically correct 🧮", lessons: ["rm1","brm1"], note: "<b>4/4</b> means 4 beats per measure, and the quarter note gets the beat. It’s also called <b>common time</b>." },
    { file: "three-four-six-eight.webp", caption: "Math says same. Musicians say NO.", lessons: ["rm1","brm1"], note: "Same fraction, different feel! <b>3/4</b> = 3 beats (ONE-two-three). <b>6/8</b> = 2 big beats, each split in three (ONE-two-three FOUR-five-six). 3/4 is <b>simple</b> meter; 6/8 is <b>compound</b>." },
    { file: "composers-treble-clefs.webp", caption: "Even Mozart’s treble clef was messy ✍️", lessons: ["nt2","bnc1"], note: "The treble clef is a fancy letter <b>G</b>. Its curl wraps around the G line, the 2nd line from the bottom." },
    { file: "flight-of-bumblebee.webp", caption: "Pest control 🐝", lessons: ["ss6","bs4"], note: "Rimsky-Korsakov’s <b>Flight of the Bumblebee</b> is famous for nonstop fast <b>chromatic</b> runs: almost all half steps!" },
    { file: "car-horns-c-e-g.webp", caption: "Honestly though 🚗🎶", lessons: ["hm1","bhm1"], note: "C, E and G make a <b>C major triad</b> (do – mi – sol). Any combination of those notes would sound good together." },
    { file: "should-you-practice.webp", caption: "The answer is always yes", lessons: [] },
    { file: "practice-practice.webp", caption: "The secret is out 🤫", lessons: [] },
    { file: "practice-social-life.webp", caption: "Worth it though 🎵", lessons: [] },
    { file: "bars-180-181.webp", caption: "Why does this happen?! 😩", lessons: [], note: "Pro tip: when you join two practiced bars, practice the <b>seam</b>: the last beat of one bar into the first beat of the next." }
  ],

  // Share of the feed that is learning posts (Measure Up lessons, games, quick checks). 0.6 = 60%.
  learningShare: 0.6,
  measureUpUrl: "https://measure-up-ou22.onrender.com/",

  block: []
};
