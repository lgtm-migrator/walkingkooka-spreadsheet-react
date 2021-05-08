import Preconditions from "../Preconditions.js";
import SystemObject from "../SystemObject.js";

const SEPARATOR = ",";
const TYPE_NAME = "spreadsheet-coordinates";

/**
 * Coordinates within a spreadsheet.
 */
export default class SpreadsheetCoordinates extends SystemObject {

    static fromJson(json) {
        return SpreadsheetCoordinates.parse(json);
    }

    static parse(text) {
        Preconditions.requireNonEmptyText(text, "text");
        let tokens = text.split(SEPARATOR);
        if(2 !== tokens.length){
            throw new Error("Expected 2 tokens got " + text);
        }

        return new SpreadsheetCoordinates(Number(tokens[0]), Number(tokens[1]));
    }

    constructor(x, y) {
        super();

        if(typeof (x) !== "number"){
            throw new Error("Expected number x got " + x);
        }
        if(x < 0){
            throw new Error("Expected x >= 0 got " + x);
        }
        this.xValue = x;

        if(typeof (y) !== "number"){
            throw new Error("Expected number y got " + y);
        }
        if(y < 0){
            throw new Error("Expected y >= 0 got " + y);
        }
        this.yValue = y;
    }

    x() {
        return this.xValue;
    }

    y() {
        return this.yValue;
    }

    toJson() {
        return this.toString();
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return this === other ||
            (other instanceof SpreadsheetCoordinates &&
                this.x() === other.x() &&
                this.y() === other.y());
    }

    toString() {
        return doubleToString(this.x()) + SEPARATOR + doubleToString(this.y());
    }
}

function doubleToString(number) {
    const toString = number.toString();
    return toString.endsWith(".0") ?
        toString.substring(0, toString.length() - 2) :
        toString;
}

SystemObject.register(TYPE_NAME, SpreadsheetCoordinates.fromJson);