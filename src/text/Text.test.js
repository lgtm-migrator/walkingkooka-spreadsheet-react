import Text from "./Text";
import TextStyle from "./TextStyle";
import React from "react";
import textNodeJsonSupportFromJson from "./TextNodeJsonSupport";

const textValue = "text-123-abc";

function text() {
    return new Text(textValue);
}

test("create without text fails", () => {
    expect(() => new Text(null)).toThrow("Missing text");
});

test("create with non string fails", () => {
    expect(() => new Text(1.5)).toThrow("Expected string got 1.5");
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
    expect(t.equals()).toBe(false);
});

test("equals null false", () => {
    const t = text();
    expect(t.equals(null)).toBe(false);
});

test("equals self true", () => {
    const t = text();
    expect(t.equals(t)).toBe(true);
});

test("equals different false", () => {
    const t = text();
    expect(t.equals(new Text("different-text"))).toBe(false);
});

test("equals equivalent true", () => {
    const value = "text-2";
    const t = new Text(value);
    expect(t.equals(new Text(value))).toBe(true);
});

// helpers..............................................................................................................

function check(text, json) {
    expect(text.styles()).toStrictEqual(TextStyle.EMPTY);
    expect(text.toJson()).toStrictEqual(json);
    expect(text.toString()).toBe(JSON.stringify(json));
    expect(textNodeJsonSupportFromJson(text.toJson())).toStrictEqual(text);
}
