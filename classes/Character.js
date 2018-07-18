class Character {
  constructor(userId) {
    this._userId = userId;
  }

  get userId(){
    return this._userId;
  }

  set strength(strength){
    this._strength = strength;
    this._str = this.determineModifier(this._strength);
  }

  set dexterity(dexterity){
    this._dexterity = dexterity;
    this._dex = this.determineModifier(this._dexterity);
  }

  set constitution(constitution){
    this._constitution = constitution;
    this._con = this.determineModifier(this._constitution);
  }

  set wisdom(wisdom){
    this._wisdom = wisdom;
    this._wis = this.determineModifier(this._wisdom);
  }

  set intelligence(intelligence){
    this._intelligence =  intelligence;
    this._int = this.determineModifier(this._intelligence);
  }

  set charisma(charisma) {
    this._charisma = charisma;
    this._cha = this.determineModifier(this._charisma);
  }

  get strength(){
    return this._strength;
  }

  get dexterity(){
    return this._dexterity;
  }

  get constitution(){
    return this._constitution;
  }

  get wisdom(){
    return this._wisdom;
  }

  get intelligence(){
    return this._intelligence;
  }

  get charisma(){
    return this._charisma;
  }

  get str(){
    return this._str;
  }

  get dex(){
    return this._dex;
  }

  get con(){
    return this._con;
  }

  get wis(){
    return this._wis;
  }

  get intMod(){
    return this._int;
  }

  get cha(){
    return this._cha;
  }

  determineModifier(score){
    if(score ===  18){
      return 3;
    }else if(score >= 16) {
      return 2;
    }else if(score >= 13){
      return 1;
    }else if(score >= 9){
      return 0;
    }else if(score >= 6){
      return -1;
    }else if(score >= 4){
      return -2;
    } else {
      return -3;
    }
  }
}

module.exports = Character;
