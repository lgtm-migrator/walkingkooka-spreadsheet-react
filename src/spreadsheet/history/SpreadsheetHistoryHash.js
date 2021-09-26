import ListenerCollection from "../../event/ListenerCollection.js";
import MenuItem from "@material-ui/core/MenuItem";
import Preconditions from "../../Preconditions.js";
import React from 'react';
import spreadsheetCellRangeCellReferenceOrLabelParse
    from "../reference/SpreadsheetCellRangeCellReferenceOrLabelParse.js";
import SpreadsheetCellReferenceOrLabelName from "../reference/SpreadsheetCellReferenceOrLabelName.js";
import spreadsheetCellReferenceOrLabelNameParse from "../reference/SpreadsheetCellReferenceOrLabelNameParse.js";
import SpreadsheetCellSelectionActionHistoryHashToken from "./SpreadsheetCellSelectionActionHistoryHashToken.js";
import SpreadsheetColumnOrRowSelectionActionHistoryHashToken
    from "./SpreadsheetColumnOrRowSelectionActionHistoryHashToken.js";
import SpreadsheetColumnOrRowInsertAfterHistoryHashToken from "./SpreadsheetColumnOrRowInsertAfterHistoryHashToken.js";
import SpreadsheetColumnOrRowInsertBeforeHistoryHashToken
    from "./SpreadsheetColumnOrRowInsertBeforeHistoryHashToken.js";
import SpreadsheetColumnReferenceRange from "../reference/SpreadsheetColumnReferenceRange.js";
import SpreadsheetFormulaLoadAndEditHistoryHashToken from "./SpreadsheetFormulaLoadAndEditHistoryHashToken.js";
import SpreadsheetFormulaSaveHistoryHashToken from "./SpreadsheetFormulaSaveHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "./SpreadsheetHistoryHashTokens.js";
import SpreadsheetLabelMappingDeleteHistoryHashToken from "./SpreadsheetLabelMappingDeleteHistoryHashToken.js";
import SpreadsheetLabelMappingHistoryHashToken from "./SpreadsheetLabelMappingHistoryHashToken.js";
import SpreadsheetLabelMappingSaveHistoryHashToken from "./SpreadsheetLabelMappingSaveHistoryHashToken.js";
import SpreadsheetLabelName from "../reference/SpreadsheetLabelName.js";
import SpreadsheetName from "../SpreadsheetName.js";
import SpreadsheetRowReferenceRange from "../reference/SpreadsheetRowReferenceRange.js";
import SpreadsheetSelection from "../reference/SpreadsheetSelection.js";
import SpreadsheetSelectionActionHistoryHashToken from "./SpreadsheetSelectionActionHistoryHashToken.js";
import SpreadsheetViewportSelectionAnchor from "../reference/SpreadsheetViewportSelectionAnchor.js";

function tokenize(pathname) {
    return pathname && pathname.startsWith("/") ?
        split(pathname) :
        [];
}

function split(pathname) {
    const components = pathname.split("/");
    components.shift();
    return components;
}

function isSettingsToken(token) {
    var valid;

    switch(token) {
        case SpreadsheetHistoryHashTokens.SETTINGS_METADATA:
        case SpreadsheetHistoryHashTokens.SETTINGS_TEXT:
        case SpreadsheetHistoryHashTokens.SETTINGS_NUMBER:
        case SpreadsheetHistoryHashTokens.SETTINGS_DATE_TIME:
        case SpreadsheetHistoryHashTokens.SETTINGS_STYLE:
            valid = true;
            break;
        default:
            valid = false;
            break;
    }
    return valid;
}

/**
 * A collection of utilities that support history hash.
 */
export default class SpreadsheetHistoryHash extends SpreadsheetHistoryHashTokens {

    /**
     * Parsers the path extracting tokens returning an object with valid tokens. Invalid combination will be removed.
     */
    static parse(hash, errors) {
        Preconditions.requireText(hash, "hash");
        Preconditions.requireFunction(errors, "errors");

        const tokens = tokenize(hash);
        const spreadsheetId = tokens.shift();
        const historyHashTokens = {};

        if(spreadsheetId){
            historyHashTokens[SpreadsheetHistoryHashTokens.SPREADSHEET_ID] = spreadsheetId;

            var name;
            try {
                name = new SpreadsheetName(tokens.shift());
            } catch (ignore) {
            }

            if(name) {
                historyHashTokens[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME] = name;

                var valid = true;

                var nameEdit = null;

                var selection = null;
                var selectionAnchor = null;
                var selectionAction = null;

                var label = null;
                var labelAction = null;

                var select = null;
                var settings = null;
                var settingsSection = null;

                var previous = null;

                while(tokens.length > 0 && valid) {
                    valid = false;

                    const token = tokens.shift();
                    switch(token) {
                        case "":
                            valid = tokens.length === 0;
                            break;
                        case SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT:
                            nameEdit = true;
                            previous = null;
                            valid = true;
                            break;
                        case SpreadsheetHistoryHashTokens.CELL:
                            if(!selection && tokens.length > 0){
                                try {
                                    selection = spreadsheetCellReferenceOrLabelNameParse(tokens.shift());
                                    previous = selection;
                                    valid = true;
                                } catch(invalid) {
                                    errors("Cell: " + invalid.message);
                                }
                            }
                            break;
                        case SpreadsheetHistoryHashTokens.CELL_FORMULA:
                            if(previous instanceof SpreadsheetCellReferenceOrLabelName){
                                selectionAction = new SpreadsheetFormulaLoadAndEditHistoryHashToken();
                                previous = selectionAction;
                                valid = true;
                            }
                            break;
                        case SpreadsheetHistoryHashTokens.COLUMN:
                            if(!selection && tokens.length > 0){
                                try {
                                    selection = SpreadsheetColumnReferenceRange.parse(tokens.shift())
                                        .columnOrRange();
                                    previous = selection;
                                    valid = true;
                                } catch(invalid) {
                                    errors("Column: " + invalid.message);
                                }
                            }
                            break;
                        case SpreadsheetHistoryHashTokens.DELETE:
                            if(label){
                                labelAction = SpreadsheetLabelMappingDeleteHistoryHashToken.INSTANCE;
                                previous = null;
                                valid = true;
                                break;
                            }
                            if(previous instanceof SpreadsheetSelection || (previous instanceof SpreadsheetViewportSelectionAnchor && selection instanceof SpreadsheetSelection)){
                                selectionAction = selection.deleteHistoryHashToken();
                                previous = null;
                                valid = true;
                            }
                            break;
                        case SpreadsheetHistoryHashTokens.INSERT_AFTER:
                            if((previous instanceof SpreadsheetSelection || (previous instanceof SpreadsheetViewportSelectionAnchor && selection instanceof SpreadsheetSelection)) && tokens.length > 0){
                                const insertAfterCount = tokens.shift();
                                if(!Number.isNaN(Number(insertAfterCount))){
                                    try {
                                        selectionAction = new SpreadsheetColumnOrRowInsertAfterHistoryHashToken(parseInt(insertAfterCount, 10));
                                        previous = null;
                                        valid = true;
                                    } catch(invalid) {
                                        errors("Insert after count: " + invalid.message);
                                    }
                                }
                            }
                            break;
                        case SpreadsheetHistoryHashTokens.INSERT_BEFORE:
                            if((previous instanceof SpreadsheetSelection || (previous instanceof SpreadsheetViewportSelectionAnchor && selection instanceof SpreadsheetSelection)) && tokens.length > 0){
                                const insertBeforeCount = tokens.shift();
                                if(!Number.isNaN(Number(insertBeforeCount))){
                                    try {
                                        selectionAction = new SpreadsheetColumnOrRowInsertBeforeHistoryHashToken(parseInt(insertBeforeCount, 10));
                                        previous = null;
                                        valid = true;
                                    } catch(invalid) {
                                        errors("Insert before count: " + invalid.message);
                                    }
                                }
                            }
                            break;
                        case SpreadsheetHistoryHashTokens.LABEL:
                            if(tokens.length > 0){
                                try {
                                    label = SpreadsheetLabelName.parse(tokens.shift());
                                    previous = null;
                                    valid = true;
                                } catch(invalid) {
                                    errors("Label: " + invalid.message);
                                }
                            }
                            break;
                        case SpreadsheetHistoryHashTokens.ROW:
                            if(!selection && tokens.length > 0){
                                try {
                                    selection = SpreadsheetRowReferenceRange.parse(tokens.shift())
                                        .rowOrRange();
                                    previous = selection;
                                    valid = true;
                                } catch(invalid) {
                                    errors("Row: " + invalid.message);
                                }
                            }
                            break;
                        case SpreadsheetHistoryHashTokens.SAVE:
                            if(label && tokens.length >= 2){
                                labelAction = new SpreadsheetLabelMappingSaveHistoryHashToken(
                                    SpreadsheetLabelName.parse(
                                        decodeURIComponent(
                                            tokens.shift()
                                        )
                                    ),
                                    spreadsheetCellRangeCellReferenceOrLabelParse(
                                        decodeURIComponent(
                                            tokens.shift()
                                        )
                                    )
                                );
                                valid = true;
                            }else {
                                if(previous instanceof SpreadsheetFormulaLoadAndEditHistoryHashToken && tokens.length > 0){
                                    selectionAction = new SpreadsheetFormulaSaveHistoryHashToken(decodeURIComponent(tokens.shift()));
                                    valid = true;
                                }
                            }
                            previous = null;
                            break;
                        case SpreadsheetHistoryHashTokens.SELECT:
                            select = true;
                            previous = null;
                            valid = true;
                            break;
                        case SpreadsheetHistoryHashTokens.SETTINGS:
                            settings = true;
                            const possibleSection = tokens.shift();
                            if(null != possibleSection){
                                if(isSettingsToken(possibleSection)){
                                    settingsSection = possibleSection;
                                }
                            }
                            previous = null;
                            valid = true;
                            break;
                        default:
                            if(previous instanceof SpreadsheetSelection){
                                for(const anchor of previous.anchors()) {
                                    if(token === anchor.toHistoryHashToken()){
                                        selectionAnchor = anchor;
                                        valid = true;
                                        break;
                                    }
                                }
                            }

                            break;
                    }
                }

                if(valid){
                    if(nameEdit){
                        historyHashTokens[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT] = nameEdit;
                    }
                    if(selection){
                        historyHashTokens[SpreadsheetHistoryHashTokens.SELECTION] = selection;
                        if(selectionAnchor){
                            historyHashTokens[SpreadsheetHistoryHashTokens.SELECTION_ANCHOR] = selectionAnchor;
                        }
                        if(selectionAction){
                            historyHashTokens[SpreadsheetHistoryHashTokens.SELECTION_ACTION] = selectionAction;
                        }
                    }
                    if(label){
                        historyHashTokens[SpreadsheetHistoryHashTokens.LABEL] = label;

                        if(labelAction){
                            historyHashTokens[SpreadsheetHistoryHashTokens.LABEL_ACTION] = labelAction;
                        }
                    }
                    if(select){
                        historyHashTokens[SpreadsheetHistoryHashTokens.SELECT] = select;
                    }
                    if(settings){
                        historyHashTokens[SpreadsheetHistoryHashTokens.SETTINGS] = settings;
                        if(settingsSection){
                            historyHashTokens[SpreadsheetHistoryHashTokens.SETTINGS_SECTION] = settingsSection;
                        }
                    }
                }
            }
        }

        return SpreadsheetHistoryHash.validate(historyHashTokens);
    }

    /**
     * Verifies the given tokens are valid, for example formula cannot be set if cell if absent.
     */
    static validate(tokens) {
        var spreadsheetId = tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_ID];
        var spreadsheetName = tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME];
        var nameEdit = tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT];

        var selection = tokens[SpreadsheetHistoryHashTokens.SELECTION];
        var selectionAnchor = tokens[SpreadsheetHistoryHashTokens.SELECTION_ANCHOR];
        var selectionAction = tokens[SpreadsheetHistoryHashTokens.SELECTION_ACTION];

        var label = tokens[SpreadsheetHistoryHashTokens.LABEL];
        var labelAction = tokens[SpreadsheetHistoryHashTokens.LABEL_ACTION];

        var select = tokens[SpreadsheetHistoryHashTokens.SELECT];
        var settings = tokens[SpreadsheetHistoryHashTokens.SETTINGS];
        var settingsSection = tokens[SpreadsheetHistoryHashTokens.SETTINGS_SECTION];

        const verified = {};

        if(spreadsheetId){
            verified[SpreadsheetHistoryHashTokens.SPREADSHEET_ID] = spreadsheetId;

            if(spreadsheetName){
                verified[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME] = spreadsheetName;
                if(nameEdit && (selection || label || select || settings)){
                    nameEdit = false;
                    selection = false;
                    label = false;
                    select = false;
                }
                if(nameEdit){
                    selection = false;
                    label = false;
                    select = false;
                }
                if(selection || label || select || settings){
                    nameEdit = false;
                }
                if(nameEdit){
                    verified[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT] = nameEdit;
                }
                if(selection instanceof SpreadsheetSelection){
                    verified[SpreadsheetHistoryHashTokens.SELECTION] = selection;

                    var anchorOk = !selectionAnchor; // $selectionAnchor = null && anchors.length() == 0
                    if(!anchorOk){
                        for(const anchor of selection.anchors()) {
                            anchorOk = anchor.equals(selectionAnchor);
                            if(anchorOk){
                                break;
                            }
                        }
                    }
                    if(anchorOk){
                        if(selectionAnchor){
                            verified[SpreadsheetHistoryHashTokens.SELECTION_ANCHOR] = selectionAnchor;
                        }

                        if(selection.isCellScalarOrRange() && selectionAction instanceof SpreadsheetCellSelectionActionHistoryHashToken){
                            verified[SpreadsheetHistoryHashTokens.SELECTION_ACTION] = selectionAction;
                        }

                        if(selection.isColumnOrRowScalarOrRange() && selectionAction instanceof SpreadsheetColumnOrRowSelectionActionHistoryHashToken){
                            verified[SpreadsheetHistoryHashTokens.SELECTION_ACTION] = selectionAction;
                        }
                    }
                }
                if(label instanceof SpreadsheetLabelName){
                    verified[SpreadsheetHistoryHashTokens.LABEL] = label;

                    if(labelAction instanceof SpreadsheetLabelMappingHistoryHashToken){
                        verified[SpreadsheetHistoryHashTokens.LABEL_ACTION] = labelAction;
                    }
                }
                if(select){
                    verified[SpreadsheetHistoryHashTokens.SELECT] = select;
                }
                if(settings){
                    verified[SpreadsheetHistoryHashTokens.SETTINGS] = settings;

                    if(settingsSection){
                        verified[SpreadsheetHistoryHashTokens.SETTINGS_SECTION] = settingsSection;
                    }
                }
            }
        }

        return verified;
    }

    /**
     * Merges the two history hash objects, using the delta to update and return a new object.
     */
    static merge(current, delta) {
        Preconditions.requireObject(current, "current");
        Preconditions.requireObject(delta, "delta");

        // get the current
        var spreadsheetId = current[SpreadsheetHistoryHashTokens.SPREADSHEET_ID];
        var spreadsheetName = current[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME];
        var nameEdit = current[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT];

        var selection = current[SpreadsheetHistoryHashTokens.SELECTION];
        var selectionAnchor = current[SpreadsheetHistoryHashTokens.SELECTION_ANCHOR];
        var selectionAction = current[SpreadsheetHistoryHashTokens.SELECTION_ACTION];

        var label = current[SpreadsheetHistoryHashTokens.LABEL];
        var labelAction = current[SpreadsheetHistoryHashTokens.LABEL_ACTION];

        var select = current[SpreadsheetHistoryHashTokens.SELECT];

        var settings = current[SpreadsheetHistoryHashTokens.SETTINGS];
        var settingsSection = current[SpreadsheetHistoryHashTokens.SETTINGS_SECTION];

        // try replacing...
        if(delta.hasOwnProperty(SpreadsheetHistoryHashTokens.SPREADSHEET_ID)){
            spreadsheetId = delta[SpreadsheetHistoryHashTokens.SPREADSHEET_ID];
        }

        if(delta.hasOwnProperty(SpreadsheetHistoryHashTokens.SPREADSHEET_NAME)){
            spreadsheetName = delta[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME];
        }

        if(delta.hasOwnProperty(SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT)){
            nameEdit = !!delta[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT];
            if(nameEdit){
                selection = null;
                selectionAction = null;
                label = null;
                select = null;
                settings = null;
            }
        }

        if(delta.hasOwnProperty(SpreadsheetHistoryHashTokens.SELECTION)){
            selection = delta[SpreadsheetHistoryHashTokens.SELECTION];
            if(selection){
                nameEdit = false;
            }
        }

        if(delta.hasOwnProperty(SpreadsheetHistoryHashTokens.SELECTION_ANCHOR)){
            selectionAnchor = delta[SpreadsheetHistoryHashTokens.SELECTION_ANCHOR];
            if(selectionAnchor instanceof SpreadsheetViewportSelectionAnchor){
                nameEdit = false;
            }
        }

        if(delta.hasOwnProperty(SpreadsheetHistoryHashTokens.SELECTION_ACTION)){
            selectionAction = delta[SpreadsheetHistoryHashTokens.SELECTION_ACTION];
            if(selectionAction instanceof SpreadsheetSelectionActionHistoryHashToken){
                nameEdit = false;
            }
        }

        if(delta.hasOwnProperty(SpreadsheetHistoryHashTokens.LABEL)){
            label = delta[SpreadsheetHistoryHashTokens.LABEL];

            if(label){
                nameEdit = false;
            }
        }

        if(delta.hasOwnProperty(SpreadsheetHistoryHashTokens.LABEL_ACTION)){
            labelAction = delta[SpreadsheetHistoryHashTokens.LABEL_ACTION];
            if(labelAction instanceof SpreadsheetLabelMappingHistoryHashToken){
                nameEdit = false;
            }
        }

        if(delta.hasOwnProperty(SpreadsheetHistoryHashTokens.SELECT)){
            select = delta[SpreadsheetHistoryHashTokens.SELECT];
            if(select){
                nameEdit = false;
            }
        }

        if(delta.hasOwnProperty(SpreadsheetHistoryHashTokens.SETTINGS)){
            settings = delta[SpreadsheetHistoryHashTokens.SETTINGS];
            settingsSection = delta[SpreadsheetHistoryHashTokens.SETTINGS_SECTION];
            if(settingsSection && !isSettingsToken(settingsSection)){
                settingsSection = null;
            }
        }

        const merged = {};
        let valid = false;

        if(null != spreadsheetId){
            merged[SpreadsheetHistoryHashTokens.SPREADSHEET_ID] = spreadsheetId;

            if(null != spreadsheetName){
                merged[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME] = spreadsheetName;

                valid = true;
                if(nameEdit){
                    if(selection || label || select || settings){
                        valid = false;
                    }
                }
            }
        }

        if(valid){
            if(nameEdit){
                merged[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT] = nameEdit;
            }

            if(selection){
                merged[SpreadsheetHistoryHashTokens.SELECTION] = selection;

                if(selectionAnchor instanceof SpreadsheetViewportSelectionAnchor){
                    merged[SpreadsheetHistoryHashTokens.SELECTION_ANCHOR] = selectionAnchor;
                }

                if(selectionAction instanceof SpreadsheetSelectionActionHistoryHashToken){
                    merged[SpreadsheetHistoryHashTokens.SELECTION_ACTION] = selectionAction;
                }
            }

            if(label){
                merged[SpreadsheetHistoryHashTokens.LABEL] = label;

                if(labelAction instanceof SpreadsheetLabelMappingHistoryHashToken){
                    merged[SpreadsheetHistoryHashTokens.LABEL_ACTION] = labelAction;
                }
            }

            if(select){
                merged[SpreadsheetHistoryHashTokens.SELECT] = select;
            }

            if(!!settings){
                merged[SpreadsheetHistoryHashTokens.SETTINGS] = settings;

                if(settingsSection){
                    merged[SpreadsheetHistoryHashTokens.SETTINGS_SECTION] = settingsSection;
                }
            }
        }

        return merged;
    }

    /**
     * Accepts some history tokens, verifies the combinations are valid and returns the hash without the leading hash-sign.
     */
    static stringify(tokens) {
        var spreadsheetId = tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_ID];
        var spreadsheetName = tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME];
        var nameEdit = tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT];

        var selection = tokens[SpreadsheetHistoryHashTokens.SELECTION];
        var selectionAnchor = tokens[SpreadsheetHistoryHashTokens.SELECTION_ANCHOR];
        var selectionAction = tokens[SpreadsheetHistoryHashTokens.SELECTION_ACTION];

        var label = tokens[SpreadsheetHistoryHashTokens.LABEL];
        var labelAction = tokens[SpreadsheetHistoryHashTokens.LABEL_ACTION];

        var select = tokens[SpreadsheetHistoryHashTokens.SELECT];

        var settings = tokens[SpreadsheetHistoryHashTokens.SETTINGS];
        var settingsSection = tokens[SpreadsheetHistoryHashTokens.SETTINGS_SECTION];

        let hash = "";
        let valid = false;

        if(null != spreadsheetId){
            hash = "/" + spreadsheetId;

            if(null != spreadsheetName){
                hash = hash + "/" + spreadsheetName;

                valid = true;
                if(nameEdit){
                    if(selection || label || select || settings){
                        valid = false;
                    }
                }
            }
        }

        if(valid){
            if(nameEdit){
                hash = hash + "/" + SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT;
                selection = null;
                selectionAction = null;
                label = null;
                select = null;
            }

            if(selection){
                hash = hash + "/" + selection.toHistoryHashToken();

                if(selectionAnchor){
                    hash = hash + "/" + selectionAnchor.toHistoryHashToken();
                }

                if(selectionAction instanceof SpreadsheetSelectionActionHistoryHashToken){
                    hash = hash + "/" + selectionAction.toHistoryHashToken();
                }
            }

            if(label){
                hash = hash + "/" + SpreadsheetHistoryHashTokens.LABEL + "/" + label;

                if(labelAction instanceof SpreadsheetLabelMappingHistoryHashToken){
                    hash = hash + "/" + labelAction.toHistoryHashToken();
                }
            }

            if(select){
                hash = hash + "/" + SpreadsheetHistoryHashTokens.SELECT;
            }

            if(!!settings){
                hash = hash + "/" + SpreadsheetHistoryHashTokens.SETTINGS;

                if(settingsSection){
                    hash = hash + "/" + settingsSection;
                }
            }
        }

        return hash;
    }

    constructor(hash, setHash, showError) {
        super();
        Preconditions.requireFunction(hash, "hash");
        Preconditions.requireFunction(setHash, "setHash");
        Preconditions.requireFunction(showError, "showError");

        this.hash = hash;
        this.setHash = setHash;
        this.showError = showError;

        this.listeners = new ListenerCollection();
        this.hashCounter = 0;
        this.currentTokens = SpreadsheetHistoryHash.parse(
            hash(),
            this.showError
        );
    }

    onHistoryChange(e) {
        const hash = this.hash();
        const tokens = SpreadsheetHistoryHash.parse(
            hash,
            this.showError
        );

        const merged = SpreadsheetHistoryHash.merge(
            tokens,
            {}
        );
        this.push(merged);

        this.currentTokens = merged;

        const hashCounter = this.hashCounter;
        for(const listener of this.listeners.listeners.slice()) {
            if(this.hashCounter !== hashCounter){
                break;
            }
            listener(Object.assign({}, merged));
        }
    }

    tokens() {
        let currentTokens = this.currentTokens;
        if(null == currentTokens){
            const hash = this.hash();
            const tokens = SpreadsheetHistoryHash.parse(
                hash,
                this.showError
            );
            this.push(tokens);
            this.currentTokens = tokens;
        }
        return Object.assign({}, this.currentTokens);
    }

    /**
     * Adds a new history hash listener, returning a function which when invoked will remove the added listener.
     */
    addListener(listener) {
        return this.listeners.add(listener);
    }

    /**
     * Accepts some new history tokens and combines them with the current. This may result in some feature being cancelled,
     * eg editing the spreadsheet name turns off cell, label, select and settings.
     */
    mergeAndPush(tokens) {
        return this.push(SpreadsheetHistoryHash.merge(this.tokens(), tokens));
    }

    push(tokens) {
        const validated = SpreadsheetHistoryHash.validate(tokens);
        const tokensHash = SpreadsheetHistoryHash.stringify(validated);
        const hash = this.hash();
        if(tokensHash !== hash){
            this.hashCounter++;
            this.currentTokens = null;
            this.setHash(tokensHash);
        }
        return validated;
    }

    mergeAndStringify(tokens) {
        return SpreadsheetHistoryHash.stringify(
            SpreadsheetHistoryHash.merge(this.tokens(), tokens)
        );
    }

    /**
     * Filters the given tokens and returns just the spreadsheet id and name if present.
     */
    static spreadsheetIdAndName(tokens) {
        const only = {};

        only[SpreadsheetHistoryHashTokens.SPREADSHEET_ID] = tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_ID];
        only[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME] = tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME];

        return only;
    }

    /**
     * Factory that builds a MenuItem with the given text and a link created from the given history hash tokens.
     */
    menuItem(text, id, historyTokens) {
        const copy = Object.assign({}, historyTokens);

        const href = "#" + SpreadsheetHistoryHash.stringify(historyTokens);

        // unfortunately href is not honoured and does not update history
        return <MenuItem key={href}
                         id={id}
                         href={href}
                         onClick={() => this.mergeAndPush(copy)}
                         tabIndex={0}>{
                             text
                         }</MenuItem>;
    }
}