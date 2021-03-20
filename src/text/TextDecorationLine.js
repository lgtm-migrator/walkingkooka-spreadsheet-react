import SystemEnum from "../SystemEnum.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "text-decoration-line";

export default class TextDecorationLine extends SystemEnum {

  static NONE = new TextDecorationLine("NONE");
  static UNDERLINE = new TextDecorationLine("UNDERLINE");
  static OVERLINE = new TextDecorationLine("OVERLINE");
  static LINE_THROUGH = new TextDecorationLine("LINE_THROUGH");
  
  static values() {
    return [
      TextDecorationLine.NONE,
      TextDecorationLine.UNDERLINE,
      TextDecorationLine.OVERLINE,
      TextDecorationLine.LINE_THROUGH
    ];
  }
  
  static valueOf(name) {
    return SystemEnum.valueOf(name, TextDecorationLine.values());
  }
  
  static fromJson(name) {
    return TextDecorationLine.valueOf(name);
  }
  
  constructor(name) {
    super(name);
  }
  
  typeName() {
    return TYPE_NAME;
  }
  
}

SystemObject.register(TYPE_NAME, TextDecorationLine.fromJson);
