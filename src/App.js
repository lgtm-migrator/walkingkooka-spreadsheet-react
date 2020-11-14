import React from 'react';
import './App.css';

import SpreadsheetAppBarTop from "./components/SpreadsheetAppBarTop/SpreadsheetAppBarTop.js";
import SpreadsheetContent from "./components/SpreadsheetContent/SpreadsheetContent.js";
import SpreadsheetFormula from "./components/SpreadsheetFormula/SpreadsheetFormula.js";
import SpreadsheetMetadata from "./spreadsheet/meta/SpreadsheetMetadata.js";
import SpreadsheetMessenger from "./util/SpreadsheetMessenger.js";

import Divider from '@material-ui/core/Divider';

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            spreadsheetMetadata: SpreadsheetMetadata.EMPTY
        }

        const handleSpreadsheetMetadata = (metadata) => {
            console.log("handleSpreadsheetMetadata " + new SpreadsheetMetadata(metadata));

            this.dispatchSpreadsheetMetadataListeners(new SpreadsheetMetadata(metadata));
        }

        const handleSpreadsheetDelta = (delta) => {
            this.setState({cells: delta.cells}); // TODO dispatch listeners
        }

        // the names must match the name of the classes in walkingkooka-spreadsheet
        this.messenger = new SpreadsheetMessenger({
                "SpreadsheetMetadataNonEmpty": handleSpreadsheetMetadata,
                "SpreadsheetDeltaNonWindowed": handleSpreadsheetDelta,
                "SpreadsheetDeltaWindowed": handleSpreadsheetDelta,
            });
        this.messenger.setWebWorker(false); // TODO test webworker mode
    }

    componentDidMount() {
        this.createEmptySpreadsheet(); // TODO add logic to allow selecting: create empty, prompt to load and more.
    }

    /**
     * Makes a request which returns some basic default metadata, and without cells the spreadsheet will be empty.
     */
    createEmptySpreadsheet() {
        this.messenger.send("/api/spreadsheet",
            {
                method: "POST"
            });
    }

    /**
     * Renders the basic spreadsheet layout.
     */
    render() {
        console.log("App.render " + this.state);

        return (
            <div>
                <SpreadsheetAppBarTop app={this}/>
                <Divider/>
                <SpreadsheetFormula/>
                <Divider/>
                <SpreadsheetContent/>
            </div>
        );
    }

    spreadsheetMetadata() {
        return this.state.spreadsheetMetadata;
    }

    /**
     * Updates the state and saves the metadata.
     */
    saveSpreadsheetMetadata(metadata) {
        console.log("saveSpreadsheetMetadata: " + metadata);

        //this.setState({spreadsheetMetadata: metadata});
        this.messenger.send("/api/spreadsheet/" + metadata.spreadsheetId(), {
            "method": "POST",
            "body": JSON.stringify(metadata.toJson())
        });
    }

    addSpreadsheetMetadataListener(listener) {
        this.spreadsheetMetadataListeners.push(listener);
    }

    removeSpreadsheetMetadataListener(listener) {
        const index = this.spreadsheetMetadataListeners.indexOf(listener);
        if(-1 !== index) {
            this.spreadsheetMetadataListeners = this.spreadsheetMetadataListeners.slice(index, 1);
        }
    }

    dispatchSpreadsheetMetadataListeners(metadata) {
        this.spreadsheetMetadataListeners.forEach(l => l.setState({spreadsheetMetadata: metadata}))
    }

    spreadsheetMetadataListeners = [];

    toString() {
        return this.spreadsheetMetadata().toString();
    }
}
