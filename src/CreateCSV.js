import React from 'react';
import fetchData from './fetchData';
import { Parser } from 'json2csv';
import { Row, Col } from 'react-bootstrap';

import { HEADER_LABEL } from './config'


class CreateCSV extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            client_config: props.client_config
        };
        this.old_data = {};
    }

    onExportCSV(e) {

        // csv出力
        // console.info("Export CSV files.");
        var state = this.props.query;

        // 全件取得　row=0のとき
        fetchData(
            state,
            this.state.client_config,
            true
            ).then((data) => this.downloadCSV(data, state)
            );
        e.preventDefault();
    }

    downloadCSV(data, old_data) {

        try {
            // jsonからcsvに変換し、ファイルを出力
            const json2csvParser = new Parser();
            const csv = json2csvParser.parse(this.parseColumns(data.items));
            var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
            var blob = new Blob([bom, csv], { "type": "csv/plain" })
            let link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)


            link.download = '権限情報_' + this.getDate() + '.csv'
            link.click()

        } catch (error) {
            console.error(error)
        } finally {
            this.setState( {
                rows : old_data.rows
            })
        }

    }

    getDate() {

        // 現在の日付を取得
        var today = new Date();
        var y = today.getFullYear();
        var m = today.getMonth() + 1;
        var d = today.getDate();

        return y + ('0' + m).slice(-2) + ('0' + d).slice(-2);
    }

    onLoding(e) {

        window.open('/loading', null, 'top=100,left=100,width=600,height=400')

    }

    // json2csv 変換用に JSON の Key を日本語に変換
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

    render() {
        return (
            <Row>
                <Col>
                    <button className="csv_button"
                        onClick={(e) => this.onLoding(e)} >
                        <i className="fas fa-download" ></i> CSV出力 
                    </button >
                </Col>
            </Row>
        );
    }

}

export default CreateCSV;