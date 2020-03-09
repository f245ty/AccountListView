////////////////////////////////////////////////////////////////////////////////
//
//  コントロールに入力された条件で API を呼び出し
//  結果を ItemList へセットする コンポーネント
//
import React from 'react';
import fetchData from './fetchData';
import ListHeader from './ListHeader';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const maxPageValue = 100

class SearchControl extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            type: "owner",     // 検索ID　owner or user
            id: null,   // 表示中の検索キー 
            sort: {},
            order: "asc",   // ASC or DESC 
            items: [],
            pages: null,   // 全体ページ数
            rows: 1,   // 1ページの表示件数
            page: 1,   // 表示するページ番号
            total: null,   // 検索合計件数
        };
        this.onChangeText = this.onChangeText.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onChangeRow = this.onChangeRow.bind(this);
    }


    onSubmit = (e) => {
        // console.info("Submit");
        // console.log(this.state);
        // console.info("Searching...");
        // APIを叩いて、画面を更新する
        fetchData(
            (this.state)).then((data) => { this.props.updateList(data) }
            );
        e.preventDefault();
    }

    onChangeText = (e) => { this.state.id = e.target.value; }

    onChangeRow = (e) => { this.state.rows = e.target.value; }

    onClick = (e, e_type) => { this.state.type = e_type; }


    render() {

        const options = [];
        for (let i = 1; i <= maxPageValue; i += 1) {
            options.push(
                <option key={i}>{i}</option>
            )
        }

        const radio = [
            { type: 'owner', label: '管理フォルダ一覧' },
            { type: 'user', label: '権限付き全フォルダ' },
        ];

        return (
            <div id="SearchControl">
                <Form onSubmit={this.onSubmit} >
                    <Form.Group as={Row} controlId="formPlaintextEmail">
                        <Form.Label className="search_icon"><i className="fas fa-user fa-2x"></i></Form.Label>
                        <Col sm="5" className="e-mail_form">
                            <Form.Control placeholder="完全一致検索を行います。" type="text" onChange={e => { this.onChangeText(e); }} />
                        </Col>
                    </Form.Group>
                    <Form.Group className="form_group text-left">
                        {radio.map((radio) => (
                            <Form.Check custom inline className="mb-3"
                                label={radio.label}
                                type="radio"
                                name="name"
                                key={radio.label}
                                id={`inline-radio-${radio.type}`}
                                onClick={(e) => { this.onClick(e, radio.type) }}
                                defaultChecked={radio.type === this.state.type ? true : false}
                            />
                        ))}
                        <span>
                            <Row className="text-right">
                                <Col md="1.8" className="text-center page_row_1 d-flex">1ページ</Col>
                                <Col md="1.5" className="search_button page_row_1" right>
                                    <Form.Control as="select" onChange={e => { this.onChangeRow(e); }}>
                                        {options}
                                    </Form.Control>
                                </Col>
                                <Col md="1.8" className="text-left page_row_1 d-flex">
                                    件表示
                                </Col>
                                <Col className="search_button">
                                    <Button type="submit" value="検索"><i className="fa fa-search"></i>検索</Button>
                                </Col>
                            </Row>
                        </span>

                    </Form.Group>

                </Form>
            </div>
        );
    }
}


export default SearchControl;