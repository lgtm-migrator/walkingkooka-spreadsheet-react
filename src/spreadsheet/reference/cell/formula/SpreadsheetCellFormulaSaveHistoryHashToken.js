import Preconditions from "../../../../Preconditions.js";
import SpreadsheetCellFormulaEditHistoryHashToken from "./SpreadsheetCellFormulaEditHistoryHashToken.js";
import SpreadsheetCellFormulaHistoryHashToken from "./SpreadsheetCellFormulaHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../../../history/SpreadsheetHistoryHashTokens.js";
import viewportSelectionSelectHistoryHashToken from "../../../history/viewportSelectionSelectHistoryHashToken.js";

/**
 * A history hash token that saves the given formula text for the current cell.
 */
export default class SpreadsheetCellFormulaSaveHistoryHashToken extends SpreadsheetCellFormulaHistoryHashToken {

    constructor(viewportSelection, formulaText) {
        super(viewportSelection);

        this.formulaTextValue = Preconditions.requireText(formulaText, "formulaText");
    }

    formulaText() {
        return this.formulaTextValue;
    }

    // cell/A1/formula/save/=1+2
    historyHashPath() {
        return super.historyHashPath() +
            "/" +
            SpreadsheetHistoryHashTokens.CELL_FORMULA +
            "/" +
            SpreadsheetHistoryHashTokens.SAVE +
            "/" +
            encodeURIComponent(this.formulaText());
    }

    // previousViewportSelection ignored
    spreadsheetFormulaWidgetExecute(formulaWidget, previousViewportSelection) {
        const viewportSelection = this.viewportSelection();

        formulaWidget.patchFormula(
            viewportSelection.selection(),
            this.formulaText(),
        );

        return formulaWidget.isFocused() ?
            SpreadsheetHistoryHashTokens.viewportSelection(
                new SpreadsheetCellFormulaEditHistoryHashToken(viewportSelection)
            ) :
            null != previousViewportSelection ?
                SpreadsheetHistoryHashTokens.viewportSelection(
                    viewportSelectionSelectHistoryHashToken(viewportSelection)
                ) :
                null;
    }

    equals(other) {
        return super.equals(other) &&
            this.formulaText() === other.formulaText();
    }
}