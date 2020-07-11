import React from 'react';
import Table from 'react-bootstrap/Table';
import TableBody from './SearchResultTable/TableBody'
import TableHeader from './SearchResultTable/TableHeader'
import TablePagination from './SearchResultTable/TablePagination'
import Dialog from '../Dialog';
import { CSV_LOADING } from '../../config/message';

class SearchResultTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }

    handleChangeTableItems = (tableItems) => {
        this.props.handleChangeTableItems(tableItems);
    }

    onChangeLoading = (flag) => {
        this.setState({ loading: flag })
    }

    /**
     * ダイアログ用のハンドラ
     */
    handleClose = () => {
        this.setState({ loading: false });
    }

    render() {
        return (
            <>
                {(this.props.login_state.items.length !== 0) && (
                    <div>
                        {this.props.location.hash === "#file"
                            ? null
                            :
                            <TablePagination
                                login_state={this.props.login_state}
                                location={this.props.location}
                                handleChangeTableItems={this.handleChangeTableItems}
                            />
                        }
                        <Table striped bordered hover id="res_table">
                            <TableHeader
                                login_state={this.props.login_state}
                                location={this.props.location}
                                handleChangeTableItems={this.handleChangeTableItems}
                            />
                            <TableBody
                                login_state={this.props.login_state}
                                location={this.props.location}
                                handleChangeTableItems={this.handleChangeTableItems}
                                onChangeLoading={this.onChangeLoading}
                            />
                        </Table>
                        <Dialog
                            show={this.state.loading}
                            csv_flag={true}
                            text={CSV_LOADING}
                            handleClose={this.handleClose}
                        />
                    </div>
                )}
            </>
        )
    }
}

export default SearchResultTable
