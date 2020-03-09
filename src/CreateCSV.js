import React from 'react';
import fetchData from './fetchData';
import { Parser } from 'json2csv';
import _ from 'lodash';
import { Row, Col } from 'react-bootstrap';

class CreateCSV extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.old_data = {};
    }

    onExportCSV(e) {

        // csv出力
        // console.info("Export CSV files.");
        this.state = this.props.query;
        let old_data = _.cloneDeep(this.state);
        this.state.rows = 0;

        // 全件取得　row=0のとき
        fetchData(
            (this.state)).then((data) => this.downloadCSV(data, old_data)
            );
        e.preventDefault();
    }

    downloadCSV(data, old_data) {

        try {
            // jsonからcsvに変換し、ファイルを出力
            const json2csvParser = new Parser();
            const csv = json2csvParser.parse(this.parseColumns(data));
            var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
            var blob = new Blob([bom, csv], { "type": "csv/plain" })
            let link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)

            link.download = '権限情報_' + this.getDate() + '.csv'
            link.click()

        } catch (error) {
            console.error(error)
        } finally {
            this.state.rows = old_data.rows;
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

    parseColumns(data) {

        // ヘッダーを日本語に変換
        var jp_header = [];
        var items = data.items;
        items.map((item) => {
            var col = [];
            for (var value in item) {
                col[this.props.header_label[value]] = item[value];
            }
            jp_header.push(col);
        })
        return jp_header;
    }

    render() {
        return (
            <Row>
                <Col>
                    <p className="text-left">データ更新日：</p>
                </Col>
                <Col className="pull-right">
                    <button className="csv_button"
                        onClick={(e) => this.onExportCSV(e)} >
                        CSV出力 < i className="fas fa-download" ></i >
                    </button >
                </Col>
            </Row>
        );
    }

}

export default CreateCSV;