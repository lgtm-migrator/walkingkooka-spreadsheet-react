import SystemObject from "../../SystemObject.js";

export default class SpreadsheetReferenceKind extends SystemObject {

    static ABSOLUTE = new SpreadsheetReferenceKind("ABSOLUTE");
    static RELATIVE = new SpreadsheetReferenceKind("RELATIVE");

    static values() {
        return [
            SpreadsheetReferenceKind.ABSOLUTE,
            SpreadsheetReferenceKind.RELATIVE,
        ];
    }

    static of(text) {
        if(!text){
            throw new Error("Missing text");
        }

        switch(text) {
            case "ABSOLUTE":
                return SpreadsheetReferenceKind.ABSOLUTE;
            case "RELATIVE":
                return SpreadsheetReferenceKind.RELATIVE;
            default:
                throw new Error("Unknown text: " + text);
        }
    }

    constructor(name) {
        super();
        this.name = name;
    }

    prefix() {
        return SpreadsheetReferenceKind.ABSOLUTE === this ?
            "$" :
            "";
    }

    equals(other) {
        return this === other;
    }

    toJson() {
        return this.name;
    }

    toString() {
        return this.name;
    }
}