import SpreadsheetCellHistoryHashToken from "./SpreadsheetCellHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../../history/SpreadsheetHistoryHashTokens.js";

/**
 * A history hash token that represents a cell or cell-range delete
 */
export default class SpreadsheetCellDeleteHistoryHashToken extends SpreadsheetCellHistoryHashToken {

    historyHashPath() {
        return super.historyHashPath() +
            "/" +
            SpreadsheetHistoryHashTokens.DELETE;
    }

    /**
     * Handles history hash token evens such as /cell/A1/delete or /cell/A1:B2/delete
     */
    spreadsheetViewportWidgetExecute(viewportWidget, previousViewportSelection, viewportCell, width, height) {
        const viewportSelection = this.viewportSelection();

        if(!this.equals(previousViewportSelection)) {
            viewportWidget.deleteSelection(
                viewportSelection
            );
        }

        // clear selection
        return SpreadsheetHistoryHashTokens.viewportSelection(null);
    }

    labelMappingWidget(widget) {
        widget.deleteLabelMapping();
    }
}