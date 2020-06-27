import React from 'react';
import Button from 'react-bootstrap/Button';
import { CSV_LOADING, DOWNLOAD } from '../config/message';

/**
 * コントロールに入力された条件で API を呼び出し
 * 結果を ItemList へセットする コンポーネント
 * @module Load
 */
class Load extends React.Component {

    render() {
        //loadingプロパティにより処理分け
        if (this.props.loading) {
            return (
                <div className="text-center">
                    <br /><br /><br /><br />
                    {/* //ローディングアイコン */}
                    <p><i className="fa fa-refresh fa-spin fa-5x"></i></p>
                    <p>Loading...</p>

                    {this.props.search ? null : <div>{CSV_LOADING}</div>}
                </div>
            );
        } else {
            return (
                <div>
                    <span>{DOWNLOAD}</span>
                    <Button onClick="window.close();">✕ 閉じる</Button>
                </div>
            );
        }
    }
}

export default Load;
