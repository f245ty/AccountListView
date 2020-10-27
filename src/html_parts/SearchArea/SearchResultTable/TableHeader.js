import React from 'react';
import { HEADER_LABEL } from '../../../config/config'
import sortTableItems from '../../../function/sortTableItems';

class TableHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    onClick = (col, e) => {
        var sort = this.props.login_state.sort; // 表示中のソートキー
        var order = this.props.login_state.order; // 表示中のオーダー

        // クリックされた列のキーが同じならソート順序を変える
        order = col === sort ? ((order === "asc") ? "desc" : "asc") : "asc";

        var state = this.props.login_state;
        state.sort = col;
        state.order = order;

        let sortedTableItems = sortTableItems(this.props.login_state.items, col, order)
        state.items = sortedTableItems
        this.props.handleChangeTableItems(state, 1)
    }

    render() {
        // リストに含まれるデータカラムからヘッダーを指定する。
        var row = this.props.login_state.items[0];
        var sort_key = this.props.login_state.sort;
        var order = this.props.login_state.order;
        return (
            <thead>
                <tr>
                    {Object.keys(row).map((col, index) => (
                        <th className={"res_header"}
                            key={index}
                            onClick={e => { if (col !== "#") this.onClick(col, e); }} >
                            {HEADER_LABEL[col]}
                            {sort_key === col && order === "asc" ? " ▲" : ""}
                            {sort_key === col && order === "desc" ? " ▼" : ""}
                        </th>
                    ))}
                </tr>
            </thead>
        )
    }
}

export default TableHeader
