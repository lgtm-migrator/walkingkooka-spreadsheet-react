export default class SpreadsheetHistoryHashTokens {

    static SPREADSHEET_ID = "spreadsheet-id";
    static SPREADSHEET_NAME = "spreadsheet-name";
    static SPREADSHEET_NAME_EDIT = "name";

    static SELECTION = "selection";
    static SELECTION_ANCHOR = "selection-anchor";
    static SELECTION_ACTION = "selection-action";

    static CELL = "cell";
    static CELL_FORMULA = "formula";
    static COLUMN = "column";
    static ROW = "row";

    static DELETE = "delete";
    static INSERT_AFTER = "insert-after";
    static INSERT_BEFORE = "insert-before";
    static SAVE = "save";

    static LABEL = "label";
    static LABEL_ACTION = "label-action";

    static SELECT = "select";
    static SETTINGS = "settings";
    static SETTINGS_SECTION = "settings-section";

    // these tokens are optional and only one may appear after SETTINGS
    static SETTINGS_METADATA = "metadata";
    static SETTINGS_TEXT = "text";
    static SETTINGS_NUMBER = "number";
    static SETTINGS_DATE_TIME = "date-time";
    static SETTINGS_STYLE = "style";
}