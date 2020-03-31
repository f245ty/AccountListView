////////////////////////////////////////////////////////////////////////////////
//
//  コントロールに入力された条件で API を呼び出し
//  結果を ItemList へセットする コンポーネント
//

import React from 'react';
import fetchData from './fetchData';

import { HEADER_LABEL } from './config'



class ListHeader extends React.Component {
    constructor(props){
        super(props);
        this.state={
            client_config: props.client_config
        }
    }

    onClick = (col, e) => {

        var sort = this.props.query.sort; // 表示中のソートキー
        var order =  this.props.query.order; // 表示中のオーダー

        // クリックされた列のキーが同じならソート順序を変える
        order = col === sort ? ((order === "asc") ? "desc" : "asc" ) : "asc";

        var state = this.props.query;
        state.sort = col;
        state.order = order;

        // console.info("Sort. ");

        fetchData(
            state, this.state.client_config, this.props.header_label).then((data) => { this.props.updateList(data) }
            );
    }

    render() {

        var row = this.props.query.items[0];
        var sort_key = this.props.query.sort;
        var order = this.props.query.order;

        return (
            <tr>
                {Object.keys(row).map((col, index) => (
                    <th className="res_header"
                    key={index}
                    onClick={e => { if (col !== "#") this.onClick(col, e); }} >
                    {HEADER_LABEL[col]}
                    {sort_key === col && order === "asc" ? " ▲":""}
                    {sort_key === col && order === "desc" ? " ▼":""}
                </th>
                ))}
            </tr>
        );
    }
}


export default ListHeader;