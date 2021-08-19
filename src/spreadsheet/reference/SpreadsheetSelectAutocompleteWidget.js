import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from "@material-ui/core/Button";
import Preconditions from "../../Preconditions.js";
import PropTypes from 'prop-types';
import React from 'react';
import SpreadsheetCellReferenceOrLabelName from "./SpreadsheetCellReferenceOrLabelName.js";
import SpreadsheetDialog from "../../widget/SpreadsheetDialog.js";
import spreadsheetExpressionReferenceFromJson from "./SpreadsheetExpressionReferenceFromJson.js";
import SpreadsheetHistoryHash from "../history/SpreadsheetHistoryHash.js";
import SpreadsheetHistoryAwareStateWidget from "../history/SpreadsheetHistoryAwareStateWidget.js";
import SpreadsheetLabelName from "./SpreadsheetLabelName.js";
import TextField from '@material-ui/core/TextField';

/**
 * The maximum number of similar matches
 */
const MAX_COUNT = 10;

/**
 * Displays a dialog with a text box that accepts query text that matches cells and labels. Buttons are also present
 * which support navigating, creating or editing the label.
 * <ul>
 * <li>open boolean when true the dialog should be displayed, false means hide</li>
 * <li>queryHelperText string that details if the query text is not a valid SpreadsheetCellReference or SpreadsheetLabelName</li>
 * <li>options holds all options from the matching similarities</li>
 * <li>goto A {@link SpreadsheetCellReferenceOrLabelName} for the currently selected auto complete option</li>
 * <li>labelEdit The selected existing {@link SpreadsheetLabelName} for editing</li>
 * <li>labelCreate The selected unknown {@link SpreadsheetLabelName} for creation</li>
 * </ul>
 */
export default class SpreadsheetSelectAutocompleteWidget extends SpreadsheetHistoryAwareStateWidget {

    static ID_PREFIX = "select";

    static DIALOG_ID = SpreadsheetSelectAutocompleteWidget.ID_PREFIX + "-Dialog";

    static DIALOG_CLOSE_BUTTON_ID = SpreadsheetSelectAutocompleteWidget.DIALOG_ID + "-close-Button";

    static DIALOG_TITLE_ID = SpreadsheetSelectAutocompleteWidget.DIALOG_ID + "-title";

    static TEXT_FIELD_ID = SpreadsheetSelectAutocompleteWidget.ID_PREFIX + "-Autocomplete-TextField"

    static TEXT_FIELD_HELPER_TEXT_ID = SpreadsheetSelectAutocompleteWidget.TEXT_FIELD_ID + "-helper-text"

    static TEXT_FIELD_POPUP_ID = SpreadsheetSelectAutocompleteWidget.TEXT_FIELD_ID + "-popup"

    static TEXT_FIELD_OPTION_ID = SpreadsheetSelectAutocompleteWidget.TEXT_FIELD_ID + "-option-"

    static GOTO_BUTTON_ID = SpreadsheetSelectAutocompleteWidget.ID_PREFIX + "-goto-Button";

    static LABEL_CREATE_BUTTON_ID = SpreadsheetSelectAutocompleteWidget.ID_PREFIX + "-label-create-Button";

    static LABEL_EDIT_BUTTON_ID = SpreadsheetSelectAutocompleteWidget.ID_PREFIX + "-label-edit-Button";

    initialStateFromProps(props) {
        return {
            open: false,
            queryHelperText: null,
            options: [],
            goto: null,
            labelCreate: null,
            labelEdit: null,
        };
    }

    /**
     * Updates the state.open from the history hash tokens.
     */
    stateFromHistoryTokens(tokens) {
        const select = tokens[SpreadsheetHistoryHash.SELECT];

        return {
            open: !!select,
        };
    }

    init() {
        this.autoComplete = React.createRef();
    }

    /**
     * Copies the select hash to state.open and also updates the AutoComplete widget to match state.option
     */
    historyTokensFromState(prevState) {
        const {open, options} = this.state;

        const autoComplete = this.autoComplete.current;
        if(autoComplete){
            autoComplete.options = options;
        }

        const historyTokens = {};
        historyTokens[SpreadsheetHistoryHash.SELECT] = open;
        return historyTokens;
    }

    render() {
        return this.state.open ?
            this.renderDialog() :
            null;
    }

    /**
     * Renders a modal dialog, with an auto complete and two action buttons to GOTO and EDIT the selected cell or label.
     */
    renderDialog() {
        const {queryHelperText, options, goto, labelEdit, labelCreate} = this.state;

        const gotoDisabled = !goto;
        const labelCreateDisabled = !labelCreate;
        const labelEditDisabled = !labelEdit;

        return <SpreadsheetDialog id={"select-Dialog"}
                                  open={true}
                                  onClose={this.close.bind(this)}
        >
            <span id={SpreadsheetSelectAutocompleteWidget.DIALOG_TITLE_ID}>Select</span>
            <Autocomplete
                id={SpreadsheetSelectAutocompleteWidget.TEXT_FIELD_ID}
                ref={this.autoComplete}
                freeSolo={true}
                selectOnFocus
                clearOnBlur={false}
                clearOnEscape={false}
                handleHomeEndKeys={true}
                options={options}
                getOptionLabel={(option) => typeof option === "string" ? option : option.text}
                onInputChange={this.onTextFieldChange.bind(this)}
                onChange={this.onAutoCompleteValueChange.bind(this)}
                noOptionsText={""}
                includeInputInList={true}
                style={{width: 500}}
                renderInput={(params) =>
                    <TextField
                        {...params}
                        autoFocus
                        variant="outlined"
                        helperText={queryHelperText}
                    />
                }
            />
            <Button id={SpreadsheetSelectAutocompleteWidget.GOTO_BUTTON_ID}
                    disabled={gotoDisabled}
                    color="primary"
                    onClick={this.onGotoClick.bind(this)}>
                Goto
            </Button>
            <Button id={SpreadsheetSelectAutocompleteWidget.LABEL_CREATE_BUTTON_ID}
                    disabled={labelCreateDisabled}
                    color="primary"
                    onClick={this.onLabelCreateClick.bind(this)}>
                Create Label
            </Button>
            <Button id={SpreadsheetSelectAutocompleteWidget.LABEL_EDIT_BUTTON_ID}
                    disabled={labelEditDisabled}
                    color="primary"
                    onClick={this.onLabelEditClick.bind(this)}>
                Edit Label
            </Button>
        </SpreadsheetDialog>
    }

    /**
     * This is fired whenever the query TextField is updated, resulting in a new search to the server
     * which will eventually update the displayed matches.
     */
    onTextFieldChange(e, newValueText) {
        console.log("onTextFieldChange: " + newValueText, e);

        this.performSimilarities(newValueText);
    }

    onAutoCompleteValueChange(e, newValueOption) {
        console.log("onAutoCompleteValueChange: " + newValueOption, newValueOption);

        switch(typeof newValueOption) {
            case "string":
                this.performSimilarities(newValueOption);
                break;
            case "object":
                this.setState(newValueOption);
                break;
            default:
                throw new Error("Unexpected newValueOption: " + newValueOption);
        }
    }

    performSimilarities(text) {
        console.log("performSimilarities: " + text);

        try {
            spreadsheetExpressionReferenceFromJson(text);

            this.props.getSimilarities(
                text,
                MAX_COUNT,
                (s) => {
                    const options = s.toSpreadsheetSelectWidgetOptions(text);

                    const newState = Object.assign(
                        {
                            options: options
                        },
                        options[0]
                    );

                    console.log("performSimilarities: new State", newState,
                        "similarities",
                        s);
                    this.setState(newState);
                },
                (e) => {
                    this.setState({
                        queryHelperText: null,
                        options: [],
                        goto: null,
                        labelCreate: null,
                        labelEdit: null,
                    });
                    this.props.showError(e);
                },
            );
        } catch(e) {
            console.log("performSimilarities " + e.message);

            this.setState({
                queryHelperText: e.message,
                options: [],
                goto: null,
                labelEdit: null,
                labelCreate: null,
            })
        }
    }

    /**
     * Updates the history hash token, navigating to the given cell/label
     */
    onGotoClick() {
        this.updateHistoryTokens(this.state.goto, null);
    }

    /**
     * Updates the history hash token, navigating to the given label for creation
     */
    onLabelCreateClick() {
        this.updateHistoryTokens(null, this.state.labelCreate);
    }

    /**
     * Updates the history hash token, navigating to the given label for editing
     */
    onLabelEditClick() {
        this.updateHistoryTokens(null, this.state.labelEdit);
    }

    updateHistoryTokens(goto, label) {
        Preconditions.optionalInstance(goto, SpreadsheetCellReferenceOrLabelName, "goto");
        Preconditions.optionalInstance(label, SpreadsheetLabelName, "label");

        const historyTokens = {};

        historyTokens[SpreadsheetHistoryHash.SELECTION] = goto;
        historyTokens[SpreadsheetHistoryHash.CELL_FORMULA] = false;
        historyTokens[SpreadsheetHistoryHash.LABEL] = label;
        historyTokens[SpreadsheetHistoryHash.SELECT] = null; // close the navigate modal

        this.historyParseMergeAndPush(historyTokens);
    }

    /**
     * Closes the dialog.
     */
    close() {
        console.log("close");
        this.setState({
            open: false,
            queryHelperText: null,
            options: [],
            goto: null,
            labelEdit: null,
            labelCreate: null,
        });
    }
}

SpreadsheetSelectAutocompleteWidget.propTypes = {
    history: PropTypes.instanceOf(SpreadsheetHistoryHash).isRequired,
    getSimilarities: PropTypes.func.isRequired, // performs a search to find similarities to the query text field.
    notificationShow: PropTypes.func.isRequired, // used to display notifications including errors and other messages
    showError: PropTypes.func.isRequired, // used mostly to display failures around getSimilarities
}