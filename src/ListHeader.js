////////////////////////////////////////////////////////////////////////////////
//
//  コントロールに入力された条件で API を呼び出し
//  結果を ItemList へセットする コンポーネント
//
import React from 'react';
import fetchData from './fetchData';


class ListHeader extends React.Component {

    constructor(props){
        super(props);
        this.sort_key = {}
    }

    onClick = (col, e) => {
        // クリックされた列がソートキーでなければ、入れ替える
        var sort_key = {};
        if(!this.sort_key[col])
            sort_key[col] = '▲';
        else
            sort_key[col] = (this.sort_key[col] == "▲") ? "▼":"▲";
        this.sort_key = sort_key;
        this.props.updateList(this.props.items, this.props.search_key, this.sort_key);
    }

    render() {
        const row = this.props.items[0];
        // 【TODO】ヘッダ用にキーとの対応を書き換える
        return(
            <tr>
                {Object.keys(row).map((col,index) => (
                    <th key={index} onClick = { e => { this.onClick(col, e); }} >
                        {col}
                        {(this.sort_key[col]) && (<span>{this.sort_key[col]}</span>)}
                    </th>
                ))}
            </tr>
        );
    }
}


export default ListHeader;