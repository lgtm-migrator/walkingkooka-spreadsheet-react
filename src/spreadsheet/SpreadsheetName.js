/**
 * Holds a spreadsheet name, no validation is performed on the text
 */
import Preconditions from "../Preconditions.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "spreadsheet-name";

export default class SpreadsheetName extends SystemObject {

    static fromJson(value) {
        return SpreadsheetName.parse(value);
    }

    static parse(text) {
        return new SpreadsheetName(text);
    }

    constructor(value) {
        super();
        Preconditions.requireText(value, "value");
        this.valueValue = value;
    }

    value() {
        return this.valueValue;
    }

    toJson() {
        return this.value();
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetName && this.value() === other.value());
    }

    toString() {
        return this.value();
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetName.fromJson);