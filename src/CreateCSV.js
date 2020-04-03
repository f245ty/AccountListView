import React from 'react';
import fetchData from './fetchData';
import { Parser } from 'json2csv';
import { Row, Col } from 'react-bootstrap';
import Load from './Load';
import { HEADER_LABEL } from './config'


class CreateCSV extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            client_config: props.client_config,
            loading: false
        };
        this.old_data = {};
    }


    onLoding(e) {

        // window.open('/loading', null, 'top=100,left=100,width=600,height=400')
        // csv出力
        var state = this.props.query;
        // this.props.handleLoading()
        this.setState({ loading: true })

        // 全件取得　row=0のとき
        fetchData(
            state,
            this.state.client_config,
            true
            ).then((data) => {
                console.log(data)
                this.props.updateList(data)
                // this.props.handleNotLoading()
                this.setState({ loading: false })
            }
            );
        e.preventDefault();

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
                {this.state.loading ? <Load loading={this.state.loading} search={true} /> : null}
            </Row>
            
        );
    }

}

export default CreateCSV;