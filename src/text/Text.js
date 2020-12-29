import TextLeafNode from "./TextLeafNode";
import TextNode from "./TextNode";

export default class Text extends TextLeafNode {

    static fromJson(json) {
        return new Text(json);
    }

    constructor(text) {
        super();
        if (!text && text !== "") {
            throw new Error("Missing text");
        }
        if (typeof text !== "string") {
            throw new Error("Expected string got " + text);
        }
        this.text = text;
    }

    typeName() {
        return TextNode.TEXT;
    }

    value() {
        return this.text;
    }

    accept(textNodeVisitor) {
        textNodeVisitor.visitText(this);
    }

    render() {
        return this.value();
    }

    equals(other) {
        return this === other ||
            (other instanceof Text &&
                this.value() === other.value());
    }
}