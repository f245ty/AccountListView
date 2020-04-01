////////////////////////////////////////////////////////////////////////////////
//
//  コントロールに入力された条件で API を呼び出し
//  結果を ItemList へセットする コンポーネント
//
import React from 'react';
import fetchData from './fetchData';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';


class Load extends React.Component {

    render() {
        //loadingプロパティにより処理分け
        if(this.props.loading){
            return (
                <Load>
                    {/* //ローディングアイコン */}
                    <i className="fa fa-refresh fa-spin fa-5x"></i>loading
                        <br />                    
                        <span>CSVファイルをダウンロード中です。</span>
                        <span>米しばらく時間がかかることがあります。</span>
                        <br />
                        <span>ページを閉じると、ダウンロードができません。</span>
                </Load>
            );
        } else{
            return (
                <Load>
                    <span>ダウンロードが終了しました。</span>
                    <Button onClick="window.close();">ウィンドウを閉じる</Button>
                </Load>
            );
        }
    }

}

export default Load;