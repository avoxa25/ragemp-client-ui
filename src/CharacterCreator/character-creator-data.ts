export abstract class CharacterCreatorData {
  private static gender: string[];
  private static genderTexts: string[];

  private static fathers: string[];
  private static fatherTexts: string[];

  private static mothers: string[];
  private static motherTexts: string[];

  public static Init(): void {
    const rawGender = [true, false];
    const rawFathers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 42, 43, 44];
    const rawMothers = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 45];

    CharacterCreatorData.gender = rawGender.map((g) => String(g))
    CharacterCreatorData.genderTexts = ['Мужской', 'Женский'];

    CharacterCreatorData.fathers = rawFathers.map((f) => f.toString());
    CharacterCreatorData.mothers = rawMothers.map((m) => m.toString());

    CharacterCreatorData.fatherTexts = ['Benjamin', 'Daniel', 'Joshua', 'Noah', 'Andrew', 'Juan', 'Alex', 'Isaac', 'Evan', 'Ethan', 'Vincent', 'Angel', 'Diego', 'Adrian', 'Gabriel', 'Michael', 'Santiago', 'Kevin', 'Louis', 'Samuel', 'Anthony', 'Claude', 'Niko', 'John'];
    CharacterCreatorData.motherTexts = ['Hannah', 'Aubrey', 'Jasmine', 'Gisele', 'Amelia', 'Isabella', 'Zoe', 'Ava', 'Camila', 'Violet', 'Sophia', 'Evelyn', 'Nicole', 'Ashley', 'Gracie', 'Brianna', 'Natalie', 'Olivia', 'Elizabeth', 'Charlotte', 'Emma', 'Misty'];
  }

  public static GetValuesByInputName(inputName: string): string[] {
    switch (inputName) {
      case 'gender':
        return CharacterCreatorData.gender;
      case 'father':
        return CharacterCreatorData.fathers;
      case 'mother':
        return CharacterCreatorData.mothers;
      default:
        return [];
    }
  }

  public static GetTextsByInputName(inputName: string): string[] {
    switch (inputName) {
      case 'gender':
        return CharacterCreatorData.genderTexts;
      case 'father':
        return CharacterCreatorData.fatherTexts;
      case 'mother':
        return CharacterCreatorData.motherTexts;
      default:
        return [];
    }
  }
};

CharacterCreatorData.Init();
