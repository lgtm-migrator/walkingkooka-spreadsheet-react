import SpreadsheetCell from "../SpreadsheetCell";
import SpreadsheetDelta from "./SpreadsheetDelta";
import SpreadsheetRange from "../reference/SpreadsheetRange";
import SpreadsheetColumnReference from "../reference/SpreadsheetColumnReference";
import SpreadsheetRowReference from "../reference/SpreadsheetRowReference";
import ImmutableMap from "../../util/ImmutableMap";

function a1() {
    return SpreadsheetCell.fromJson({
        "A1": {
            formula: {
                text: "1+2",
                error: "Custom error #1"
            }
        }
    });
}

function b2() {
    return SpreadsheetCell.fromJson({
        "B2": {
            formula: {
                text: "3+4",
                error: "Custom error #2"
            }
        }
    });
}

function cells() {
    return [a1(), b2()];
}

function maxColumnWidths() {
    return ImmutableMap.fromJson({
        "A": 100,
    },
        SpreadsheetColumnReference.parse,
        (v) => v);
}

function maxRowHeights() {
    return ImmutableMap.fromJson({
            "1": 20,
        },
        SpreadsheetRowReference.parse,
        (v) => v);
}

function window() {
    return [
        SpreadsheetRange.fromJson("A1:B2"),
        SpreadsheetRange.fromJson("C3:D4")
    ]
}

const windowJson = "A1:B2,C3:D4";

// tests................................................................................................................

test("create without cells fails", () => {
    const c = undefined;
    const mcw = maxColumnWidths();
    const mrh = maxRowHeights();
    const w = window();

    expect(() => new SpreadsheetDelta(c, mcw, mrh, w)).toThrow("Missing cells");
});

test("create with cell non array fails", () => {
    const c = "!invalid";
    const mcw = maxColumnWidths();
    const mrh = maxRowHeights();
    const w = window();

    expect(() => new SpreadsheetDelta(c, mcw, mrh, w)).toThrow("Expected array cells got !invalid");
});

test("create without maxColumnWidths fails", () => {
    const c = cells();
    const mcw = undefined;
    const mrh = maxRowHeights();
    const w = window();

    expect(() => new SpreadsheetDelta(c, mcw, mrh, w)).toThrow("Missing maxColumnWidths");
});

test("create with maxColumnWidths non object fails", () => {
    const c = cells();
    const mcw = "!invalid";
    const mrh = maxRowHeights();
    const w = window();

    expect(() => new SpreadsheetDelta(c, mcw, mrh, w)).toThrow("Expected ImmutableMap maxColumnWidths got !invalid");
});

test("create without maxRowHeights fails", () => {
    const c = cells();
    const mcw = maxColumnWidths();
    const mrh = undefined;
    const w = window();

    expect(() => new SpreadsheetDelta(c, mcw, mrh, w)).toThrow("Missing maxRowHeights");
});

test("create with maxRowHeights non object fails", () => {
    const c = cells();
    const mcw = maxColumnWidths();
    const mrh = "!invalid";
    const w = window();

    expect(() => new SpreadsheetDelta(c, mcw, mrh, w)).toThrow("Expected ImmutableMap maxRowHeights got !invalid");
});

test("create", () => {
    const c = cells();
    const mcw = maxColumnWidths();
    const mrh = maxRowHeights();
    const w = window();

    check(new SpreadsheetDelta(c, mcw, mrh, w),
        c,
        mcw,
        mrh,
        w,
        {
            cells: {
                "A1": {
                    formula: {
                        text: "1+2",
                        error: "Custom error #1"
                    }
                },
                "B2": {
                    formula: {
                        text: "3+4",
                        error: "Custom error #2"
                    }
                }
            },
            maxColumnWidths: {
                "A": 100
            },
            maxRowHeights: {
                "1": 20
            },
            window: windowJson
        });
});

test("create empty", () => {
    const c = [];
    const mcw = ImmutableMap.EMPTY;
    const mrh = ImmutableMap.EMPTY;
    const w = [];

    check(new SpreadsheetDelta(c, mcw, mrh, w),
        c,
        mcw,
        mrh,
        w,
        {});
});

// toJson...............................................................................................................

test("toJson only 1 cell", () => {
    const c = [a1()];
    const mcw = ImmutableMap.EMPTY;
    const mrh = ImmutableMap.EMPTY;
    const w = [];

    expect(new SpreadsheetDelta(c, mcw, mrh, w).toJson())
        .toStrictEqual({
            cells: {
                "A1": {
                    formula: {
                        text: "1+2",
                        error: "Custom error #1"
                    }
                }
            }
        });
});

test("toJson only 2 cells", () => {
    const c = cells();
    const mcw = ImmutableMap.EMPTY;
    const mrh = ImmutableMap.EMPTY;
    const w = [];

    expect(new SpreadsheetDelta(c, mcw, mrh, w).toJson())
        .toStrictEqual({
            "cells": {
                "A1": {
                    formula: {
                        text: "1+2",
                        error: "Custom error #1"
                    }
                },
                "B2": {
                    formula: {
                        text: "3+4",
                        error: "Custom error #2"
                    }
                },
            }
        });
});

test("toJson all properties", () => {
    const c = cells();
    const mcw = maxColumnWidths();
    const mrh = maxRowHeights();
    const w = window();

    expect(new SpreadsheetDelta(c, mcw, mrh, w).toJson())
        .toStrictEqual({
            "cells": {
                "A1": {
                    formula: {
                        text: "1+2",
                        error: "Custom error #1"
                    }
                },
                "B2": {
                    formula: {
                        text: "3+4",
                        error: "Custom error #2"
                    }
                },
            },
            maxColumnWidths: {
                "A": 100
            },
            maxRowHeights: {
                "1": 20
            },
            window: windowJson
        });
});

// fromJson.............................................................................................................
test("fromJson null fails", () => {
    expect(() => SpreadsheetDelta.fromJson(null)).toThrow("Missing json");
});

test("fromJson empty", () => {
    const c = [];
    const mcw = ImmutableMap.EMPTY;
    const mrh = ImmutableMap.EMPTY;
    const w = [];

    expect(SpreadsheetDelta.fromJson({})).toStrictEqual(new SpreadsheetDelta(c, mcw, mrh, w));
});

test("fromJson 1 cell", () => {
    const c = [a1()];
    const mcw = ImmutableMap.EMPTY;
    const mrh = ImmutableMap.EMPTY;
    const w = [];

    expect(SpreadsheetDelta.fromJson({
        cells: {
            "A1": {
                formula: {
                    text: "1+2",
                    error: "Custom error #1"
                }
            }
        }
    })).toStrictEqual(new SpreadsheetDelta(c, mcw, mrh, w));
});

test("fromJson 2 cells", () => {
    const c = [a1(), b2()];
    const mcw = ImmutableMap.EMPTY;
    const mrh = ImmutableMap.EMPTY;
    const w = [];

    expect(SpreadsheetDelta.fromJson({
        cells: {
            "A1": {
                formula: {
                    text: "1+2",
                    error: "Custom error #1"
                }
            },
            "B2": {
                formula: {
                    text: "3+4",
                    error: "Custom error #2"
                }
            }
        }
    })).toStrictEqual(new SpreadsheetDelta(c, mcw, mrh, w));
});

test("fromJson all properties", () => {
    const c = cells();
    const mcw = maxColumnWidths();
    const mrh = maxRowHeights();
    const w = window();

    expect(SpreadsheetDelta.fromJson({
        cells: {
            "A1": {
                formula: {
                    text: "1+2",
                    error: "Custom error #1"
                }
            },
            "B2": {
                formula: {
                    text: "3+4",
                    error: "Custom error #2"
                }
            }
        },
        maxColumnWidths: {
            "A": 100
        },
        maxRowHeights: {
            "1": 20
        },
        window: windowJson
    })).toStrictEqual(new SpreadsheetDelta(c, mcw, mrh, w));
});

// helpers..............................................................................................................

function check(delta, cells, maxColumnWidths, maxRowHeights, window, json) {
    expect(delta.cells()).toStrictEqual(cells);
    expect(delta.maxColumnWidths()).toStrictEqual(maxColumnWidths);
    expect(delta.maxRowHeights()).toStrictEqual(maxRowHeights);
    expect(delta.window()).toStrictEqual(window);

    expect(delta.toJson()).toStrictEqual(json);
    expect(delta.toString()).toBe(JSON.stringify(json));

    expect(SpreadsheetDelta.fromJson(delta.toJson())).toStrictEqual(delta);
}
