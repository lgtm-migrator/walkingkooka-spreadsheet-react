import CharSequences from "../../CharSequences.js";
import ListenerCollection from "../../event/ListenerCollection.js";
import MenuItem from "@mui/material/MenuItem";
import Preconditions from "../../Preconditions.js";
import React from 'react';
import SpreadsheetCellClearHistoryHashToken from "./SpreadsheetCellClearHistoryHashToken.js";
import SpreadsheetCellDeleteHistoryHashToken from "./SpreadsheetCellDeleteHistoryHashToken.js";
import SpreadsheetCellHistoryHashToken from "./SpreadsheetCellHistoryHashToken.js";
import SpreadsheetCellMenuHistoryHashToken from "./SpreadsheetCellMenuHistoryHashToken.js";
import spreadsheetCellRangeCellReferenceOrLabelParse
    from "../reference/SpreadsheetCellRangeCellReferenceOrLabelParse.js";
import SpreadsheetCellReferenceOrLabelName from "../reference/SpreadsheetCellReferenceOrLabelName.js";
import spreadsheetCellReferenceOrLabelNameParse from "../reference/SpreadsheetCellReferenceOrLabelNameParse.js";
import SpreadsheetColumnOrRowClearHistoryHashToken from "./SpreadsheetColumnOrRowClearHistoryHashToken.js";
import SpreadsheetColumnOrRowDeleteHistoryHashToken from "./SpreadsheetColumnOrRowDeleteHistoryHashToken.js";
import SpreadsheetColumnOrRowFreezeHistoryHashToken from "./SpreadsheetColumnOrRowFreezeHistoryHashToken.js";
import SpreadsheetColumnOrRowHistoryHashToken from "./SpreadsheetColumnOrRowHistoryHashToken.js";
import SpreadsheetColumnOrRowInsertAfterHistoryHashToken from "./SpreadsheetColumnOrRowInsertAfterHistoryHashToken.js";
import SpreadsheetColumnOrRowInsertBeforeHistoryHashToken
    from "./SpreadsheetColumnOrRowInsertBeforeHistoryHashToken.js";
import SpreadsheetColumnOrRowMenuHistoryHashToken from "./SpreadsheetColumnOrRowMenuHistoryHashToken.js";
import SpreadsheetColumnOrRowSaveHistoryHashToken from "./SpreadsheetColumnOrRowSaveHistoryHashToken.js";
import SpreadsheetColumnReferenceRange from "../reference/SpreadsheetColumnReferenceRange.js";
import SpreadsheetFormulaLoadAndEditHistoryHashToken from "./SpreadsheetFormulaLoadAndEditHistoryHashToken.js";
import SpreadsheetFormulaSaveHistoryHashToken from "./SpreadsheetFormulaSaveHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "./SpreadsheetHistoryHashTokens.js";
import SpreadsheetLabelMappingDeleteHistoryHashToken from "./SpreadsheetLabelMappingDeleteHistoryHashToken.js";
import SpreadsheetLabelMappingHistoryHashToken from "./SpreadsheetLabelMappingHistoryHashToken.js";
import SpreadsheetLabelMappingSaveHistoryHashToken from "./SpreadsheetLabelMappingSaveHistoryHashToken.js";
import SpreadsheetLabelName from "../reference/SpreadsheetLabelName.js";
import SpreadsheetName from "../SpreadsheetName.js";
import SpreadsheetNameHistoryHashToken from "./SpreadsheetNameHistoryHashToken.js";
import SpreadsheetNameSaveHistoryHashToken from "./SpreadsheetNameSaveHistoryHashToken.js";
import SpreadsheetRowReferenceRange from "../reference/SpreadsheetRowReferenceRange.js";
import SpreadsheetSelection from "../reference/SpreadsheetSelection.js";
import SpreadsheetSelectionHistoryHashToken from "./SpreadsheetSelectionHistoryHashToken.js";
import SpreadsheetSettingsHistoryHashToken from "./SpreadsheetSettingsHistoryHashToken.js";
import SpreadsheetSettingsSaveHistoryHashToken from "./SpreadsheetSettingsSaveHistoryHashToken.js";
import SpreadsheetSettingsWidgetHistoryHashTokens from "../settings/SpreadsheetSettingsWidgetHistoryHashTokens.js";
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
    return SpreadsheetSettingsWidgetHistoryHashTokens.accordions()
            .indexOf(token) > -1 ||
        isSettingsSaveableToken(token);
}

function isSettingsSaveableToken(token) {
    return Boolean(SpreadsheetSettingsWidgetHistoryHashTokens.parentAccordion(token));
}

function copyTx(from, to) {
    if(from.hasOwnProperty(SpreadsheetHistoryHashTokens.TX_ID)){
        to[SpreadsheetHistoryHashTokens.TX_ID] = from[SpreadsheetHistoryHashTokens.TX_ID];
    }
    return to;
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

        const historyHashTokens = SpreadsheetHistoryHashTokens.emptyTokens();

        const tokens = tokenize(hash);
        const spreadsheetId = tokens.shift();
        if(spreadsheetId){
            historyHashTokens[SpreadsheetHistoryHashTokens.SPREADSHEET_ID] = spreadsheetId;

            var name;
            try {
                name = new SpreadsheetName(tokens.shift());
            } catch(ignore) {
            }

            if(name){
                historyHashTokens[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME] = name;

                var spreadsheetNameEdit = null;
                var spreadsheetNameEditAction = null;

                var selection = null;
                var selectionAnchor = null;
                var selectionAction = null;

                var label = null;
                var labelAction = null;

                var select = null;
                var settings = null;
                var settingsItem = null;
                var settingsAction = null;

                do {
                    var token = tokens.shift();
                    if(SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT_TOKEN === token){
                        spreadsheetNameEdit = true;
                        token = tokens.shift();

                        // /$id/$name/name/save/$new-spreadsheet-name
                        if(SpreadsheetHistoryHashTokens.SAVE === token){
                            token = tokens.shift();
                            if(null == token){
                                break;
                            }
                            spreadsheetNameEditAction = new SpreadsheetNameSaveHistoryHashToken(
                                new SpreadsheetName(
                                    decodeURIComponent(token)
                                )
                            );
                            token = tokens.shift();
                        }
                    }

                    // /cell/A1.........................................................................................
                    if(SpreadsheetHistoryHashTokens.CELL === token){
                        try {
                            selection = spreadsheetCellReferenceOrLabelNameParse(tokens.shift())
                                .cellOrRange();
                        } catch(invalid) {
                            errors("Cell: " + invalid.message);
                            break;
                        }
                        token = tokens.shift();

                        // /cell/A1:B2/$anchor
                        for(const anchor of selection.anchors()) {
                            if(token === anchor.toHistoryHashToken()){
                                selectionAnchor = anchor;
                                token = tokens.shift();
                                break;
                            }
                        }

                        // /cell/A1/delete
                        if(SpreadsheetHistoryHashTokens.CLEAR === token){
                            selectionAction = SpreadsheetCellClearHistoryHashToken.INSTANCE;
                            token = tokens.shift();
                        } else {
                            if(SpreadsheetHistoryHashTokens.DELETE === token){
                                selectionAction = SpreadsheetCellDeleteHistoryHashToken.INSTANCE;
                                token = tokens.shift();
                            }else {
                                // /cell/A1/formula
                                if(SpreadsheetHistoryHashTokens.CELL_FORMULA === token && selection instanceof SpreadsheetCellReferenceOrLabelName){
                                    selectionAction = new SpreadsheetFormulaLoadAndEditHistoryHashToken();
                                    token = tokens.shift();

                                    // /cell/A1/formula/save/$formula-text
                                    if(SpreadsheetHistoryHashTokens.SAVE === token){
                                        token = tokens.shift();
                                        if(null == token){
                                            break;
                                        }
                                        selectionAction = new SpreadsheetFormulaSaveHistoryHashToken(decodeURIComponent(token));
                                        token = tokens.shift();
                                    }
                                } else {
                                    // /cell/A1/menu OR /cell/A1:B2/menu
                                    if(SpreadsheetHistoryHashTokens.MENU === token){
                                        selectionAction = SpreadsheetCellMenuHistoryHashToken.INSTANCE;
                                        token = tokens.shift();
                                    }
                                }
                            }
                        }

                    }else {
                        // column.......................................................................................
                        if(SpreadsheetHistoryHashTokens.COLUMN === token){
                            try {
                                selection = SpreadsheetColumnReferenceRange.parse(tokens.shift())
                                    .columnOrRange();
                            } catch(invalid) {
                                errors("Column: " + invalid.message);
                                break;
                            }
                            token = tokens.shift();
                        }else {
                            // row...................................................................................
                            if(SpreadsheetHistoryHashTokens.ROW === token){
                                try {
                                    selection = SpreadsheetRowReferenceRange.parse(tokens.shift())
                                        .rowOrRange();
                                } catch(invalid) {
                                    errors("Row: " + invalid.message);
                                    break;
                                }
                                token = tokens.shift();
                            }
                        }

                        if(selection){
                            // column | row then anchor.................................................................
                            for(const anchor of selection.anchors()) {
                                if(token === anchor.toHistoryHashToken()){
                                    selectionAnchor = anchor;
                                    token = tokens.shift();
                                    break;
                                }
                            }

                            // column | row / delete....................................................................
                            if(SpreadsheetHistoryHashTokens.CLEAR === token){
                                selectionAction = SpreadsheetColumnOrRowClearHistoryHashToken.INSTANCE;
                                token = tokens.shift();
                            } else {
                                if(SpreadsheetHistoryHashTokens.DELETE === token){
                                    selectionAction = SpreadsheetColumnOrRowDeleteHistoryHashToken.INSTANCE;
                                    token = tokens.shift();
                                }else {
                                    // column/A/freeze OR /row/1/freeze
                                    if(SpreadsheetHistoryHashTokens.FREEZE === token){
                                        if(!selection.canFreeze()){
                                            selection = null;
                                        }else {
                                            selectionAction = SpreadsheetColumnOrRowFreezeHistoryHashToken.INSTANCE;
                                        }
                                        token = tokens.shift();
                                    }else {
                                        if(SpreadsheetHistoryHashTokens.HIDDEN === token){
                                            const value = tokens.shift();
                                            if(!value){
                                                break; // value required but missing.
                                            }
                                            selectionAction = new SpreadsheetColumnOrRowSaveHistoryHashToken(
                                                token,
                                                "true" === value ? true :
                                                    "false" === value ? false :
                                                        value
                                            );
                                            token = tokens.shift();
                                        }else {
                                            // column | row / insert-after / 123...................................................
                                            if(SpreadsheetHistoryHashTokens.INSERT_AFTER === token){
                                                const insertAfterCount = tokens.shift();
                                                if(!insertAfterCount || Number.isNaN(Number(insertAfterCount))){
                                                    break;
                                                }
                                                try {
                                                    selectionAction = new SpreadsheetColumnOrRowInsertAfterHistoryHashToken(Number(insertAfterCount));
                                                } catch(invalid) {
                                                    errors("Insert after count: " + invalid.message);
                                                    break;
                                                }
                                                token = tokens.shift();
                                            }else {
                                                // column | row / insert-before / 123...............................................
                                                if(SpreadsheetHistoryHashTokens.INSERT_BEFORE === token){
                                                    const insertBeforeCount = tokens.shift();
                                                    if(!insertBeforeCount || Number.isNaN(Number(insertBeforeCount))){
                                                        break;
                                                    }
                                                    try {
                                                        selectionAction = new SpreadsheetColumnOrRowInsertBeforeHistoryHashToken(Number(insertBeforeCount));
                                                    } catch(invalid) {
                                                        errors("Insert before count: " + invalid.message);
                                                        break;
                                                    }
                                                    token = tokens.shift();
                                                }else {
                                                    if(SpreadsheetHistoryHashTokens.MENU === token){
                                                        selectionAction = SpreadsheetColumnOrRowMenuHistoryHashToken.INSTANCE;
                                                        token = tokens.shift();
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    if(SpreadsheetHistoryHashTokens.LABEL === token){
                        try {
                            label = SpreadsheetLabelName.parse(tokens.shift());
                        } catch(invalid) {
                            errors("Label: " + invalid.message);
                            break;
                        }
                        token = tokens.shift();
                        if(SpreadsheetHistoryHashTokens.DELETE === token){
                            labelAction = SpreadsheetLabelMappingDeleteHistoryHashToken.INSTANCE;
                            token = tokens.shift();
                        }else {
                            if(SpreadsheetHistoryHashTokens.SAVE === token){
                                if(label && tokens.length < 2){
                                    errors("Label save missing label or cell");
                                    break;
                                }
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
                                token = tokens.shift();
                            }
                        }
                    }

                    // select
                    if(SpreadsheetHistoryHashTokens.SELECT === token){
                        select = true;
                        token = tokens.shift();
                    }

                    // /settings/
                    if(SpreadsheetHistoryHashTokens.SETTINGS === token){
                        settings = true;
                        settingsItem = undefined;
                        settingsAction = null;

                        token = tokens.shift();
                        if(null != token){
                            if(isSettingsToken(token)){
                                settingsItem = token;
                                token = tokens.shift();

                                // /settings/$property/save/$value
                                if(isSettingsSaveableToken(settingsItem)){
                                    if(SpreadsheetHistoryHashTokens.SAVE === token){
                                        if(tokens.length === 0){
                                            break;
                                        }
                                        token = tokens.shift();
                                        settingsAction = new SpreadsheetSettingsSaveHistoryHashToken(
                                            "" === token ? null : decodeURIComponent(token)
                                        );
                                        token = tokens.shift();
                                    }
                                }
                            }else {
                                break;
                            }
                        }
                    }
                    if(null != token){
                        errors("Invalid token: " + CharSequences.quoteAndEscape(token));
                        break;
                    }else {
                        if(tokens.length > 0){
                            errors("Invalid token: " + CharSequences.quoteAndEscape(tokens.shift()));
                            break;
                        }
                    }

                    // populate history tokens.........................................................................

                    if(spreadsheetNameEdit){
                        historyHashTokens[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT] = spreadsheetNameEdit;

                        if(spreadsheetNameEditAction){
                            historyHashTokens[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT_ACTION] = spreadsheetNameEditAction;
                        }
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
                        if(settingsItem){
                            historyHashTokens[SpreadsheetHistoryHashTokens.SETTINGS_ITEM] = settingsItem;
                        }
                        if(settingsAction){
                            historyHashTokens[SpreadsheetHistoryHashTokens.SETTINGS_ACTION] = settingsAction;
                        }
                    }
                } while(false);
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

        var spreadsheetNameEdit = tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT];
        var spreadsheetNameEditAction = tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT_ACTION];

        var selection = tokens[SpreadsheetHistoryHashTokens.SELECTION];
        var selectionAnchor = tokens[SpreadsheetHistoryHashTokens.SELECTION_ANCHOR];
        var selectionAction = tokens[SpreadsheetHistoryHashTokens.SELECTION_ACTION];

        var label = tokens[SpreadsheetHistoryHashTokens.LABEL];
        var labelAction = tokens[SpreadsheetHistoryHashTokens.LABEL_ACTION];

        var select = tokens[SpreadsheetHistoryHashTokens.SELECT];
        var settings = tokens[SpreadsheetHistoryHashTokens.SETTINGS];
        var settingsItem = tokens[SpreadsheetHistoryHashTokens.SETTINGS_ITEM];
        var settingsAction = tokens[SpreadsheetHistoryHashTokens.SETTINGS_ACTION];

        const verified = {};

        if(spreadsheetId){
            verified[SpreadsheetHistoryHashTokens.SPREADSHEET_ID] = spreadsheetId;

            if(spreadsheetName){
                verified[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME] = spreadsheetName;
                if(spreadsheetNameEdit && (selection || label || select || settings)){
                    spreadsheetNameEdit = false;
                    selection = false;
                    label = false;
                    select = false;
                }
                if(spreadsheetNameEdit){
                    selection = false;
                    label = false;
                    select = false;
                }
                if(selection || label || select || settings){
                    spreadsheetNameEdit = false;
                }
                if(spreadsheetNameEdit){
                    verified[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT] = spreadsheetNameEdit;

                    if(spreadsheetNameEditAction instanceof SpreadsheetNameHistoryHashToken){
                        verified[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT_ACTION] = spreadsheetNameEditAction;
                    }
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

                        if(selection.isCellScalarOrRange() && selectionAction instanceof SpreadsheetCellHistoryHashToken){
                            verified[SpreadsheetHistoryHashTokens.SELECTION_ACTION] = selectionAction;
                        }

                        if(selection.isColumnOrRowScalarOrRange() && selectionAction instanceof SpreadsheetColumnOrRowHistoryHashToken){
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

                    if(settingsItem){
                        verified[SpreadsheetHistoryHashTokens.SETTINGS_ITEM] = settingsItem;

                        let verifiedSettingsAction = null;

                        if(isSettingsToken(settingsItem)){
                            if(settingsAction instanceof SpreadsheetSettingsHistoryHashToken){
                                verifiedSettingsAction = settingsAction;
                            }
                        }
                        if(isSettingsToken(settingsItem) && settingsAction instanceof SpreadsheetSettingsHistoryHashToken){
                            verifiedSettingsAction = settingsAction;
                        }
                        if(isSettingsSaveableToken(settingsItem) && settingsAction instanceof SpreadsheetSettingsHistoryHashToken){
                            verifiedSettingsAction = settingsAction;
                        }

                        if(verifiedSettingsAction){
                            verified[SpreadsheetHistoryHashTokens.SETTINGS_ACTION] = verifiedSettingsAction;
                        }
                    }
                }
            }
        }

        return copyTx(tokens, verified);
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

        var spreadsheetNameEdit = current[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT];
        var spreadsheetNameEditAction = current[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT_ACTION];

        var selection = current[SpreadsheetHistoryHashTokens.SELECTION];
        var selectionAnchor = current[SpreadsheetHistoryHashTokens.SELECTION_ANCHOR];
        var selectionAction = current[SpreadsheetHistoryHashTokens.SELECTION_ACTION];

        var label = current[SpreadsheetHistoryHashTokens.LABEL];
        var labelAction = current[SpreadsheetHistoryHashTokens.LABEL_ACTION];

        var select = current[SpreadsheetHistoryHashTokens.SELECT];

        var settings = current[SpreadsheetHistoryHashTokens.SETTINGS];
        var settingsItem = current[SpreadsheetHistoryHashTokens.SETTINGS_ITEM];
        var settingsAction = current[SpreadsheetHistoryHashTokens.SETTINGS_ACTION];

        // try replacing...
        if(delta.hasOwnProperty(SpreadsheetHistoryHashTokens.SPREADSHEET_ID)){
            spreadsheetId = delta[SpreadsheetHistoryHashTokens.SPREADSHEET_ID];
        }

        if(delta.hasOwnProperty(SpreadsheetHistoryHashTokens.SPREADSHEET_NAME)){
            spreadsheetName = delta[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME];
        }

        if(delta.hasOwnProperty(SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT) || delta.hasOwnProperty(SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT_ACTION)){
            if(delta.hasOwnProperty(SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT)){
                spreadsheetNameEdit = !!delta[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT];
            }
            if(delta.hasOwnProperty(SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT_ACTION)){
                spreadsheetNameEditAction = delta[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT_ACTION];
            }

            if(spreadsheetNameEdit || spreadsheetNameEditAction){
                selection = null;
                selectionAction = null;
                label = null;
                select = null;
                settings = null;
                settingsItem = null;
                settingsAction = null;
            }
        }

        if(delta.hasOwnProperty(SpreadsheetHistoryHashTokens.SELECTION)){
            selection = delta[SpreadsheetHistoryHashTokens.SELECTION];
            if(selection){
                spreadsheetNameEdit = false;
            }
        }

        if(delta.hasOwnProperty(SpreadsheetHistoryHashTokens.SELECTION_ANCHOR)){
            selectionAnchor = delta[SpreadsheetHistoryHashTokens.SELECTION_ANCHOR];
            if(selectionAnchor instanceof SpreadsheetViewportSelectionAnchor){
                spreadsheetNameEdit = false;
            }
        }

        if(delta.hasOwnProperty(SpreadsheetHistoryHashTokens.SELECTION_ACTION)){
            selectionAction = delta[SpreadsheetHistoryHashTokens.SELECTION_ACTION];
            if(selectionAction instanceof SpreadsheetSelectionHistoryHashToken){
                spreadsheetNameEdit = false;
            }
        }

        if(delta.hasOwnProperty(SpreadsheetHistoryHashTokens.LABEL)){
            label = delta[SpreadsheetHistoryHashTokens.LABEL];
            if(label){
                spreadsheetNameEdit = false;
            }
        }

        if(delta.hasOwnProperty(SpreadsheetHistoryHashTokens.LABEL_ACTION)){
            labelAction = delta[SpreadsheetHistoryHashTokens.LABEL_ACTION];
            if(labelAction instanceof SpreadsheetLabelMappingHistoryHashToken){
                spreadsheetNameEdit = false;
            }
        }

        if(delta.hasOwnProperty(SpreadsheetHistoryHashTokens.SELECT)){
            select = delta[SpreadsheetHistoryHashTokens.SELECT];
            if(select){
                spreadsheetNameEdit = false;
            }
        }

        if(delta.hasOwnProperty(SpreadsheetHistoryHashTokens.SETTINGS)){
            settings = delta[SpreadsheetHistoryHashTokens.SETTINGS];
            if(settings){
                spreadsheetNameEdit = false;
            }
        }

        if(delta.hasOwnProperty(SpreadsheetHistoryHashTokens.SETTINGS_ITEM)){
            settingsItem = delta[SpreadsheetHistoryHashTokens.SETTINGS_ITEM];
            if(settingsItem){
                if(!isSettingsToken(settingsItem)){
                    settingsItem = null;
                }
                spreadsheetNameEdit = false;
            }
        }

        if(delta.hasOwnProperty(SpreadsheetHistoryHashTokens.SETTINGS_ACTION)){
            settingsAction = delta[SpreadsheetHistoryHashTokens.SETTINGS_ACTION];
            if(settingsAction){
                if(!isSettingsSaveableToken(settingsItem)){
                    settingsAction = null;
                }
                spreadsheetNameEdit = false;
            }
        }

        const merged = SpreadsheetHistoryHashTokens.emptyTokens();
        let valid = false;

        if(null != spreadsheetId){
            merged[SpreadsheetHistoryHashTokens.SPREADSHEET_ID] = spreadsheetId;

            if(null != spreadsheetName){
                merged[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME] = spreadsheetName;

                valid = true;
                if(spreadsheetNameEdit || spreadsheetNameEditAction){
                    if(selection || label || select || settings){
                        valid = false;
                    }
                }
            }
        }

        if(valid){
            if(spreadsheetNameEdit){
                merged[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT] = spreadsheetNameEdit;
            }

            if(spreadsheetNameEditAction){
                merged[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT_ACTION] = spreadsheetNameEditAction;
            }

            if(selection){
                merged[SpreadsheetHistoryHashTokens.SELECTION] = selection;
            }
            if(selectionAnchor instanceof SpreadsheetViewportSelectionAnchor){
                merged[SpreadsheetHistoryHashTokens.SELECTION_ANCHOR] = selectionAnchor;
            }

            if(selectionAction instanceof SpreadsheetSelectionHistoryHashToken){
                merged[SpreadsheetHistoryHashTokens.SELECTION_ACTION] = selectionAction;
            }

            if(label){
                merged[SpreadsheetHistoryHashTokens.LABEL] = label;
            }

            if(labelAction instanceof SpreadsheetLabelMappingHistoryHashToken){
                merged[SpreadsheetHistoryHashTokens.LABEL_ACTION] = labelAction;
            }

            if(null != select){
                merged[SpreadsheetHistoryHashTokens.SELECT] = select;
            }

            if(null != settings){
                merged[SpreadsheetHistoryHashTokens.SETTINGS] = settings;
            }
            if(typeof settingsItem !== "undefined"){
                merged[SpreadsheetHistoryHashTokens.SETTINGS_ITEM] = settingsItem;
            }
            if(typeof settingsAction !== "undefined"){
                merged[SpreadsheetHistoryHashTokens.SETTINGS_ACTION] = settingsAction;
            }
        }

        return SpreadsheetHistoryHash.validate(merged);
    }

    /**
     * Accepts some history tokens, verifies the combinations are valid and returns the hash without the leading hash-sign.
     */
    static stringify(tokens) {
        var spreadsheetId = tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_ID];
        var spreadsheetName = tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME];

        var spreadsheetNameEdit = tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT];
        var spreadsheetNameEditAction = tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT_ACTION];

        var selection = tokens[SpreadsheetHistoryHashTokens.SELECTION];
        var selectionAnchor = tokens[SpreadsheetHistoryHashTokens.SELECTION_ANCHOR];
        var selectionAction = tokens[SpreadsheetHistoryHashTokens.SELECTION_ACTION];

        var label = tokens[SpreadsheetHistoryHashTokens.LABEL];
        var labelAction = tokens[SpreadsheetHistoryHashTokens.LABEL_ACTION];

        var select = tokens[SpreadsheetHistoryHashTokens.SELECT];

        var settings = tokens[SpreadsheetHistoryHashTokens.SETTINGS];
        var settingsItem = tokens[SpreadsheetHistoryHashTokens.SETTINGS_ITEM];
        var settingsAction = tokens[SpreadsheetHistoryHashTokens.SETTINGS_ACTION];

        let hash = "";
        let valid = false;

        if(null != spreadsheetId){
            hash = "/" + spreadsheetId;

            if(null != spreadsheetName){
                hash = hash + "/" + spreadsheetName;

                valid = true;
                if(spreadsheetNameEdit){
                    if(selection || label || select || settings){
                        valid = false;
                    }
                }
            }
        }

        if(valid){
            if(spreadsheetNameEdit){
                hash = hash + "/" + SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT_TOKEN;

                if(spreadsheetNameEditAction instanceof SpreadsheetNameHistoryHashToken){
                    hash = hash + "/" + spreadsheetNameEditAction.toHistoryHashToken();
                }

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

                if(selectionAction instanceof SpreadsheetSelectionHistoryHashToken){
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

                if(settingsItem){
                    hash = hash + "/" + settingsItem;

                    if(settingsAction){
                        hash = hash + settingsAction.toHistoryHashToken();
                    }
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
    }

    onHistoryChange(e) {
        SpreadsheetHistoryHashTokens.newTxId();

        const newURL = e.newURL;
        const hashStart = newURL.indexOf("#");
        const hash = hashStart > -1 ? newURL.substring(hashStart + 1) : "";

        var errors = false;
        const tokens = SpreadsheetHistoryHash.parse(
            hash,
            (e) => {
                this.showError(e);
                errors = true;
            }
        );

        if(errors){
            this.push(tokens);
        }

        console.log("onHistoryChange txId:" + tokens[SpreadsheetHistoryHashTokens.TX_ID] + " newUrl: " + newURL + " WAS " + e.oldURL + " " + hash + " tokens: ", tokens);
        for(const listener of this.listeners.listeners.slice()) {
            listener(Object.assign({}, tokens));
        }
    }

    tokens() {
        const hash = this.hash();
        const tokens = SpreadsheetHistoryHash.parse(
            hash,
            this.showError
        );
        return tokens;
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
     * Note if the merge and push updated the hash that will be returned otherwise null is returned.
     */
    mergeAndPush(tokens) {
        return this.push(SpreadsheetHistoryHash.merge(this.tokens(), tokens));
    }

    /**
     * Pushes the given tokens after converting them to a string, returning the hash that was pushed.
     */
    push(tokens) {
        const validated = SpreadsheetHistoryHash.validate(tokens);
        const tokensHash = SpreadsheetHistoryHash.stringify(validated);

        this.setHash(tokensHash);

        return tokensHash;
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
        const only = SpreadsheetHistoryHashTokens.emptyTokens();

        only[SpreadsheetHistoryHashTokens.SPREADSHEET_ID] = tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_ID];
        only[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME] = tokens[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME];

        return only;
    }

    /**
     * Factory that builds a MenuItem with the given text and a link created from the given history hash tokens.
     */
    menuItem(text, id, disabled, historyTokens) {
        const copy = Object.assign({}, historyTokens);

        const href = "#" + SpreadsheetHistoryHash.stringify(historyTokens);

        // unfortunately href is not honoured and does not update history
        return <MenuItem key={href}
                         id={id}
                         disabled={disabled}
                         href={href}
                         onClick={() => this.mergeAndPush(copy)}
                         tabIndex={0}>{
            text
        }</MenuItem>;
    }

    /**
     * Toggles the settings widget open becomes close and vice versa.
     */
    settingsToggle() {
        const tokens = this.tokens();
        tokens[SpreadsheetHistoryHashTokens.SETTINGS] = !Boolean(tokens[SpreadsheetHistoryHashTokens.SETTINGS]);
        this.push(tokens);
    }
}