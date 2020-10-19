import Text from "./Text";
import fromJson from "./TextNodeJsonSupport";
import TextStyle from "./TextStyle";

const textValue = "text-123-abc";

test("create without text fails", () => {
    expect(() => new Text(null)).toThrow("text missing");
});

test("create with non string fails", () => {
    expect(() => new Text(1.5)).toThrow("Expected string got 1.5");
});

test("create", () => {
    const text = new Text(textValue);
    expect(text.value()).toBe(textValue);
});

test("json", () => {
    const text = new Text(textValue);

    check(text, {typeName: "text", value: textValue});
});

// helpers..............................................................................................................

function check(text, json) {
    expect(text.styles()).toStrictEqual(TextStyle.EMPTY);
    expect(text.toJson()).toStrictEqual(json);
    expect(text.toString()).toBe(JSON.stringify(json));
    expect(fromJson(text.toJson())).toStrictEqual(text);
}
