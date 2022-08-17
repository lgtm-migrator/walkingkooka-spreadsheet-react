import Equality from "../../Equality.js";
import Preconditions from "../../Preconditions.js";
import SpreadsheetHistoryHashTokens from "../history/SpreadsheetHistoryHashTokens.js";
import SpreadsheetName from "./SpreadsheetName.js";
import SpreadsheetNameHistoryHashToken from "./SpreadsheetNameHistoryHashToken.js";

/**
 * Saves the given spreadsheet name..
 */
export default class SpreadsheetNameSaveHistoryHashToken extends SpreadsheetNameHistoryHashToken {

    constructor(value) {
        super();
        Preconditions.requireInstance(value, SpreadsheetName, "value");
        this.valueValue = value;
    }

    /**
     * The spreadsheetname to save.
     */
    value() {
        return this.valueValue;
    }

    spreadsheetNameWidgetExecute(spreadsheetNameWidget) {
        spreadsheetNameWidget.patchSpreadsheetMetadataWithName(this.value());
    }

    historyHashPath() {
        return "/" + SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_PATH + "/" + encodeURIComponent(this.value().value());
    }

    equals(other) {
        return super.equals(other) &&
            Equality.safeEquals(this.value(), other.value());
    }
}