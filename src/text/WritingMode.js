// generated by EnumJavaScriptSourceTool at 2022-03-15T20:45:07.312039

import SystemEnum from "../SystemEnum.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "writing-mode";

export default class WritingMode extends SystemEnum {
  
  static HORIZONTAL_TB = new WritingMode("HORIZONTAL_TB");
  static VERTICAL_RL = new WritingMode("VERTICAL_RL");
  static VERTICAL_LR = new WritingMode("VERTICAL_LR");
  
  static values() {
    return [
      WritingMode.HORIZONTAL_TB,
      WritingMode.VERTICAL_RL,
      WritingMode.VERTICAL_LR
    ];
  }
  
  static valueOf(name) {
    return SystemEnum.valueOf(name, "textStyle", WritingMode.values());
  }
  
  static fromJson(name) {
    return WritingMode.valueOf(name);
  }
  
  typeName() {
    return TYPE_NAME;
  }
}

SystemObject.register(TYPE_NAME, WritingMode.fromJson);
