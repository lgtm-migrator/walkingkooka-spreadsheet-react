import SpreadsheetCellReference from "../../src/spreadsheet/reference/SpreadsheetCellReference.js";
import SpreadsheetColumnReference from "../../src/spreadsheet/reference/SpreadsheetColumnReference.js";
import SpreadsheetFormulaWidget from "../../src/spreadsheet/SpreadsheetFormulaWidget.js";
import SpreadsheetNameWidget from "../../src/spreadsheet/SpreadsheetNameWidget.js";
import SpreadsheetRowReference from "../../src/spreadsheet/reference/SpreadsheetRowReference.js";
import SpreadsheetLabelMappingWidget from "../../src/spreadsheet/reference/SpreadsheetLabelMappingWidget.js";
import SpreadsheetSelectLinkWidget from "../../src/spreadsheet/reference/SpreadsheetSelectLinkWidget.js";
import SpreadsheetSelectAutocompleteWidget
    from "../../src/spreadsheet/reference/SpreadsheetSelectAutocompleteWidget.js";
import SpreadsheetViewportWidget from "../../src/spreadsheet/SpreadsheetViewportWidget.js";

export default class SpreadsheetTesting {

    static A1 = SpreadsheetCellReference.parse("A1");
    static A2 = SpreadsheetCellReference.parse("A2");
    static A3 = SpreadsheetCellReference.parse("A3");
    static B1 = SpreadsheetCellReference.parse("B1");
    static B2 = SpreadsheetCellReference.parse("B2");
    static B3 = SpreadsheetCellReference.parse("B3");
    static C2 = SpreadsheetCellReference.parse("C2");
    static C3 = SpreadsheetCellReference.parse("C3");
    static D4 = SpreadsheetCellReference.parse("D4");
    static E5 = SpreadsheetCellReference.parse("E5");

    static SELECTED = ".selected";
    static COLUMN = ".column";
    static ROW = ".row";
    static CELL = ".cell";
    static LABEL = "Label123";

    constructor(cy) {
        this.cy = cy;
    }

    spreadsheetEmptyReady() {
        this.hash()
            .should('match', /.*\/Untitled/); // wait for /$id/$name
    }

    hash() {
        return this.cy.location().hash();
    }

    hashAppend(append) {
        this.cy.window()
            .then((win) => {
                const hash = win.location.hash;
                const after = hash + append;

                win.location.hash = after;

                this.hash()
                    .should("eq", after);
            });
    }

    hashAppendWithoutCheck(append) {
        this.cy.window()
            .then((win) => {
                const hash = win.location.hash;
                const after = hash + append;

                win.location.hash = after;
            });
    }

    hashEnter(hash) {
        this.cy.window()
            .then((win) => {
                win.location.hash = hash;
            });
    }

    hashOnlyIdAndName() {
        this.cy.window()
            .then((win) => {
                const h = win.location.hash;

                const slash0 = h.indexOf("/");
                const slash1 = -1 !== slash0 && h.indexOf("/", slash0 + 1);
                const slash2 = -1 !== slash1 && h.indexOf("/", slash1 + 1);

                if(-1 !== slash2){
                    this.hashEnter(h.substring(0, slash2));

                    this.hash()
                        .should('match', /.*\/.*/);
                }
            });
    }

    spreadsheetName() {
        return this.cy.get("#" + SpreadsheetNameWidget.SPREADSHEET_NAME_ID);
    }

    spreadsheetNameClick() {
        this.spreadsheetName()
            .click();

        this.hash()
            .should('match', /.*\/.*\/name/) // => true
    }

    formulaText() {
        return this.cy.get("#" + SpreadsheetFormulaWidget.TEXT_FIELD_ID);
    }

    labelMappingLabelTextField() {
        return this.cy.get("#" + SpreadsheetLabelMappingWidget.LABEL_TEXT_FIELD_ID);
    }

    labelMappingReferenceTextField() {
        return this.cy.get("#" + SpreadsheetLabelMappingWidget.REFERENCE_TEXT_FIELD_ID);
    }

    labelMappingLabelSaveButton() {
        return this.cy.get("#" + SpreadsheetLabelMappingWidget.SAVE_BUTTON_ID);
    }

    labelMappingLabelDeleteButton() {
        return this.cy.get("#" + SpreadsheetLabelMappingWidget.DELETE_BUTTON_ID);
    }

    labelMappingLabelCloseButton() {
        return this.cy.get("#" + SpreadsheetLabelMappingWidget.DIALOG_CLOSE_BUTTON_ID);
    }

    hashLabel() {
        this.hashAppend("/label/" + SpreadsheetTesting.LABEL);
    }

    selectHistoryHash() {
        this.hashAppend("/select");
    }

    selectLink() {
        return this.cy.get("#" + SpreadsheetSelectLinkWidget.SELECT_LINK_ID);
    }

    selectDialog() {
        return this.cy.get("#" + SpreadsheetSelectAutocompleteWidget.DIALOG_ID);
    }

    selectDialogTitle() {
        return this.cy.get("#" + SpreadsheetSelectAutocompleteWidget.DIALOG_TITLE_ID);
    }

    selectDialogClose() {
        return this.cy.get("#" + SpreadsheetSelectAutocompleteWidget.DIALOG_CLOSE_BUTTON_ID);
    }

    selectAutocompleteTextField() {
        return this.cy.get("#" + SpreadsheetSelectAutocompleteWidget.TEXT_FIELD_ID);
    }

    selectAutocompleteTextFieldHelper() {
        return this.cy.get("#" + SpreadsheetSelectAutocompleteWidget.TEXT_FIELD_HELPER_TEXT_ID);
    }

    selectAutocompletePopup() {
        return this.cy.get("#" + SpreadsheetSelectAutocompleteWidget.TEXT_FIELD_POPUP_ID);
    }

    selectAutocompletePopupOption(nth) {
        return this.cy.get("#" + SpreadsheetSelectAutocompleteWidget.TEXT_FIELD_OPTION_ID + nth);
    }

    selectCellGotoButton(disabled) {
        return this.selectButtonDisabled(SpreadsheetSelectAutocompleteWidget.CELL_GOTO_BUTTON_ID, disabled);
    }

    selectCellRangeSelectButton(disabled) {
        return this.selectButtonDisabled(SpreadsheetSelectAutocompleteWidget.CELL_RANGE_SELECT_BUTTON_ID, disabled);
    }

    selectColumnGotoButton(disabled) {
        return this.selectButtonDisabled(SpreadsheetSelectAutocompleteWidget.COLUMN_GOTO_BUTTON_ID, disabled);
    }

    selectColumnRangeSelectButton(disabled) {
        return this.selectButtonDisabled(SpreadsheetSelectAutocompleteWidget.COLUMN_RANGE_SELECT_BUTTON_ID, disabled);
    }

    selectLabelCreateButton(disabled) {
        return this.selectButtonDisabled(SpreadsheetSelectAutocompleteWidget.LABEL_CREATE_BUTTON_ID, disabled);
    }

    selectLabelEditButton(disabled) {
        return this.selectButtonDisabled(SpreadsheetSelectAutocompleteWidget.LABEL_EDIT_BUTTON_ID, disabled);
    }

    selectLabelGotoButton(disabled) {
        return this.selectButtonDisabled(SpreadsheetSelectAutocompleteWidget.LABEL_GOTO_BUTTON_ID, disabled);
    }

    selectRowGotoButton(disabled) {
        return this.selectButtonDisabled(SpreadsheetSelectAutocompleteWidget.ROW_GOTO_BUTTON_ID, disabled);
    }

    selectRowRangeSelectButton(disabled) {
        return this.selectButtonDisabled(SpreadsheetSelectAutocompleteWidget.ROW_RANGE_SELECT_BUTTON_ID, disabled);
    }

    selectButtonDisabled(id, disabled) {
        const button = this.cy.get((disabled ? "BUTTON" : "A") + "#" + id);

        if(disabled){
            button.should("be.disabled");
        }

        return button;
    }

    viewportContextMenu() {
        return this.cy.get("#" + SpreadsheetViewportWidget.VIEWPORT_CONTEXT_MENU_ID);
    }

    /**
     * Click on the cell and verify it gets focused.
     */
    cellClick(cellReference) {
        this.cell(cellReference)
            .click()
            .should("have.focus");
    }

    cellFormattedTextCheck(cellReference, text) {
        this.cell(cellReference)
            .should("have.text", text);
    }

    cellA1StyleCheck(property, value) {
        this.cell(SpreadsheetTesting.A1)
            .should('have.css', property, value);
    }

    cell(cellReference) {
        const spreadsheetCellReference = cellReference instanceof SpreadsheetCellReference ?
            cellReference :
            SpreadsheetCellReference.parse(cellReference);

        return this.cy.get("#" + spreadsheetCellReference.viewportId());
    }

    column(columnReference) {
        const spreadsheetColumnReference = columnReference instanceof SpreadsheetColumnReference ?
            columnReference :
            SpreadsheetColumnReference.parse(columnReference);

        return this.cy.get("#" + spreadsheetColumnReference.viewportId());
    }

    row(rowReference) {
        const spreadsheetRowReference = rowReference instanceof SpreadsheetRowReference ?
            rowReference :
            SpreadsheetRowReference.parse(rowReference);

        return this.cy.get("#" + spreadsheetRowReference.viewportId());
    }

    /**
     * Checks that the spreadsheet is completely empty.
     */
    spreadsheetEmptyCheck() {
        this.hash()
            .should('match', /.*\/Untitled/) // => true

        // Verify spreadsheet name is "Untitled"
        this.spreadsheetName()
            .should("have.class", "MuiButton-root")
            .should("have.text", "Untitled");

        this.cy.title()
            .should("eq", "Untitled");

        // Verify formula is read only and empty
        this.formulaText()
            .should("be.disabled")
            .should("have.text", "");

        this.cy.get(SpreadsheetTesting.COLUMN + SpreadsheetTesting.SELECTED)
            .should("have.length", 0);

        this.cy.get(SpreadsheetTesting.ROW + SpreadsheetTesting.SELECTED)
            .should("have.length", 0);

        this.cy.get(SpreadsheetTesting.CELL)
            .should("have.text", "");
    }

    wait(period) {
        this.cy.wait(period || 20);
    }
}