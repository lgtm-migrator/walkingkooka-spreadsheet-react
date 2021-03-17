import SystemEnum from "../SystemEnum.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "font-style";

export default class FontStyle extends SystemEnum {

  static NORMAL = new FontStyle("NORMAL");
  static ITALIC = new FontStyle("ITALIC");
  static OBLIQUE = new FontStyle("OBLIQUE");
  
  static values() {
    return [
      FontStyle.NORMAL,
      FontStyle.ITALIC,
      FontStyle.OBLIQUE
    ];
  }
  
  static valueOf(name) {
    return SystemEnum.valueOf(name, FontStyle.values());
  }
  
  static fromJson(name) {
    return FontStyle.valueOf(name);
  }
  
  constructor(name) {
    super(name);
  }
  
  typeName() {
    return TYPE_NAME;
  }
  
}

SystemObject.register(TYPE_NAME, FontStyle.fromJson);
