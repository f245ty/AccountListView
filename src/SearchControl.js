////////////////////////////////////////////////////////////////////////////////
//
//  コントロールに入力された条件で API を呼び出し
//  結果を ItemList へセットする コンポーネント
//
import React from 'react';
import fetchData from './fetchData';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Nav, Navbar } from 'react-bootstrap';
import { HashRouter, Switch, Route } from 'react-router-dom';


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
            datetime: ""
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
        fetchData( this.state ).then((data) => {
            console.log(data)
            this.props.updateList(data)
        } );
    }

    onChangeText = (e) => { this.state.id = e.target.value; }

    onChangeRow = (e) => { this.state.rows = e.target.value; }

    onClick = (e, e_type) => { ; }


    render_form = (hash) => {
        
        this.state.type = hash

        const options = [];
        for (let i = 1; i <= maxPageValue; i += 1) {
            options.push(
                <option key={i}>{i}</option>
            )
        }

        return(
            <Form inline onSubmit={(e) => this.onSubmit()} >
                <Form.Group as={Row} controlId="formPlaintextEmail">
                    <Form.Control placeholder="完全一致検索を行います。" type="text" onChange={e => { this.onChangeText(e); }} />
                </Form.Group>
                <Form.Group className="form_group text-left">
                    <Form.Control as="select" onChange={e => { this.onChangeRow(e); }}>
                        {options}
                    </Form.Control>
                    <Navbar.Text> 件 / 1ページ </Navbar.Text>
                </Form.Group>
                <Button type="submit" value="検索"><i className="fa fa-search"></i>検索</Button>
            </Form>
    )}


    render() {
        return (
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="#home">
                    {"取得日時：" + this.state.datetime}
                </Navbar.Brand>
                <Nav className="mr-auto">
                </Nav>
                    <HashRouter hashType="noslash">
                        <Switch>
                            <Route path="/owner" component={ () => { return this.render_form("owner") } /* 管理対象フォルダ一覧 */} />
                            <Route path="/user" component={ () => { return this.render_form("user") } /* 権限月フォルダ一覧 */} />
                        </Switch>
                    </HashRouter>
            </Navbar>
        );
    }
}


export default SearchControl;