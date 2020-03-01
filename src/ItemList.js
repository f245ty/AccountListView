////////////////////////////////////////////////////////////////////////////////
//
//  JSON の配列に行番号を付与して表示する コンポーネント
//

import React from 'react';
import SearchControl from './SearchControl';
import ListHeader from './ListHeader';


class ItemList extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            search_key: null,   // 表示中の検索キー
            sort_key: {},
            items: []
        };
   
    }

    // 子コンポーネントの検索コントローラがデータをセットする
    updateList(data, search_key, sort_key = {} ) {
        this.setState({
            search_key: search_key,
            sort_key: sort_key,
            items: data
        });
        console.log(this.state);
    }

    render() {
        const items = this.state.items; //[["1","JAN",'satou'],["2","FEB",'saito']];
        return(
        <div className="ItemList">
            <SearchControl
                searcdh_key = {this.state.search_key}
                updateList={ (searchKey, data) => { this.updateList(searchKey, data); }} />
            <div>
                {// 検索してないときは何も表示しない
                    (items.length === 0 ) && typeof(this.state.search_key) !== "string" && (
                        <p>検索条件を入力し検索してください。</p>
                    )
                }
                {// 検索して結果が0件の時は 結果がないと表示する
                    (items.length === 0 ) && typeof(this.state.search_key) == "string" && (
                        <p>対象データはありません。</p>
                    )
                }
                {// 表示行数が0行の時は表示しない
                 (items.length !== 0) && (
                <table>
                    <tbody>
                            <ListHeader
                                search_key = {this.state.search_key}
                                items = {this.state.items}
                                updateList={ (search_key, sort_key, data) => { this.updateList(search_key, sort_key, data); }} />
                            {items.map((row,index) => (
                            <tr key={index}>
                                {Object.values(row).map((col,index) => {
                                    if(index === 0 )return (<th key={index}>{col}</th>) // 1列目
                                    else return (<td key={index}>{col}</td>)
                                })}
                            </tr>))}
                    </tbody>
                </table>)
                }
            </div>
        </div>
        );
    }
}


export default ItemList;