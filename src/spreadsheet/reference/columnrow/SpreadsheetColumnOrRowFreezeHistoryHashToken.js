import SpreadsheetColumnOrRowHistoryHashToken from "./SpreadsheetColumnOrRowHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../../history/SpreadsheetHistoryHashTokens.js";
import viewportSelectionSelectHistoryHashToken from "../../history/viewportSelectionSelectHistoryHashToken.js";

/**
 * Represents a command to freeze one or more columns or rows.
 */
export default class SpreadsheetColumnOrRowFreezeHistoryHashToken extends SpreadsheetColumnOrRowHistoryHashToken {

    historyHashPath() {
        return super.historyHashPath() +
            "/" +
            SpreadsheetHistoryHashTokens.FREEZE;
    }

    /**
     * Handles history hash token evens such as /column/A/freeze or /column/A:C/freeze
     */
    spreadsheetViewportWidgetExecute(viewportWidget, previousViewportSelection, viewportCell, width, height) {
        const viewportSelection = this.viewportSelection();

        viewportWidget.freezeSelection(
            viewportSelection
        );

        return SpreadsheetHistoryHashTokens.viewportSelection(
            viewportSelectionSelectHistoryHashToken(
                viewportSelection
            )
        );
    }
}