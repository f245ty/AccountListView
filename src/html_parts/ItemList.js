import React from 'react';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import Dialog from './Dialog';
// import getCSVTasks from './getCSVTasks';
import ListHeader from './ListHeader';
import Pager from './Pager';
import SearchControl from './SearchControl';
// import isAccessTokenEnable from '../function/isAccessTokenEnable';
// import { OUTPUT_LABELS } from './config/config_local';
import {
    CSV_TTL,
    ERR_WAIT_MSG,
    EXPLANATION,
    NO_DATA_MSG,
    SEARCH_CONDITION,
    SEARCH_CONDITION_FOLDER
} from '../config/message';

/**
 * JSON の配列に行番号を付与して表示する コンポーネント
 * @module ItemList
 */
class ItemList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            type: "",     // user or folder
            id: null,   // 表示中の検索ID
            sort: { "folder": "" },
            order: "",   // ASC or DESC
            items: [],
            pages: null,   // 全体ページ数
            rows: null,   // 1ページの表示件数
            page: null,   // 表示するページ番号
            total: 0,    // 検索合計件数
            datetime: "",
            client_config: props.client_config,
            show_dialog: false,
            error: null,
            is_process: false,
        };
    }

    /**
     * 子コンポーネントの検索コントローラがデータをセットする
     * @param {XXX} state XXX
     */
    updateList(state) {
        this.setState({
            type: state.type,
            id: state.id,
            sort: state.sort,
            order: state.order,
            items: state.items,
            pages: state.pages,
            rows: state.rows,
            page: state.page,
            total: state.total,
            datetime: state.datetime,
            show_dialog: state.show_dialog,
            error: state.error,
            is_process: state.is_process,
        });
    }

    /**
     * 
     */
    // onGetCSVTasks() {
    //     if (isAccessTokenEnable(this.props.login_state)) {
    //         getCSVTasks(this.state, this.props.client_config).then((data) => {
    //             // console.log(data)
    //             this.updateList(data)
    //             this.props.offLocationFlag()
    //         })
    //         // console.log(this.props.login_state)
    //     }
    //     console.log("get csv_tasks.")
    // }

    /**
     * 
     * @return {XXX} XXX
     */
    render() {
        var items = this.state.items;

        // メニュー切り替え時、結果表示リセット
        if (this.props.login_state.location_flag) {
            items = []
            this.state.id = null;
        }
        // console.log(this.props.login_state.location_flag)

        var xhr = new XMLHttpRequest();
        xhr.open('GET', items.url);
        // ダイアログ用のハンドラ
        const handleClose = () => this.setState({ show_dialog: false });

        console.log(this.state.items)
        // // ファイル情報集計メニューを選択したときは、APIをGETで叩く
        // if (this.props.login_state.location_flag && this.props.location.hash === "#file") {
        //     console.log("#file ?  " + this.props.location.hash)
        //     this.onGetCSVTasks()
        // }

        return (
            <div>
                <SearchControl id="SearchControl"
                    query={this.state}
                    updateList={(data) => { this.updateList(data); }}
                    login_state={this.props.login_state}
                    client_config={this.state.client_config}
                    location_hash={this.props.location.hash}
                    offLocationFlag={this.props.offLocationFlag}
                />
                {// 検索してないときは何も表示しない
                    // (items.length === 0) && typeof (this.state.id) !== "string" &&
                    (this.props.login_state.location_flag) && (
                        <p>
                            {(this.props.location.hash === "#owner") && (EXPLANATION["owner"])}
                            {(this.props.location.hash === "#user") && (EXPLANATION["user"])}
                            {(this.props.location.hash === "#folder") && (EXPLANATION["folder"])}
                            {(this.props.location.hash === "#file") && (EXPLANATION["file"])}
                            <br />
                            {this.props.location.hash === "#folder" ? SEARCH_CONDITION_FOLDER
                                :
                                this.props.location.hash === "#file" ? CSV_TTL
                                    : SEARCH_CONDITION}
                        </p>
                    )
                }
                {// 検索して結果が0件の時は 結果がないと表示する
                    (items.length === 0) && (!this.props.login_state.location_flag) && (
                        <p>{NO_DATA_MSG}</p>
                    )
                }
                {// エラーが発生した時は、エラーメッセージを表示する
                    (items.length === 0) && (this.state.error !== null) && (
                        <Dialog show={this.state.show_dialog} err_flag={true} text={ERR_WAIT_MSG} handleClose={handleClose} />
                    )
                }
                <div id="List">
                    {/* {console.log(items.url)} */}
                    {// 表示行数が0行の時は表示しない
                        items.url ? (xhr.send())
                        :
                        (items.length !== 0) && (
                            <div>
                                {this.props.location.hash === "#file"
                                    ? <p className="text-left">
                                        {EXPLANATION["file"]}
                                        <br />
                                        {CSV_TTL}
                                    </p>
                                    : <Pager
                                        className="vertical-align-middle"
                                        as={Row}
                                        query={this.state}
                                        updateList={(data) => { this.updateList(data); }}
                                        client_config={this.state.client_config}
                                        user_role={this.props.login_state.user_role} />
                                }
                                <Table striped bordered hover id="res_table">
                                    <tbody>
                                        <ListHeader id="res_table"
                                            query={this.state}
                                            updateList={(data) => { this.updateList(data); }}
                                            client_config={this.state.client_config}
                                            location_hash={this.props.location.hash}
                                        />

                                        {items.map((row, index) => (
                                            <tr key={index}>
                                                {Object.keys(row).map((col, index) => {
                                                    return (
                                                        <td key={index} 
                                                            className={col.indexOf('p_') === 0 || col === '#' || col === 'create_at' || col === 'csv_ttl' || col === 'process_state' || col === 'download_ln' 
                                                            ? "text-center" 
                                                            : "text-left"}>
                                                            {col === 'download_ln' ? <a href={row[col]} role="button">{row[col]}</a> : row[col]}
                                                        </td>
                                                    )
                                                })}
                                            </tr>))}
                                    </tbody>
                                </Table>
                            </div>
                        )
                    }
                </div>
            </div>
        );
    }
}

export default ItemList;
