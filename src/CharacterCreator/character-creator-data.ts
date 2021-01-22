export abstract class CharacterCreatorData {
  private static gender: string[];
  private static genderTexts: string[];

  private static fathers: string[];
  private static fatherTexts: string[];

  private static mothers: string[];
  private static motherTexts: string[];

  private static tops: string[][];
  private static topTexts: string[][];

  private static legs: string[][];
  private static legTexts: string[][];

  private static shoes: string[][];
  private static shoeTexts: string[][];

  private static eyesColor: string[];
  private static eyesColorText: string[];

  private static blemishes: string[];
  private static blemishTexts: string[];

  private static facialHair: string[];
  private static facialHairTexts: string[];

  private static ageing: string[];
  private static ageingTexts: string[];

  private static complexion: string[];
  private static complexionTexts: string[];

  private static sunDamage: string[];
  private static sunDamageTexts: string[];

  private static freckles: string[];
  private static freckleTexts: string[];

  private static hairs: string[][];
  private static hairTexts: string[][];

  private static eyeBrows: string[];
  private static eyeBrowTexts: string[];

  private static chestHair: string[];
  private static chestHairTexts: string[];

  private static color: string[];
  private static colorTexts: string[];

  public static Init(): void {
    CharacterCreatorData.hairs = [[], []];
    CharacterCreatorData.hairTexts = [[], []];

    const rawGender = [true, false];
    const rawFathers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 42, 43, 44];
    const rawMothers = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 45];
    const rawEyeColors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

    const rawBlemishes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    const rawFacialHair = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28];
    const rawEyeBrows = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33];
    const rawAgeing = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    const rawComplexion = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const rawSunDamage = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const rawFreckles = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
    const rawChestHair = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

    const rawColors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63];

    const hairList = [
      // female
      [
        { ID: 0, Name: 'Close Shave', Collection: 'mpbeach_overlays', Overlay: 'FM_Hair_Fuzz' },
        { ID: 1, Name: 'Short', Collection: 'multiplayer_overlays', Overlay: 'NG_F_Hair_001' },
        { ID: 2, Name: 'Layered Bob', Collection: 'multiplayer_overlays', Overlay: 'NG_F_Hair_002' },
        { ID: 3, Name: 'Pigtails', Collection: 'multiplayer_overlays', Overlay: 'NG_F_Hair_003' },
        { ID: 4, Name: 'Ponytail', Collection: 'multiplayer_overlays', Overlay: 'NG_F_Hair_004' },
        { ID: 5, Name: 'Braided Mohawk', Collection: 'multiplayer_overlays', Overlay: 'NG_F_Hair_005' },
        { ID: 6, Name: 'Braids', Collection: 'multiplayer_overlays', Overlay: 'NG_F_Hair_006' },
        { ID: 7, Name: 'Bob', Collection: 'multiplayer_overlays', Overlay: 'NG_F_Hair_007' },
        { ID: 8, Name: 'Faux Hawk', Collection: 'multiplayer_overlays', Overlay: 'NG_F_Hair_008' },
        { ID: 9, Name: 'French Twist', Collection: 'multiplayer_overlays', Overlay: 'NG_F_Hair_009' },
        { ID: 10, Name: 'Long Bob', Collection: 'multiplayer_overlays', Overlay: 'NG_F_Hair_010' },
        { ID: 11, Name: 'Loose Tied', Collection: 'multiplayer_overlays', Overlay: 'NG_F_Hair_011' },
        { ID: 12, Name: 'Pixie', Collection: 'multiplayer_overlays', Overlay: 'NG_F_Hair_012' },
        { ID: 13, Name: 'Shaved Bangs', Collection: 'multiplayer_overlays', Overlay: 'NG_F_Hair_013' },
        { ID: 14, Name: 'Top Knot', Collection: 'multiplayer_overlays', Overlay: 'NG_M_Hair_014' },
        { ID: 15, Name: 'Wavy Bob', Collection: 'multiplayer_overlays', Overlay: 'NG_M_Hair_015' },
        { ID: 16, Name: 'Messy Bun', Collection: 'multiplayer_overlays', Overlay: 'NGBea_F_Hair_000' },
        { ID: 17, Name: 'Pin Up Girl', Collection: 'multiplayer_overlays', Overlay: 'NGBea_F_Hair_001' },
        { ID: 18, Name: 'Tight Bun', Collection: 'multiplayer_overlays', Overlay: 'NG_F_Hair_007' },
        { ID: 19, Name: 'Twisted Bob', Collection: 'multiplayer_overlays', Overlay: 'NGBus_F_Hair_000' },
        { ID: 20, Name: 'Flapper Bob', Collection: 'multiplayer_overlays', Overlay: 'NGBus_F_Hair_001' },
        { ID: 21, Name: 'Big Bangs', Collection: 'multiplayer_overlays', Overlay: 'NGBea_F_Hair_001' },
        { ID: 22, Name: 'Braided Top Knot', Collection: 'multiplayer_overlays', Overlay: 'NGHip_F_Hair_000' },
        { ID: 23, Name: 'Mullet', Collection: 'multiplayer_overlays', Overlay: 'NGInd_F_Hair_000' },
        { ID: 25, Name: 'Pinched Cornrows', Collection: 'mplowrider_overlays', Overlay: 'LR_F_Hair_000' },
        { ID: 26, Name: 'Leaf Cornrows', Collection: 'mplowrider_overlays', Overlay: 'LR_F_Hair_001' },
        { ID: 27, Name: 'Zig Zag Cornrows', Collection: 'mplowrider_overlays', Overlay: 'LR_F_Hair_002' },
        { ID: 28, Name: 'Pigtail Bangs', Collection: 'mplowrider2_overlays', Overlay: 'LR_F_Hair_003' },
        { ID: 29, Name: 'Wave Braids', Collection: 'mplowrider2_overlays', Overlay: 'LR_F_Hair_003' },
        { ID: 30, Name: 'Coil Braids', Collection: 'mplowrider2_overlays', Overlay: 'LR_F_Hair_004' },
        { ID: 31, Name: 'Rolled Quiff', Collection: 'mplowrider2_overlays', Overlay: 'LR_F_Hair_006' },
        { ID: 32, Name: 'Loose Swept Back', Collection: 'mpbiker_overlays', Overlay: 'MP_Biker_Hair_000_F' },
        { ID: 33, Name: 'Undercut Swept Back', Collection: 'mpbiker_overlays', Overlay: 'MP_Biker_Hair_001_F' },
        { ID: 34, Name: 'Undercut Swept Side', Collection: 'mpbiker_overlays', Overlay: 'MP_Biker_Hair_002_F' },
        { ID: 35, Name: 'Spiked Mohawk', Collection: 'mpbiker_overlays', Overlay: 'MP_Biker_Hair_003_F' },
        { ID: 36, Name: 'Bandana and Braid', Collection: 'multiplayer_overlays', Overlay: 'NG_F_Hair_003' },
        { ID: 37, Name: 'Layered Mod', Collection: 'mpbiker_overlays', Overlay: 'MP_Biker_Hair_006_F' },
        { ID: 38, Name: 'Skinbyrd', Collection: 'mpbiker_overlays', Overlay: 'MP_Biker_Hair_004_F' },
        { ID: 76, Name: 'Neat Bun', Collection: 'mpgunrunning_overlays', Overlay: 'MP_Gunrunning_Hair_F_000_F' },
        { ID: 77, Name: 'Short Bob', Collection: 'mpgunrunning_overlays', Overlay: 'MP_Gunrunning_Hair_F_001_F' }
      ],
      // male
      [
        { ID: 0, Name: 'Close Shave', Collection: 'mpbeach_overlays', Overlay: 'FM_Hair_Fuzz' },
        { ID: 1, Name: 'Buzzcut', Collection: 'multiplayer_overlays', Overlay: 'NG_M_Hair_001' },
        { ID: 2, Name: 'Faux Hawk', Collection: 'multiplayer_overlays', Overlay: 'NG_M_Hair_002' },
        { ID: 3, Name: 'Hipster', Collection: 'multiplayer_overlays', Overlay: 'NG_M_Hair_003' },
        { ID: 4, Name: 'Side Parting', Collection: 'multiplayer_overlays', Overlay: 'NG_M_Hair_004' },
        { ID: 5, Name: 'Shorter Cut', Collection: 'multiplayer_overlays', Overlay: 'NG_M_Hair_005' },
        { ID: 6, Name: 'Biker', Collection: 'multiplayer_overlays', Overlay: 'NG_M_Hair_006' },
        { ID: 7, Name: 'Ponytail', Collection: 'multiplayer_overlays', Overlay: 'NG_M_Hair_007' },
        { ID: 8, Name: 'Cornrows', Collection: 'multiplayer_overlays', Overlay: 'NG_M_Hair_008' },
        { ID: 9, Name: 'Slicked', Collection: 'multiplayer_overlays', Overlay: 'NG_M_Hair_009' },
        { ID: 10, Name: 'Short Brushed', Collection: 'multiplayer_overlays', Overlay: 'NG_M_Hair_013' },
        { ID: 11, Name: 'Spikey', Collection: 'multiplayer_overlays', Overlay: 'NG_M_Hair_002' },
        { ID: 12, Name: 'Caesar', Collection: 'multiplayer_overlays', Overlay: 'NG_M_Hair_011' },
        { ID: 13, Name: 'Chopped', Collection: 'multiplayer_overlays', Overlay: 'NG_M_Hair_012' },
        { ID: 14, Name: 'Dreads', Collection: 'multiplayer_overlays', Overlay: 'NG_M_Hair_014' },
        { ID: 15, Name: 'Long Hair', Collection: 'multiplayer_overlays', Overlay: 'NG_M_Hair_015' },
        { ID: 16, Name: 'Shaggy Curls', Collection: 'multiplayer_overlays', Overlay: 'NGBea_M_Hair_000' },
        { ID: 17, Name: 'Surfer Dude', Collection: 'multiplayer_overlays', Overlay: 'NGBea_M_Hair_001' },
        { ID: 18, Name: 'Short Side Part', Collection: 'multiplayer_overlays', Overlay: 'NGBus_M_Hair_000' },
        { ID: 19, Name: 'High Slicked Sides', Collection: 'multiplayer_overlays', Overlay: 'NGBus_M_Hair_001' },
        { ID: 20, Name: 'Long Slicked', Collection: 'multiplayer_overlays', Overlay: 'NGHip_M_Hair_000' },
        { ID: 21, Name: 'Hipster Youth', Collection: 'multiplayer_overlays', Overlay: 'NGHip_M_Hair_001' },
        { ID: 22, Name: 'Mullet', Collection: 'multiplayer_overlays', Overlay: 'NGInd_M_Hair_000' },
        { ID: 24, Name: 'Classic Cornrows', Collection: 'mplowrider_overlays', Overlay: 'LR_M_Hair_000' },
        { ID: 25, Name: 'Palm Cornrows', Collection: 'mplowrider_overlays', Overlay: 'LR_M_Hair_001' },
        { ID: 26, Name: 'Lightning Cornrows', Collection: 'mplowrider_overlays', Overlay: 'LR_M_Hair_002' },
        { ID: 27, Name: 'Whipped Cornrows', Collection: 'mplowrider_overlays', Overlay: 'LR_M_Hair_003' },
        { ID: 28, Name: 'Zig Zag Cornrows', Collection: 'mplowrider2_overlays', Overlay: 'LR_M_Hair_004' },
        { ID: 29, Name: 'Snail Cornrows', Collection: 'mplowrider2_overlays', Overlay: 'LR_M_Hair_005' },
        { ID: 30, Name: 'Hightop', Collection: 'mplowrider2_overlays', Overlay: 'LR_M_Hair_006' },
        { ID: 31, Name: 'Loose Swept Back', Collection: 'mpbiker_overlays', Overlay: 'MP_Biker_Hair_000_M' },
        { ID: 32, Name: 'Undercut Swept Back', Collection: 'mpbiker_overlays', Overlay: 'MP_Biker_Hair_001_M' },
        { ID: 33, Name: 'Undercut Swept Side', Collection: 'mpbiker_overlays', Overlay: 'MP_Biker_Hair_002_M' },
        { ID: 34, Name: 'Spiked Mohawk', Collection: 'mpbiker_overlays', Overlay: 'MP_Biker_Hair_003_M' },
        { ID: 35, Name: 'Mod', Collection: 'mpbiker_overlays', Overlay: 'MP_Biker_Hair_004_M' },
        { ID: 36, Name: 'Layered Mod', Collection: 'mpbiker_overlays', Overlay: 'MP_Biker_Hair_005_M' },
        { ID: 72, Name: 'Flattop', Collection: 'mpgunrunning_overlays', Overlay: 'MP_Gunrunning_Hair_M_000_M' },
        { ID: 73, Name: 'Military Buzzcut', Collection: 'mpgunrunning_overlays', Overlay: 'MP_Gunrunning_Hair_M_001_M' }
      ]
    ];

    CharacterCreatorData.gender = rawGender.map((g) => String(g));
    CharacterCreatorData.genderTexts = ['Мужской', 'Женский'];

    CharacterCreatorData.fathers = rawFathers.map((f) => f.toString());
    CharacterCreatorData.mothers = rawMothers.map((m) => m.toString());

    CharacterCreatorData.fatherTexts = ['Benjamin', 'Daniel', 'Joshua', 'Noah', 'Andrew', 'Juan', 'Alex', 'Isaac', 'Evan', 'Ethan', 'Vincent', 'Angel', 'Diego', 'Adrian', 'Gabriel', 'Michael', 'Santiago', 'Kevin', 'Louis', 'Samuel', 'Anthony', 'Claude', 'Niko', 'John'];
    CharacterCreatorData.motherTexts = ['Hannah', 'Aubrey', 'Jasmine', 'Gisele', 'Amelia', 'Isabella', 'Zoe', 'Ava', 'Camila', 'Violet', 'Sophia', 'Evelyn', 'Nicole', 'Ashley', 'Gracie', 'Brianna', 'Natalie', 'Olivia', 'Elizabeth', 'Charlotte', 'Emma', 'Misty'];

    CharacterCreatorData.tops = [['49', '45', '26'], ['146', '111', '241']];
    CharacterCreatorData.topTexts = [['Футболка', 'Кофта', 'Блузка'], ['Футболка', 'Водолазка', 'Рубашка Поло']];

    CharacterCreatorData.legs = [['4', '8', '25'], ['1', '9', '6']];
    CharacterCreatorData.legTexts = [['Джинсы', 'Юбка', 'Шорты'], ['Джинсы', 'Джоггеры', 'Шорты']];

    CharacterCreatorData.shoes = [['3', '33', '101'], ['1', '26', '97']];
    CharacterCreatorData.shoeTexts = [['Кеды', 'Сникеры', 'Ботинки'], ['Кеды', 'Сникеры', 'Ботинки']];

    CharacterCreatorData.hairs[0] = hairList[0].map((hl) => hl.ID.toString());
    CharacterCreatorData.hairs[1] = hairList[1].map((hl) => hl.ID.toString());
    CharacterCreatorData.hairTexts[0] = hairList[0].map((hl) => hl.Name.toString());
    CharacterCreatorData.hairTexts[1] = hairList[1].map((hl) => hl.Name.toString());

    CharacterCreatorData.eyesColor = rawEyeColors.map((ec) => ec.toString());
    CharacterCreatorData.eyesColorText = ['Green', 'Emerald', 'Light Blue', 'Ocean Blue', 'Light Brown', 'Dark Brown', 'Hazel', 'Dark Gray', 'Light Gray', 'Pink', 'Yellow', 'Purple', 'Blackout', 'Shades of Gray', 'Tequila Sunrise', 'Atomic', 'Warp', 'ECola', 'Space Ranger', 'Ying Yang', 'Bullseye', 'Lizard', 'Dragon', 'Extra Terrestrial', 'Goat', 'Smiley', 'Possessed', 'Demon', 'Infected', 'Alien', 'Undead', 'Zombie'];

    CharacterCreatorData.blemishes = rawBlemishes.map((b) => b.toString());
    CharacterCreatorData.blemishTexts = ["Measles", "Pimples", "Spots", "Break Out", "Blackheads", "Build Up", "Pustules", "Zits", "Full Acne", "Acne", "Cheek Rash", "Face Rash", "Picker", "Puberty", "Eyesore", "Chin Rash", "Two Face", "T Zone", "Greasy", "Marked", "Acne Scarring", "Full Acne Scarring", "Cold Sores", "Impetigo"];

    CharacterCreatorData.facialHair = rawFacialHair.map((fh) => fh.toString());
    CharacterCreatorData.facialHairTexts = ["Light Stubble", "Бальбо", "Circle Beard", "Goatee", "Chin", "Chin Fuzz", "Pencil Chin Strap", "Scruffy", "Musketeer", "Mustache", "Trimmed Beard", "Stubble", "Thin Circle Beard", "Horseshoe", "Pencil and Chops", "Chin Strap Beard", "Balbo and Sideburns", "Mutton Chops", "Scruffy Beard", "Curly", "Curly & Deep Stranger", "Handlebar", "Faustic", "Otto & Patch", "Otto & Full Stranger", "Light Franz", "The Hampstead", "The Ambrose", "Lincoln Curtain"];

    CharacterCreatorData.eyeBrows = rawEyeBrows.map((eb) => eb.toString());
    CharacterCreatorData.eyeBrowTexts = ["Balanced", "Fashion", "Cleopatra", "Quizzical", "Femme", "Seductive", "Pinched", "Chola", "Triomphe", "Carefree", "Curvaceous", "Rodent", "Double Tram", "Thin", "Penciled", "Mother Plucker", "Straight and Narrow", "Natural", "Fuzzy", "Unkempt", "Caterpillar", "Regular", "Mediterranean", "Groomed", "Bushels", "Feathered", "Prickly", "Monobrow", "Winged", "Triple Tram", "Arched Tram", "Cutouts", "Fade Away", "Solo Tram"];

    CharacterCreatorData.ageing = rawAgeing.map((a) => a.toString());
    CharacterCreatorData.ageingTexts = ["Crow's Feet", "First Signs", "Middle Aged", "Worry Lines", "Depression", "Distinguished", "Aged", "Weathered", "Wrinkled", "Sagging", "Tough Life", "Vintage", "Retired", "Junkie", "Geriatric"];

    CharacterCreatorData.complexion = rawComplexion.map((c) => c.toString());
    CharacterCreatorData.complexionTexts = ["Rosy Cheeks", "Stubble Rash", "Hot Flush", "Sunburn", "Bruised", "Alchoholic", "Patchy", "Totem", "Blood Vessels", "Damaged", "Pale", "Ghostly"];

    CharacterCreatorData.sunDamage = rawSunDamage.map((sd) => sd.toString());
    CharacterCreatorData.sunDamageTexts = ["Uneven", "Sandpaper", "Patchy", "Rough", "Leathery", "Textured", "Coarse", "Rugged", "Creased", "Cracked", "Gritty"];

    CharacterCreatorData.freckles = rawFreckles.map((f) => f.toString());
    CharacterCreatorData.freckleTexts = ["Cherub", "All Over", "Irregular", "Dot Dash", "Over the Bridge", "Baby Doll", "Pixie", "Sun Kissed", "Beauty Marks", "Line Up", "Modelesque", "Occasional", "Speckled", "Rain Drops", "Double Dip", "One Sided", "Pairs", "Growth"];

    CharacterCreatorData.chestHair = rawChestHair.map((ch) => ch.toString());
    CharacterCreatorData.chestHairTexts = ["Natural", "The Strip", "The Tree", "Hairy", "Grisly", "Ape", "Groomed Ape", "Bikini", "Lightning Bolt", "Reverse Lightning", "Love Heart", "Chestache", "Happy Face", "Skull", "Snail Trail", "Slug and Nips", "Hairy Arms"];

    CharacterCreatorData.color = rawColors.map((c) => c.toString());
    CharacterCreatorData.colorTexts = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64'];
  }

  //public static ResetValues()

  public static GetValuesByInputName(inputName: string, genderNumber: number): string[] {
    switch (inputName) {
      case 'gender':
        return CharacterCreatorData.gender;
      case 'father':
        return CharacterCreatorData.fathers;
      case 'mother':
        return CharacterCreatorData.mothers;
      case 'hair':
        return CharacterCreatorData.hairs[genderNumber];
      case 'top':
        return CharacterCreatorData.tops[genderNumber];
      case 'legs':
        return CharacterCreatorData.legs[genderNumber];
      case 'shoes':
        return CharacterCreatorData.shoes[genderNumber];
      case 'eyesColor':
        return CharacterCreatorData.eyesColor;
      case 'blemishes':
        return CharacterCreatorData.blemishes;
      case 'beard':
        return CharacterCreatorData.facialHair;
      case 'eyeBrows':
        return CharacterCreatorData.eyeBrows;
      case 'ageing':
        return CharacterCreatorData.ageing;
      case 'complexion':
        return CharacterCreatorData.complexion;
      case 'sunDamage':
        return CharacterCreatorData.sunDamage;
      case 'freckles':
        return CharacterCreatorData.freckles;
      case 'chestHair':
        return CharacterCreatorData.chestHair;
      case 'hairColor':
      case 'hairHighLight':
      case 'eyeBrowsColor':
      case 'eyeBrowsSecondaryColor':
      case 'beardColor':
      case 'beardSecondaryColor':
      case 'chestHairColor':
      case 'chestHairSecondaryColor':
        return CharacterCreatorData.color;
      default:
        return [];
    }
  }

  public static GetTextsByInputName(inputName: string, genderNumber: number): string[] {
    switch (inputName) {
      case 'gender':
        return CharacterCreatorData.genderTexts;
      case 'father':
        return CharacterCreatorData.fatherTexts;
      case 'mother':
        return CharacterCreatorData.motherTexts;
      case 'hair':
        return CharacterCreatorData.hairTexts[genderNumber];
      case 'top':
        return CharacterCreatorData.topTexts[genderNumber];
      case 'legs':
        return CharacterCreatorData.legTexts[genderNumber];
      case 'shoes':
        return CharacterCreatorData.shoeTexts[genderNumber];
      case 'eyesColor':
        return CharacterCreatorData.eyesColorText;
      case 'blemishes':
        return CharacterCreatorData.blemishTexts;
      case 'beard':
        return CharacterCreatorData.facialHairTexts;
      case 'eyeBrows':
        return CharacterCreatorData.eyeBrowTexts;
      case 'ageing':
        return CharacterCreatorData.ageingTexts;
      case 'complexion':
        return CharacterCreatorData.complexionTexts;
      case 'sunDamage':
        return CharacterCreatorData.sunDamageTexts;
      case 'freckles':
        return CharacterCreatorData.freckleTexts;
      case 'chestHair':
        return CharacterCreatorData.chestHairTexts;
      case 'hairColor':
      case 'hairHighLight':
      case 'eyeBrowsColor':
      case 'eyeBrowsSecondaryColor':
      case 'beardColor':
      case 'beardSecondaryColor':
      case 'chestHairColor':
      case 'chestHairSecondaryColor':
        return CharacterCreatorData.colorTexts;
      default:
        return [];
    }
  }
};

CharacterCreatorData.Init();
