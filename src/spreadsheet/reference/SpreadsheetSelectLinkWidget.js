import Link from "@material-ui/core/Link";
import PropTypes from 'prop-types';
import React from 'react';
import SpreadsheetHistoryHash from "../history/SpreadsheetHistoryHash.js";
import SpreadsheetHistoryAwareStateWidget from "../history/SpreadsheetHistoryAwareStateWidget.js";

/**
 * A widget that updates the href of a Link to which when clicked will display the navigate modal.
 * <ol>
 *     <li>target: the target link hash that will be displayed by the link</li>
 *     <li>cell: the cell displayed as text by the link</li>
 * </ol>
 */
export default class SpreadsheetSelectLinkWidget extends SpreadsheetHistoryAwareStateWidget {

    init() {
    }

    initialStateFromProps(props) {
        return {};
    }

    /**
     * Recreate the target of the link.
     */
    stateFromHistoryTokens(tokens) {
        tokens[SpreadsheetHistoryHash.SELECT] = true;

        return {
            target: '#' + this.props.history.mergeAndStringify(tokens),
            cell: tokens[SpreadsheetHistoryHash.SELECTION],
        };
    }

    historyTokensFromState(prevState) {
        return {}; // never update history from state.
    }

    render() {
        const {cell, target} = this.state;

        return <Link id="select-Link"
                     disabled={!cell}
                     href={target}
                     style={{
                         display: "inline-block",
                         paddingLeft: "1ex",
                         paddingRight: "1ex",
                         paddingTop: "2px",
                         paddingBottom: "2px",
                     }}>{
            cell ? cell.toString() : "Go"
        }</Link>
    }
}

SpreadsheetSelectLinkWidget.propTypes = {
    history: PropTypes.instanceOf(SpreadsheetHistoryHash).isRequired,
    showError: PropTypes.func.isRequired,
}