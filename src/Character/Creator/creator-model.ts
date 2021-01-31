export class CharacterCreatorModel {
  public firstName: string;
  public lastName: string;

  public gender: boolean;

  public father: number;
  public mother: number;

  public shapeMix: number;
  public skinMix: number;

  public torso: number;
  public top: number;
  public legs: number;
  public shoes: number;

  public faceFeatures: number[];

  public blemishes: number;
  public ageing: number;
  public complexion: number;
  public sunDamage: number;
  public freckles: number;

  public hair: number;
  public hairColor: number;
  public hairHighLight: number;

  public eyesColor: number;

  public facialHair: number;
  public facialHairColor: number;
  public facialHairSecondaryColor: number;

  public eyeBrows: number;
  public eyeBrowsColor: number;
  public eyeBrowsSecondaryColor: number;

  public chestHair: number;
  public chestHairColor: number;
  public chestHairSecondaryColor: number;

  constructor() {
    this.firstName = '';
    this.lastName = '';
    this.gender = true;
    this.father = 0;
    this.mother = 0;
    this.shapeMix = 0.0;
    this.skinMix = 0.0;
    this.torso = 0;
    this.top = 0;
    this.legs = 0;
    this.shoes = 0;
    this.faceFeatures = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
    this.blemishes = 0;
    this.ageing = 0;
    this.complexion = 0;
    this.sunDamage = 0;
    this.freckles = 0;
    this.hair = 0;
    this.hairColor = 0;
    this.hairHighLight = 0;
    this.eyesColor = 0;
    this.facialHair = 0;
    this.facialHairColor = 0;
    this.facialHairSecondaryColor = 0;
    this.eyeBrows = 0;
    this.eyeBrowsColor = 0;
    this.eyeBrowsSecondaryColor = 0;
    this.chestHair = 0;
    this.chestHairColor = 0;
    this.chestHairSecondaryColor = 0;
  }
}