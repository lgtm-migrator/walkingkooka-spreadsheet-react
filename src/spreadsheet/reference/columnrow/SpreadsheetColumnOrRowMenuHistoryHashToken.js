import Preconditions from "../../../Preconditions.js";
import SpreadsheetColumnOrRowHistoryHashToken from "./SpreadsheetColumnOrRowHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../../history/SpreadsheetHistoryHashTokens.js";

/**
 * Represents a column/row open menu history hash token.
 */
export default class SpreadsheetColumnOrRowMenuHistoryHashToken extends SpreadsheetColumnOrRowHistoryHashToken {

    constructor(viewportSelection, contextMenu) {
        super(viewportSelection);
        this.contextMenuValue = Preconditions.requireObject(contextMenu, "contextMenu");
    }

    contextMenu() {
        return this.contextMenuValue;
    }

    historyHashPath() {
        return super.historyHashPath() +
            "/" +
            SpreadsheetHistoryHashTokens.MENU;
    }

    /**
     * Opens the context menu for the given column/row
     */
    spreadsheetViewportWidgetExecute(viewportWidget, previousViewportSelection, viewportCell, width, height) {
        viewportWidget.showContextMenu(
            this.viewportSelection()
        );

        return null;
    }

    equals(other) {
        return super.equals(other) &&
            this.contextMenu().equals(other.contextMenu());
    }
}