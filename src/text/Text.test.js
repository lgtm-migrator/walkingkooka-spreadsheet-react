import textNodeJsonSupportFromJson from "./TextNodeJsonSupport";
import React from "react";
import Text from "./Text";
import TextStyle from "./TextStyle";

const textValue = "text-123-abc";

function text() {
    return new Text(textValue);
}

test("create without text fails", () => {
    expect(() => new Text(null)).toThrow("Missing text");
});

test("create with non string fails", () => {
    expect(() => new Text(1.5)).toThrow("Expected string text got 1.5");
});

test("create empty string", () => {
    const value = "";
    const text = new Text(value);
    expect(text.value()).toBe(value);
});

test("create non empty string", () => {
    const text = new Text(textValue);
    expect(text.value()).toBe(textValue);
});

// render...............................................................................................................

test("render", () => {
    expect(new Text(textValue)
        .render())
        .toStrictEqual(textValue);
});

// toJson...............................................................................................................

test("toJson", () => {
    const text = new Text(textValue);

    check(text, {type: "text", value: textValue});
});

// equals...............................................................................................................

test("equals undefined false", () => {
    const t = text();
    expect(t.equals()).toBeFalse();
});

test("equals null false", () => {
    const t = text();
    expect(t.equals(null)).toBeFalse();
});

test("equals self true", () => {
    const t = text();
    expect(t.equals(t)).toBeTrue();
});

test("equals different false", () => {
    const t = text();
    expect(t.equals(new Text("different-text"))).toBeFalse();
});

test("equals equivalent true", () => {
    const value = "text-2";
    const t = new Text(value);
    expect(t.equals(new Text(value))).toBeTrue();
});

// helpers..............................................................................................................

function check(text, json) {
    expect(text.styles()).toStrictEqual(TextStyle.EMPTY);
    expect(text.toJson()).toStrictEqual(json);
    expect(text.toString()).toBe(JSON.stringify(json));
    expect(textNodeJsonSupportFromJson(text.toJson())).toStrictEqual(text);
}
