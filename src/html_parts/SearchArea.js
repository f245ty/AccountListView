import React from 'react';
import SearchBar from './SearchArea/SearchBar'
import SystemMessage from './SearchArea/SystemMessage'
import SearchResultTable from './SearchArea/SearchResultTable'

class SearchArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    handleChangeText = (event) => {
        this.props.onChangeText(event);
    }

    handleChangeLocationFlg = () => {
        this.props.onChangeLocationFlg();
    }

    handleChangeSystemMsg = () => {
        this.props.onChangeSystemMsg();
    }

    handleChangeShowDialog = (dialog_text) => {
        this.props.onChangeShowDialog(dialog_text);
    }

    handleChangeTableItems = (tableItems, num) => {
        this.props.onChangeTableItems(tableItems, num);
    }

    render() {
        return (
            <>
                <SearchBar
                    login_state={this.props.login_state}
                    location={this.props.location}
                    handleChangeText={this.handleChangeText}
                    handleChangeLocationFlg={this.handleChangeLocationFlg}
                    handleChangeShowDialog={this.handleChangeShowDialog}
                    handleChangeTableItems={this.handleChangeTableItems}
                    handleChangeSystemMsg={this.handleChangeSystemMsg}
                />
                <SystemMessage
                    login_state={this.props.login_state}
                    location={this.props.location}
                />
                <br />
                <div id="List">
                    <SearchResultTable
                        login_state={this.props.login_state}
                        location={this.props.location}
                        handleChangeTableItems={this.handleChangeTableItems}
                        handleChangeShowDialog={this.handleChangeShowDialog}
                    />
                </div>
            </>
        )
    }
}

export default SearchArea
