import Length from "./Length";

/**
 * Holds a pixel length value.
 */
export default class PixelLength extends Length {

    static fromJson(json) {
        return PixelLength.parse(json);
    }

    static parse(text) {
        if (!text) {
            throw new Error("Missing text");
        }
        if (typeof text != "string") {
            throw new Error("Expected string got " + text);
        }
        if (!(text.endsWith("px"))) {
            throw new Error("Expected string ending with \"px\" got " + text);
        }

        const value = Number(text.substring(0, text.length - 2));
        if (Number.isNaN(value)) {
            throw new Error("Expected number \"px\" got " + text);
        }
        return new PixelLength(value);
    }

    constructor(value) {
        super();
        this.valueValue = value;
    }

    value() {
        return this.valueValue;
    }

    toString() {
        return this.value() + "px";
    }
}