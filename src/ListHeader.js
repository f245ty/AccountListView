////////////////////////////////////////////////////////////////////////////////
//
//  コントロールに入力された条件で API を呼び出し
//  結果を ItemList へセットする コンポーネント
//

import React from 'react';
import fetchData from './fetchData';


// 日本語ヘッダーを定義
const HEADER_LABEL = {
    "#": "#",
    "user_email": "メールアドレス",
    "user_name": "ユーザ名",
    "path": "フォルダパス",
    "folder": "フォルダ",
    "permission": "権限",
    "owner": "管理者",
    "p_read": "閲覧権限",
    "p_download": "ダウンロード権限",
    "p_upload": "アップロード権限",
    "p_admin": "管理権限",
    "p_delete": "削除権限",
    "p_notify_ul": "アップロード通知",
    "p_notify_dl": "ダウンロード通知",
    "p_owner": "フォルダ所有権"
}


class ListHeader extends React.Component {

    constructor(props) {
        super(props);
        this.sort_key = {};
        this.order = "";
        this.state = {};
    }

    onClick = (col, e) => {
        // クリックされた列がソートキーでなければ、入れ替える
        var sort_key = {};
        var order = null;
        if (!this.sort_key[col]) {
            sort_key[col] = '▲';
            order = 'asc';
        } else {
            sort_key[col] = (this.sort_key[col] === "▲") ? "▼" : "▲";
            order = (this.order === "asc") ? "desc" : "asc";
        }
        this.sort_key = sort_key;
        this.order = order;
        this.state = this.props.query;
        this.state.sort = this.sort_key;
        this.state.order = this.order;

        // console.info("Sort. ");
        fetchData(
            this.state, this.props.header_label).then((data) => { this.props.updateList(data) }
            );
        e.preventDefault();

    }

    render() {

        var row = this.props.query.items[0];
        this.sort_key = this.props.query.sort;

        return (
            <tr>
                {Object.keys(row).map((col, index) => (
                    <th className="res_header"
                    key={index}
                    onClick={e => { if (col !== "#") this.onClick(col, e); }} >
                    {HEADER_LABEL[col]}
                    {(this.sort_key[col]) && (<span>{this.sort_key[col]}</span>)}
                </th>
                ))}
            </tr>
        );
    }
}


export default ListHeader;