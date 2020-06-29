import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Dialog from './Dialog';
import { HEADER_LABEL, MENU_ITEMS } from '../config/config'
import fetchData from '../function/fetchData';

/**
 * 
 * @module CreateCSV
 */
class CreateCSV extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            client_config: props.client_config,
            loading: false
        };
        this.old_data = {};
    }

    /**
     * 
     * @param {XXX} data XXX
     */
    onReceiveUrl = (data) => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', data.items.url);
        xhr.responseType = "text"
        xhr.onload = (oEvent) => {
            console.log(oEvent)
            // ダウンロード完了後の処理を定義する
            let bom = new Uint8Array([0xEF, 0xBB, 0xBF]); // UTF-8
            let blob = new Blob([bom, xhr.response], { type: 'text/csv' });
            let f_name = MENU_ITEMS[this.props.user_role]['#' + data.type][1] + "_" + this.getDate() + '.csv';
            if (window.navigator.msSaveBlob) {
                // IEとEdge
                window.navigator.msSaveBlob(blob, f_name);
            }
            else {
                // それ以外のブラウザ
                // Blobオブジェクトを指すURLオブジェクトを作る
                let objectURL = window.URL.createObjectURL(blob);
                // リンク（<a>要素）を生成し、JavaScriptからクリックする
                let link = document.createElement("a");
                document.body.appendChild(link);
                link.href = objectURL;
                link.download = f_name;
                link.click();
                document.body.removeChild(link);
            }
            this.setState({ loading: false })
        }
        xhr.send();
    }

    /**
     * 
     * @return {XXX} XXX
     */
    getDate() {

        // 現在の日付を取得
        var today = new Date();
        var y = today.getFullYear();
        var m = today.getMonth() + 1;
        var d = today.getDate();

        return y + ('0' + m).slice(-2) + ('0' + d).slice(-2);
    }

    /**
     * 
     * @param {XXX} e XXX
     */
    onLoding(e) {

        // csv出力
        var state = this.props.query;
        // this.props.handleLoading()
        this.setState({ loading: true })

        // 全件取得　row=0のとき
        fetchData(
            state,
            this.state.client_config,
            true
        ).then(this.onReceiveUrl);
        e.preventDefault();
    }

    /**
     * json2csv 変換用に JSON の Key を日本語に変換
     * @param {XXX} items XXX
     * @returns {XXX} XXX
     */
    parseColumns(items) {

        // ヘッダーを日本語に変換
        var jp_header = [];
        jp_header = items.map((item) => {
            var col = {};
            for (var key in item)
                col[HEADER_LABEL[key]] = item[key];
            return col;
        })
        return jp_header;
    }

    /**
     * 
     * @return {XXX} XXX
     */
    render() {
        return (
            <Row>
                <Col>
                    {this.state.loading ?
                        (<Dialog loading={this.state.loading} search={true} />)
                        :
                        (
                            <button className="csv_button"
                                onClick={(e) => this.onLoding(e)} >
                                <i className="fas fa-download" ></i> CSV出力
                            </button >
                        )
                    }
                </Col>
            </Row>
        );
    }
}

export default CreateCSV;
