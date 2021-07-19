import Equality from "../../Equality.js";
import ImmutableMap from "../../util/ImmutableMap";
import Preconditions from "../../Preconditions.js";
import SpreadsheetCell from "../SpreadsheetCell";
import SpreadsheetCellReferenceOrLabelName from "../reference/SpreadsheetCellReferenceOrLabelName.js";
import SpreadsheetColumnReference from "../reference/SpreadsheetColumnReference";
import SpreadsheetLabelMapping from "../reference/SpreadsheetLabelMapping.js";
import SpreadsheetLabelName from "../reference/SpreadsheetLabelName.js";
import SpreadsheetRange from "../reference/SpreadsheetRange";
import SpreadsheetRowReference from "../reference/SpreadsheetRowReference";
import SystemObject from "../../SystemObject.js";

/**
 * A function used by fromJson to verify number column widths and row heights
 */
const NUMBER = (value) => {
    Preconditions.requireNumber(value, "value");
    return value;
}

const TYPE_NAME = "spreadsheet-delta";

/**
 * Holds cells and window that have been updated following one or more cells being saved/updated
 */
export default class SpreadsheetDelta extends SystemObject {

    static fromJson(json) {
        Preconditions.requireObject(json, "json");

        let cells = [];
        for(const referenceToValues of Object.entries(json.cells || {})) {
            let reference = {};
            reference[referenceToValues[0]] = referenceToValues[1];

            cells.push(SpreadsheetCell.fromJson(reference));
        }

        const labels = json.labels ?
            json.labels.map(m => {
                return SpreadsheetLabelMapping.fromJson(m)
            }) :
            [];

        const maxColumnWidths = ImmutableMap.fromJson(json.maxColumnWidths || {}, SpreadsheetColumnReference.fromJson, NUMBER);
        const maxRowHeights = ImmutableMap.fromJson(json.maxRowHeights || {}, SpreadsheetRowReference.fromJson, NUMBER);
        const windowJson = json["window"];

        return new SpreadsheetDelta(
            cells,
            labels,
            maxColumnWidths,
            maxRowHeights,
            (windowJson && windowJson.split(",").map(r => SpreadsheetRange.fromJson(r))) || []);
    }

    constructor(cells, labels, maxColumnWidths, maxRowHeights, window) {
        super();
        Preconditions.requireArray(cells, "cells");
        Preconditions.requireArray(labels, "labels");
        Preconditions.requireInstance(maxColumnWidths, ImmutableMap, "maxColumnWidths");
        Preconditions.requireInstance(maxRowHeights, ImmutableMap, "maxRowHeights");
        Preconditions.requireArray(window, "window");

        this.cellsValue = cells.slice();
        this.labelsValue = labels.slice();
        this.maxColumnWidthsValue = maxColumnWidths;
        this.maxRowHeightsValue = maxRowHeights;
        this.windowValue = window.slice();
    }

    cells() {
        return this.cellsValue.slice();
    }

    /**
     * Returns the {@link SpreadsheetCell} that matches the given cell or label.
     */
    cell(cellOrLabel) {
        Preconditions.requireInstance(cellOrLabel, SpreadsheetCellReferenceOrLabelName, "cellOrLabel");

        const cellReference = cellOrLabel instanceof SpreadsheetLabelName ?
            this.cellReference(cellOrLabel) :
            cellOrLabel;

        return cellReference && this.referenceToCellMap().get(cellReference);
    }

    /**
     * Returns the {@link SpreadsheetCellReference} for the given {@link SpreadsheetLabelName}.
     */
    cellReference(label) {
        Preconditions.requireInstance(label, SpreadsheetLabelName, "label");

        const mapping = this.labels()
            .find(m => m.label().equals(label));
        return mapping &&
            mapping.reference();
    }

    /**
     * Returns an {@link ImmutableMap} where the {@link SpreadsheetCellReference} is the key and the cell the value.
     */
    referenceToCellMap() {
        const referenceToCell = new Map();

        this.cells().forEach(c => {
            referenceToCell.set(c.reference().toString(), c);
        });

        return new ImmutableMap(referenceToCell);
    }

    labels() {
        return this.labelsValue.slice();
    }

    cellToLabels() {
        const cellToLabels = new Map();

        this.labels()
            .forEach(m => {
                const key = m.reference().toString();
                var labels = cellToLabels.get(key);
                if(null == labels){
                    labels = [];
                    cellToLabels.set(key, labels);
                }
                labels.push(m.label());
            });

        return new ImmutableMap(cellToLabels);
    }

    maxColumnWidths() {
        return this.maxColumnWidthsValue;
    }

    maxRowHeights() {
        return this.maxRowHeightsValue;
    }

    window() {
        return this.windowValue.slice();
    }

    /**
     * <pre>
     * {
     *   "cells": {
     *     "A1": {
     *       "formula": {
     *         "text": "1"
     *       }
     *     },
     *     "B2": {
     *       "formula": {
     *         "text": "2"
     *        }
     *     }
     *    },
     *    "maxColumnWidths": {
     *      "A": 150
     *    },
     *    "maxRowHeights": {
     *      "1": 75
     *    },
     *    "window": "B9:300:50"
     * }
     * </pre>
     */
    toJson() {
        let json = {};

        const cellsArray = this.cells();
        if(cellsArray.length > 0){
            json.cells = Object.assign({}, ...cellsArray.map(c => c.toJson()));
        }

        const labels = this.labels();
        if(labels.length > 0){
            json.labels = labels.map(l => l.toJson());
        }

        const maxColumnWidths = this.maxColumnWidths();
        if(maxColumnWidths.size() > 0){
            json.maxColumnWidths = maxColumnWidths.toJson();
        }

        const maxRowHeights = this.maxRowHeights();
        if(maxRowHeights.size() > 0){
            json.maxRowHeights = maxRowHeights.toJson();
        }

        const window = this.window();
        if(window.length > 0){
            json.window = window.map(w => w.toJson()).join(",");
        }
        return json;
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return this === other ||
            (other instanceof SpreadsheetDelta &&
                Equality.safeEquals(this.cells(), other.cells()) &&
                Equality.safeEquals(this.labels(), other.labels()) &&
                this.maxColumnWidths().equals(other.maxColumnWidths()) &&
                this.maxRowHeights().equals(other.maxRowHeights()) &&
                Equality.safeEquals(this.window(), other.window())
            );
    }

    toString() {
        return JSON.stringify(this.toJson());
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetDelta.fromJson);