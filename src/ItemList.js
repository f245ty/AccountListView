////////////////////////////////////////////////////////////////////////////////
//
//  JSON の配列に行番号を付与して表示する コンポーネント
//

import React from 'react';
import SearchControl from './SearchControl';
import ListHeader from './ListHeader';
import Pager from './Pager';
import Table from 'react-bootstrap/Table';
import { Row } from 'react-bootstrap';
import Dialog from './Dialog';
import { ERR_WAIT_MSG } from './message';


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
            error: null
        };
    }


    // 子コンポーネントの検索コントローラがデータをセットする
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
            error: state.error
        });
    }


    render() {

        var items = this.state.items;
        console.log(this.state)
        var xhr = new XMLHttpRequest();
        xhr.open('GET', items.url);
        // ダイアログ用のハンドラ
        const handleClose = () => this.setState({ show_dialog: false });
        

        return (
            <div>
                <SearchControl id="SearchControl"
                    query={this.state}
                    header_label={this.header_label}
                    updateList={(data) => { this.updateList(data); }}
                    login_state={this.props.login_state}
                    client_config={this.state.client_config}
                // handleLoading={handleLoading}
                // handleNotLoading={handleNotLoading} 
                />
                {// 検索してないときは何も表示しない
                    (items.length === 0) && typeof (this.state.id) !== "string" && (
                        <p>検索条件を入力し検索してください。</p>
                    )
                }
                {// 検索して結果が0件の時は 結果がないと表示する
                    (items.length === 0) && typeof (this.state.id) === "string" && (
                        <p>該当するデータが見つかりませんでした。</p>
                    )
                }
                {// エラーが発生した時は、エラーメッセージを表示する
                    (items.length === 0) && (this.state.error) && (
                        <Dialog show={this.state.show_dialog} err_flag={true} text={ERR_WAIT_MSG} handleClose={handleClose} />
                    )
                }
                <div id="List">
                    {console.log(items.url)}
                    {// 表示行数が0行の時は表示しない
                        items.url ?(xhr.send())
                            :
                            (items.length !== 0) && (
                                <div>
                                    <Pager
                                        className="vertical-align-middle"
                                        as={Row}
                                        query={this.state}
                                        updateList={(data) => { this.updateList(data); }}
                                        client_config={this.state.client_config} />
                                    <Table striped bordered hover id="res_table">
                                        <tbody>
                                            <ListHeader id="res_table"
                                                query={this.state}
                                                updateList={(data) => { this.updateList(data); }}
                                                client_config={this.state.client_config}
                                            />

                                            {items.map((row, index) => (
                                                <tr key={index}>
                                                    {Object.keys(row).map((col, index) => {
                                                        return (
                                                            <td key={index} className={col.indexOf('p_') === 0 || col === '#' ? "text-center" : "text-left"}>{row[col]}</td>
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