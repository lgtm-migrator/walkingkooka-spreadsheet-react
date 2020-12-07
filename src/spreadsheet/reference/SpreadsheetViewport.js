/**
 * A pixel rectangle marks a region with one or more cells.
 */
import SpreadsheetCellReference from "./SpreadsheetCellReference";
import SpreadsheetRectangle from "./SpreadsheetRectangle";

const SEPARATOR = ":";

export default class SpreadsheetViewport extends SpreadsheetRectangle {

    static fromJson(json) {
        return SpreadsheetViewport.parse(json);
    }

    static parse(text) {
        if (!text) {
            throw new Error("Missing text");
        }
        if (typeof text !== "string") {
            throw new Error("Expected string got " + text);
        }

        let tokens = text.split(SEPARATOR);
        if (3 !== tokens.length) {
            throw new Error("Expected 3 tokens got " + text);
        }

        return new SpreadsheetViewport(
            SpreadsheetCellReference.parse(tokens[0]),
            Number(tokens[1]),
            Number(tokens[2])
        );
    }

    constructor(reference, width, height) {
        super();

        if (!reference) {
            throw new Error("Missing reference");
        }
        if (!(reference instanceof SpreadsheetCellReference)) {
            throw new Error("Expected SpreadsheetCellReference reference got " + reference);
        }
        this.referenceValue = reference.toRelative();

        if (typeof (width) !== "number") {
            throw new Error("Expected number width got " + width);
        }
        if (width <= 0) {
            throw new Error("Expected width > 0 got " + width);
        }
        this.widthValue = width;

        if (typeof (height) !== "number") {
            throw new Error("Expected number height got " + height);
        }
        if (height <= 0) {
            throw new Error("Expected height > 0 got " + height);
        }
        this.heightValue = height;
    }

    reference() {
        return this.referenceValue;
    }

    width() {
        return this.widthValue;
    }

    height() {
        return this.heightValue;
    }

    toJson() {
        return this.reference() + SEPARATOR + this.width() + SEPARATOR + this.height();
    }

    equals(other) {
        return this === other ||
            (other instanceof SpreadsheetViewport &&
                this.reference().equals(other.reference()) &&
                this.width() === other.width() &&
                this.height() === other.height());
    }

    toString() {
        return this.toJson();
    }
}