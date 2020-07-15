import React from 'react';
import Table from 'react-bootstrap/Table';
import TableBody from './SearchResultTable/TableBody'
import TableHeader from './SearchResultTable/TableHeader'
import TablePagination from './SearchResultTable/TablePagination'
import Dialog from '../Dialog';
import { CSV_ERR, CSV_LOADING } from '../../config/message';

class SearchResultTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            csv_flag: true,     // CSVダウンロード実行中判定
            err_flag: false,    // エラーモーダル表示判定用
            loading: false,     // ロードモーダル表示判定用
            text: ""            // モーダルに表示する内容
        }
    }

    handleChangeTableItems = (tableItems) => {
        this.props.handleChangeTableItems(tableItems);
    }

    onChangeLoading = (flag) => {
        this.setState({
            csv_flag: true,
            err_flag: false,
            loading: flag,
            text: CSV_LOADING
        })
    }

    onChangeError = () => {
        this.setState({
            csv_flag: false,
            err_flag: true,
            text: CSV_ERR
        })
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
                                onChangeError={this.onChangeError}
                            />
                        </Table>
                        <Dialog
                            show={this.state.loading}
                            csv_flag={this.state.csv_flag}
                            err_flag={this.state.err_flag}
                            text={this.state.text}
                            handleClose={this.handleClose}
                        />
                    </div>
                )}
            </>
        )
    }
}

export default SearchResultTable
