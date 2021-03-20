/**
 * Used to create a new instance and then the given style and value.
 */
import PixelLength from "./PixelLength";
import SystemObject from "../SystemObject.js";

function copyAndSet(styles, style, value) {
    let copy = new TextStyle(styles);
    copy.styles[style] = value;
    return copy;
}

/**
 * Used to create a new instance and then remove the given style.
 */
function copyAndRemove(styles, style) {
    let copy = new TextStyle(styles);
    delete copy.styles[style];
    return copy;
}

function fromPixel(text) {
    return text && PixelLength.parse(text);
}

const TYPE_NAME = "text-style";

/**
 * Holds many style properties and values.
 */
// TODO validate style and value.
export default class TextStyle extends SystemObject {

    static EMPTY = new TextStyle({});

    // generated by TextStylePropertyNameConstantJavaScriptSourceTool
    static BACKGROUND_COLOR = "background-color";
    static BORDER_BOTTOM_COLOR = "border-bottom-color";
    static BORDER_BOTTOM_STYLE = "border-bottom-style";
    static BORDER_BOTTOM_WIDTH = "border-bottom-width";
    static BORDER_COLLAPSE = "border-collapse";
    static BORDER_LEFT_COLOR = "border-left-color";
    static BORDER_LEFT_STYLE = "border-left-style";
    static BORDER_LEFT_WIDTH = "border-left-width";
    static BORDER_RIGHT_COLOR = "border-right-color";
    static BORDER_RIGHT_STYLE = "border-right-style";
    static BORDER_RIGHT_WIDTH = "border-right-width";
    static BORDER_SPACING = "border-spacing";
    static BORDER_TOP_COLOR = "border-top-color";
    static BORDER_TOP_STYLE = "border-top-style";
    static BORDER_TOP_WIDTH = "border-top-width";
    static COLOR = "color";
    static FONT_FAMILY = "font-family";
    static FONT_KERNING = "font-kerning";
    static FONT_SIZE = "font-size";
    static FONT_STRETCH = "font-stretch";
    static FONT_STYLE = "font-style";
    static FONT_VARIANT = "font-variant";
    static FONT_WEIGHT = "font-weight";
    static HANGING_PUNCTUATION = "hanging-punctuation";
    static HEIGHT = "height";
    static HYPHENS = "hyphens";
    static LETTER_SPACING = "letter-spacing";
    static LINE_HEIGHT = "line-height";
    static LIST_STYLE_POSITION = "list-style-position";
    static LIST_STYLE_TYPE = "list-style-type";
    static MARGIN_BOTTOM = "margin-bottom";
    static MARGIN_LEFT = "margin-left";
    static MARGIN_RIGHT = "margin-right";
    static MARGIN_TOP = "margin-top";
    static MAX_HEIGHT = "max-height";
    static MAX_WIDTH = "max-width";
    static MIN_HEIGHT = "min-height";
    static MIN_WIDTH = "min-width";
    static OPACITY = "opacity";
    static OUTLINE_COLOR = "outline-color";
    static OUTLINE_OFFSET = "outline-offset";
    static OUTLINE_STYLE = "outline-style";
    static OUTLINE_WIDTH = "outline-width";
    static OVERFLOW_X = "overflow-x";
    static OVERFLOW_Y = "overflow-y";
    static PADDING_BOTTOM = "padding-bottom";
    static PADDING_LEFT = "padding-left";
    static PADDING_RIGHT = "padding-right";
    static PADDING_TOP = "padding-top";
    static TAB_SIZE = "tab-size";
    static TEXT = "text";
    static TEXT_ALIGN = "text-align";
    static TEXT_DECORATION_COLOR = "text-decoration-color";
    static TEXT_DECORATION_LINE = "text-decoration-line";
    static TEXT_DECORATION_STYLE = "text-decoration-style";
    static TEXT_DECORATION_THICKNESS = "text-decoration-thickness";
    static TEXT_DIRECTION = "text-direction";
    static TEXT_INDENT = "text-indent";
    static TEXT_JUSTIFY = "text-justify";
    static TEXT_OVERFLOW = "text-overflow";
    static TEXT_TRANSFORM = "text-transform";
    static TEXT_WRAPPING = "text-wrapping";
    static VERTICAL_ALIGN = "vertical-align";
    static VISIBILITY = "visibility";
    static WHITE_SPACE = "white-space";
    static WIDTH = "width";
    static WORD_BREAK = "word-break";
    static WORD_SPACING = "word-spacing";
    static WORD_WRAP = "word-wrap";
    static WRITING_MODE = "writing-mode";

    static fromJson(json) {
        return new TextStyle(json);
    }

    constructor(styles) {
        super();
        if(!styles){
            throw new Error("Missing styles");
        }
        if(typeof styles !== "object"){
            throw new Error("Styles expected object got " + styles);
        }
        this.styles = Object.assign({}, styles);
    }

    get(style) {
        return this.styles[style];
    }

    set(style, value) {
        return value === this.get(style) ?
            this :
            copyAndSet(this.styles, style, value);
    }

    remove(style) {
        const value = this.get(style);
        return value ?
            copyAndRemove(this.styles, style) :
            this;
    }

    /**
     * Returns the width as a number removing the px suffix or undefined if absent.
     */
    width() {
        return fromPixel(this.get(TextStyle.WIDTH));
    }

    /**
     * Returns the height as a number removing the px suffix or undefined if absent.
     */
    height() {
        return fromPixel(this.get(TextStyle.HEIGHT));
    }

    /**
     * Merges this style with the entries from the given, this means properties in other will replace any that exist in this.
     */
    merge(style) {
        if(!style){
            throw new Error("Missing style");
        }
        if(!(style instanceof TextStyle)){
            throw new Error("Expected TextStyle style got " + style);
        }

        return style.isEmpty() ?
            this :
            this.isEmpty() ?
                style :
                new TextStyle(Object.assign({}, this.styles, style.styles));
    }

    /**
     * Returns true only if this {@link TextStyle} has no actual entries.
     */
    isEmpty() {
        return Object.keys(this.styles).length === 0;
    }

    /**
     * Produces a JSON object holding the styles with style properties converted from kebab case to camel case.
     */
    toCss() {
        const css = {};

        for(const [key, value] of Object.entries(this.styles)) {
            const components = key.split("-");
            const first = components.shift();

            const camelCase =
                first +
                components.map(c => {
                    return c.charAt(0).toUpperCase() + c.substring(1);
                })
                    .join("");

            var value2;
            switch(first) {
                case "border":
                case "margin":
                case "padding":
                    if(value === "none"){
                        value2 = "0";
                        break;
                    }
                    value2 = value;
                    break;
                default:
                    value2 = value;
                    break;
            }

            css[camelCase] = value2.toString();
        }

        return css;
    }

    /**
     * Returns this metadata as a JSON. Perfect to perform REST api calls.
     */
    toJson() {
        return Object.assign({}, this.styles);
    }

    typeName() {
        return TYPE_NAME;
    }

    accept(textNodeVisitor) {
        textNodeVisitor.visitTextStyle(this);
    }

    equals(other) {
        return this === other || (other instanceof TextStyle && toJsonString(this) === toJsonString(other));
    }

    toString() {
        return JSON.stringify(this.toJson());
    }
}

function toJsonString(textStyle) {
    return JSON.stringify(textStyle.toJson());
}

SystemObject.register(TYPE_NAME, TextStyle.fromJson);