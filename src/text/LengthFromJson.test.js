import LengthFromJson from "./LengthFromJson.js";
import NoneLength from "./NoneLength.js";
import PixelLength from "./PixelLength";

test("fromJson null fails", () => {
    expect(() => LengthFromJson(null)).toThrow("Missing text");
});

test("fromJson non string fails", () => {
    expect(() => LengthFromJson(true)).toThrow("Expected string got true");
});

test("fromJson missing px fails", () => {
    expect(() => LengthFromJson("123")).toThrow("Expected string ending with \"px\" got 123");
});

test("fromJson invalid value fails", () => {
    expect(() => LengthFromJson("invalidpx")).toThrow("Expected number \"px\" got invalidpx");
});

test("fromJson None", () => {
    expect(LengthFromJson("None")).toStrictEqual(NoneLength.INSTANCE);
});

test("fromJson 123px", () => {
    expect(LengthFromJson("123px")).toStrictEqual(new PixelLength(123));
});
