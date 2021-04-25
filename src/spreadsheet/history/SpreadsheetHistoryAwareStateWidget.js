import PropTypes from "prop-types";
import SpreadsheetHistoryAwareWidget from "./SpreadsheetHistoryAwareWidget.js";
import SpreadsheetHistoryHash from "./SpreadsheetHistoryHash.js";

/**
 * A React.Component that is also interested in history change events. Some of the basics like registering a history
 * listener, and reacting to history and state changes are implemented with template methods requiring overriding.
 */
export default class SpreadsheetHistoryAwareStateWidget extends SpreadsheetHistoryAwareWidget {

    constructor(props) {
        super(props);
        this.initializeState();
    }

    initializeState() {
        this.state = Object.assign(
            this.initialStateFromProps(this.props),
            this.stateFromHistoryTokens(SpreadsheetHistoryHash.parse(this.history.location.pathname))
        );
    }

    /**
     * Loads the initial state from props. This will be merged with the history hash to form the initial state.
     */
    initialStateFromProps(props) {
        throw new Error("Sub classes must override initialStateFromProps");
    }

    onHistoryChange(tokens) {
        this.setState(this.stateFromHistoryTokens(tokens));
    }

    /**
     * Accepts the tokens from the history hash. This may in turn be used to create state for this widget.
     * This is mostly a filter and mapping process from hash tokens to state.
     */
    stateFromHistoryTokens(tokens) {
        throw new Error("Sub classes must override stateFromHistoryTokens");
    }

    /**
     * If the cell being edited was updated update the history.
     */
    componentDidUpdate(prevProps, prevState, snapshot) {
        const state = this.state;
        console.log("componentDidUpdate", "prevState", prevState, "state", state);

        this.historyTokensFromState(prevState);
    }

    /**
     * Updates history after examining the change in the state.
     */
    historyTokensFromState(prevState) {
        throw new Error("Sub classes must override historyTokensFromState()");
    }
}

SpreadsheetHistoryAwareStateWidget.propTypes = {
    history: PropTypes.object.isRequired,
}
