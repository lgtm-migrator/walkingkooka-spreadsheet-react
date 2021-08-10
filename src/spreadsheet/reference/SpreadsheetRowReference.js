import CharSequences from "../../CharSequences.js";
import Keys from "../../Keys.js";
import Preconditions from "../../Preconditions.js";
import SpreadObject from "../../SystemObject.js";
import SpreadsheetCellReference from "./SpreadsheetCellReference.js";
import SpreadsheetColumnOrRowReference from "./SpreadsheetColumnOrRowReference";
import SpreadsheetColumnReference from "./SpreadsheetColumnReference.js";
import SpreadsheetHistoryHash from "../history/SpreadsheetHistoryHash.js";
import SpreadsheetReferenceKind from "./SpreadsheetReferenceKind";
import SpreadsheetRowReferenceRange from "./SpreadsheetRowReferenceRange.js";
import SpreadsheetSelection from "./SpreadsheetSelection.js";

const TYPE_NAME = "spreadsheet-row-reference";

export default class SpreadsheetRowReference extends SpreadsheetColumnOrRowReference {

    static MAX = 1048576;

    static fromJson(json) {
        return SpreadsheetRowReference.parse(json);
    }

    static parse(text) {
        Preconditions.requireText(text, "text");

        let kind;
        let startIndex;

        if(text.startsWith("$")){
            kind = SpreadsheetReferenceKind.ABSOLUTE;
            startIndex = 1;
        }else {
            kind = SpreadsheetReferenceKind.RELATIVE;
            startIndex = 0;
        }

        const length = text.length;
        for(var i = startIndex; i < length; i++) {
            const c = text.charAt(i);
            if(c < '0' || c > '9'){
                SpreadsheetSelection.reportInvalidCharacter(c, i);
            }
        }

        const value = Number(text.substring(startIndex));
        if(!value){
            throw new Error("Missing row got " + CharSequences.quoteAndEscape(text));
        }
        if(value > SpreadsheetRowReference.MAX){
            throw new Error("Invalid value " + value + " > " + SpreadsheetRowReference.MAX);
        }

        return new SpreadsheetRowReference(value - 1, kind);
    }

    max() {
        return SpreadsheetRowReference.MAX;
    }

    setColumn(column) {
        return new SpreadsheetCellReference(column, this);
    }

    extendRangeLeft() {
        return this;
    }

    extendRangeRight() {
        return this;
    }

    extendRangeUp() {
        return new SpreadsheetRowReferenceRange(
            this.addSaturated(-1),
            this
        ).rowOrRange();
    }

    extendRangeDown() {
        return new SpreadsheetRowReferenceRange(
            this,
            this.addSaturated(+1),
        ).rowOrRange();
    }

    testCell(cellReference) {
        Preconditions.requireInstance(cellReference, SpreadsheetCellReference, "cellReference");

        return this.value() === cellReference.row().value();
    }

    testColumn(columnReference) {
        Preconditions.requireInstance(columnReference, SpreadsheetColumnReference, "columnReference");

        return false;
    }

    testRow(rowReference) {
        Preconditions.requireInstance(rowReference, SpreadsheetRowReference, "rowReference");

        return this.value() === rowReference.value();
    }

    toQueryStringParameterSelectionType() {
        return "row";
    }

    viewportId() {
        return "viewport-row-" + this.toString().toUpperCase();
    }

    toSelectionHashToken() {
        return SpreadsheetHistoryHash.ROW + "/" + this;
    }

    /**
     * UP/DOWN Arrow keys update the row selection, RIGHT selects the first visible cell or ESC clears the current selection.
     */
    onViewportKeyDown(key, setSelection, giveFormulaFocus, viewportHome) {
        switch(key) {
            case Keys.ARROW_UP:
                setSelection(this.addSaturated(-1));
                break;
            case Keys.ARROW_DOWN:
                setSelection(this.addSaturated(+1));
                break;
            case Keys.ARROW_RIGHT:
                setSelection(viewportHome.setRow(this));
                break;
            case Keys.ESCAPE:
                setSelection(null);
                break;
            default:
                // ignore other keys
                break;
        }
    }

    typeName() {
        return TYPE_NAME;
    }

    toJson() {
        return this.kind().prefix() + (1 + this.value());
    }
}

SpreadObject.register(TYPE_NAME, SpreadsheetRowReference.fromJson);