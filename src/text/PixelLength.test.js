import PixelLength from "./PixelLength";
import systemObjectTesting from "../SystemObjectTesting.js";

function length() {
    return PixelLength.parse("1px");
}

systemObjectTesting(
    length(),
    new PixelLength("999px"),
    PixelLength.fromJson,
    "Missing text",
    "pixel-length",
    "1px"
);

test("parse null fails", () => {
    expect(() => PixelLength.parse(null)).toThrow("Missing text");
});

test("parse non string fails", () => {
    expect(() => PixelLength.parse(true)).toThrow("Expected string got true");
});

test("parse missing px fails", () => {
    expect(() => PixelLength.parse("123")).toThrow("Expected string ending with \"px\" got 123");
});

test("parse invalid value fails", () => {
    expect(() => PixelLength.parse("invalidpx")).toThrow("Expected number \"px\" got invalidpx");
});

test("create", () => {
    check(PixelLength.parse("123px"), 123);
});

// equals...............................................................................................................

test("equals equivalent true", () => {
    const value = 2;
    const l = new PixelLength(value);
    expect(l.equals(new PixelLength(value))).toBeTrue();
});

// helpers..............................................................................................................

function check(pixel, value) {
    expect(pixel.value()).toStrictEqual(value);

    const json = value + "px";
    expect(pixel.toJson()).toStrictEqual(json);
    expect(pixel.toString()).toStrictEqual(json);

    expect(PixelLength.fromJson(pixel.toJson())).toStrictEqual(pixel);
}
