////////////////////////////////////////////////////////////////////////////////
//
//  コントロールに入力された条件で API を呼び出し
//  結果を ItemList へセットする コンポーネント
//
import React from 'react';
import fetchData from './fetchData';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

class Load extends React.Component {
    constructor(props) {
        super(props);
        this.load_state = 'active';
    }

    render() {
        console.log("aaa");
        //loadingプロパティにより処理分け
        if(this.load_state === 'active'){
            return (
                <Load>
                    {/* //ローディングアイコン */}
                    <i className="fa fa-refresh fa-spin fa-5x"></i>loading
                        <br />                    
                        CSVファイルを出力中です
                        <br />
                        しばらく時間がかかることがあります
                </Load>
            );
        } else{
            return (
                <Load>
                    {/* //ローディングアイコン */}
                    <i className="fa fa-refresh fa-spin fa-5x"></i>loading
                </Load>
            );
        }
    }

}

export default Load;

