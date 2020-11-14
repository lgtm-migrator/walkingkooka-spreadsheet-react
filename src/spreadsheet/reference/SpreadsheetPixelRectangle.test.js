import SpreadsheetCellReference from "./SpreadsheetCellReference";
import SpreadsheetPixelRectangle from "./SpreadsheetPixelRectangle";

function reference() {
    return SpreadsheetCellReference.fromJson("A1");
}

function width() {
    return 100;
}

function height() {
    return 20;
}

// reference

test("create without reference fails", () => {
    expect(() => new SpreadsheetPixelRectangle(null, width(), height())).toThrow("Missing reference");
});

test("create invalid reference type fails", () => {
    const reference = "invalid!";
    expect(() => new SpreadsheetPixelRectangle(reference, width(), height())).toThrow("Expected SpreadsheetCellReference reference got " + reference);
});

// width

test("create missing width fails", () => {
    const width = null;
    expect(() => new SpreadsheetPixelRectangle(reference(), width, height())).toThrow("Expected number width got " + width);
});

test("create invalid width type fails", () => {
    const width = "invalid!"
    expect(() => new SpreadsheetPixelRectangle(reference(), width, height())).toThrow("Expected number width got " + width);
});

test("create invalid width value fails", () => {
    const width = 0;
    expect(() => new SpreadsheetPixelRectangle(reference(), width, height())).toThrow("Expected width > 0 got " + width);
});

test("create invalid width value fails2", () => {
    const width = -123;
    expect(() => new SpreadsheetPixelRectangle(reference(), width, height())).toThrow("Expected width > 0 got " + width);
});

// height

test("create missing height fails", () => {
    const height = null;
    expect(() => new SpreadsheetPixelRectangle(reference(), width(), height)).toThrow("Expected number height got " + height);
});

test("create invalid height type fails", () => {
    const height = "invalid!"
    expect(() => new SpreadsheetPixelRectangle(reference(), width(), height)).toThrow("Expected number height got " + height);
});

test("create invalid height value fails", () => {
    const height = 0;
    expect(() => new SpreadsheetPixelRectangle(reference(), width(), height)).toThrow("Expected height > 0 got " + height);
});

test("create invalid height value fails2", () => {
    const height = -123;
    expect(() => new SpreadsheetPixelRectangle(reference(), width(), height)).toThrow("Expected height > 0 got " + height);
});

// json

test("fromJson null fails", () => {
    expect(() => SpreadsheetPixelRectangle.fromJson(null)).toThrow("Missing text");
});

test("json", () => {
    const pixel = new SpreadsheetPixelRectangle(reference(), width(), height());

    check(pixel, reference(), width(), height());
});

// helpers..............................................................................................................

function check(pixel, reference, width, height) {
    expect(pixel.reference()).toStrictEqual(reference);
    expect(pixel.reference()).toBeInstanceOf(SpreadsheetCellReference);

    expect(pixel.width()).toStrictEqual(width);
    expect(pixel.width()).toBeNumber();

    expect(pixel.height()).toStrictEqual(height);
    expect(pixel.height()).toBeNumber();

    const json = reference + ":" + width + ":" + height;
    expect(pixel.toJson()).toStrictEqual(json);
    expect(pixel.toString()).toBe(json);

    expect(SpreadsheetPixelRectangle.parse(json)).toStrictEqual(pixel);
    expect(SpreadsheetPixelRectangle.fromJson(json)).toStrictEqual(pixel);
}