import SpreadsheetColumnOrRowHistoryHashToken from "./SpreadsheetColumnOrRowHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../../history/SpreadsheetHistoryHashTokens.js";

/**
 * Represents a column/row delete history hash token.
 */
export default class SpreadsheetColumnOrRowDeleteHistoryHashToken extends SpreadsheetColumnOrRowHistoryHashToken {

    historyHashPath() {
        return super.historyHashPath() +
            "/" +
            SpreadsheetHistoryHashTokens.DELETE;
    }

    /**
     * Handles history hash token evens such as /column/A/delete or /column/B:C/delete
     */
    spreadsheetViewportWidgetExecute(viewportWidget, previousViewportSelection, viewportCell, width, height) {
        const viewportSelection = this.viewportSelection();

        if(!this.equals(previousViewportSelection)) {
            viewportWidget.deleteSelection(
                viewportSelection
            );
        }

        return SpreadsheetHistoryHashTokens.viewportSelection(null);
    }
}