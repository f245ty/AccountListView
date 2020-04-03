////////////////////////////////////////////////////////////////////////////////
//
//  JSON の配列に行番号を付与して表示する コンポーネント
//

import React, { Redirect } from 'react';
import SearchControl from './SearchControl';
import ListHeader from './ListHeader';
import Pager from './Pager';
import Table from 'react-bootstrap/Table';
import { Row } from 'react-bootstrap';
import Load from './Load';


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
            loading: false
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
            datetime: state.datetime
        });
    }


    render() {

        var items = this.state.items;
        console.log(items.url)
        var xhr = new XMLHttpRequest();
        xhr.open('GET', items.url);

        // ローディング表示用のハンドラ
        const handleNotLoading = () => this.setState({ loading: false });
        const handleLoading = () => this.setState({ loading: true });

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
                {/* {this.state.loading ? <Load loading={this.state.loading} /> : null} */}
                <div id="List">
                    {console.log(items.url)}
                    {// 表示行数が0行の時は表示しない
                        items.url ?
                            (
                                xhr.send()
                            )
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