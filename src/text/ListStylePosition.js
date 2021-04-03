// generated by EnumJavaScriptSourceTool at 2021-04-03T13:17:12.647787

import SystemEnum from "../SystemEnum.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "list-style-position";

export default class ListStylePosition extends SystemEnum {
  
  static INSIDE = new ListStylePosition("INSIDE");
  static OUTSIDE = new ListStylePosition("OUTSIDE");
  
  static values() {
    return [
      ListStylePosition.INSIDE,
      ListStylePosition.OUTSIDE
    ];
  }
  
  static valueOf(name) {
    return SystemEnum.valueOf(name, ListStylePosition.values());
  }
  
  static fromJson(name) {
    return ListStylePosition.valueOf(name);
  }
  
  typeName() {
    return TYPE_NAME;
  }
}

SystemObject.register(TYPE_NAME, ListStylePosition.fromJson);
