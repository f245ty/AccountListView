////////////////////////////////////////////////////////////////////////////////
//
//  コントロールに入力された条件で API を呼び出し
//  結果を ItemList へセットする コンポーネント
//
import React from 'react';
import fetchData from './fetchData';


class SearchControl extends React.Component {

    constructor(props){
        super(props);
        this.search_key = "";   // 入力中の検索キー
    }

    onSubmit = (e) => {
        fetchData(this.search_key,{}).then((data) => {this.props.updateList(data, this.search_key)});
        e.preventDefault();        
    }

    onChangeText = (e) => { this.search_key = e.target.value; }

    render() {
        return(
        <div className="SearchControl">
            <form onSubmit={this.onSubmit}>
                <input type="text" onChange = { e => { this.onChangeText(e); } }/>
                <input type="submit" value="検索"/>
            </form>
        </div>
        );
    }
}


export default SearchControl;