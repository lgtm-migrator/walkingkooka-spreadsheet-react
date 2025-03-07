// generated by EnumJavaScriptSourceTool at 2022-03-15T22:52:02.56619

import SystemEnum from "../../../SystemEnum.js";
import SystemObject from "../../../SystemObject.js";

const TYPE_NAME = "spreadsheet-viewport-selection-navigation";

export default class SpreadsheetViewportSelectionNavigation extends SystemEnum {
  
  static LEFT = new SpreadsheetViewportSelectionNavigation("LEFT");
  static UP = new SpreadsheetViewportSelectionNavigation("UP");
  static RIGHT = new SpreadsheetViewportSelectionNavigation("RIGHT");
  static DOWN = new SpreadsheetViewportSelectionNavigation("DOWN");
  static EXTEND_LEFT = new SpreadsheetViewportSelectionNavigation("EXTEND_LEFT");
  static EXTEND_UP = new SpreadsheetViewportSelectionNavigation("EXTEND_UP");
  static EXTEND_RIGHT = new SpreadsheetViewportSelectionNavigation("EXTEND_RIGHT");
  static EXTEND_DOWN = new SpreadsheetViewportSelectionNavigation("EXTEND_DOWN");
  
  static values() {
    return [
      SpreadsheetViewportSelectionNavigation.LEFT,
      SpreadsheetViewportSelectionNavigation.UP,
      SpreadsheetViewportSelectionNavigation.RIGHT,
      SpreadsheetViewportSelectionNavigation.DOWN,
      SpreadsheetViewportSelectionNavigation.EXTEND_LEFT,
      SpreadsheetViewportSelectionNavigation.EXTEND_UP,
      SpreadsheetViewportSelectionNavigation.EXTEND_RIGHT,
      SpreadsheetViewportSelectionNavigation.EXTEND_DOWN
    ];
  }
  
  static valueOf(name) {
    return SystemEnum.valueOf(name, "navigation", SpreadsheetViewportSelectionNavigation.values());
  }
  
  static fromJson(name) {
    return SpreadsheetViewportSelectionNavigation.valueOf(name);
  }
  
  static from(text) {
    return SystemObject.from(text, "navigation", SpreadsheetViewportSelectionNavigation.value());
  }
  
  typeName() {
    return TYPE_NAME;
  }
}

SystemObject.register(TYPE_NAME, SpreadsheetViewportSelectionNavigation.fromJson);
