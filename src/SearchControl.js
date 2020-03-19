////////////////////////////////////////////////////////////////////////////////
//
//  コントロールに入力された条件で API を呼び出し
//  結果を ItemList へセットする コンポーネント
//
import React from 'react';
import fetchData from './fetchData';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Nav, Navbar, InputGroup } from 'react-bootstrap';
import { BrowserRouter, Route } from 'react-router-dom';
import { DEFAULT_ROWS_PAR_PAGE,MENU_ITEMS } from './config'


const maxPageValue = 100

class SearchControl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: null,     // 検索ID　owner or user
            id: null,   // 表示中の検索キー 
            sort: {},
            order: "asc",   // ASC or DESC 
            items: [],
            pages: null,   // 全体ページ数
            rows: DEFAULT_ROWS_PAR_PAGE,   // 1ページの表示件数
            page: 1,   // 表示するページ番号
            total: null,   // 検索合計件数
            datetime: "",
            client_config: props.client_config
        };
        this.onChangeText = this.onChangeText.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onChangeRow = this.onChangeRow.bind(this);
    }


    onClickSearch = (e, hash) => {
        // console.info("Submit");
        // console.log(this.state);
        // console.info("Searching...");
        // APIを叩いて、画面を更新する
        var state = this.state;
        state.type = hash;
        if(this.props.login_state.user_role !== "administrator")
            state.id = this.props.login_state.login_account;
        console.log(state)
        console.log('search state')
        fetchData( state , this.state.client_config ).then((data) => {
            this.props.updateList(data)
        } );
        return false;
    }

    onChangeText = (e) => {
        let id = e.target.value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
         this.setState({id : id});
        }

    onChangeRow = (e) => { this.setState({rows : e.target.value}); }

    onClick = (e, e_type) => { ; }

    render() {
        const options = [];
        for (let i = 1; i <= maxPageValue; i += 1) {
            options.push(
                <option key={i}>{i}</option>
            )
        }

        // システム管理者権限を持たない場合はメールアドレス固定

        return (
            
            <BrowserRouter hashType="noslash">
                <Route render={ (p) => {
                    return(
                        <Navbar bg="dark" variant="dark">
                            {
                                (this.props.login_state.user_role === "administrator")&&
                                (
                                    <InputGroup className="mr-auto">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="basic-addon1">{MENU_ITEMS[this.props.login_state.user_role][p.location.hash][0]}</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control placeholder="前方一致検索を行います。" type="text" onChange={e => { this.onChangeText(e); }} />
                                    </InputGroup>
                                )
                            }
                            {
                                (this.props.login_state.user_role !== "administrator")&&
                                (
                                    <Navbar.Text className="mr-auto">{this.props.login_state.login_account}</Navbar.Text>
                                )
                            }
                            <Nav className="mr-3"></Nav>
                            <Nav className="mr-3">
                                <Form.Control as="select" defaultValue={DEFAULT_ROWS_PAR_PAGE} onChange={e => { this.onChangeRow(e); }}>
                                        {options}
                                </Form.Control>
                            </Nav>
                            <Nav className="mr-3">
                                <Form inline onClick={(e) => this.onClickSearch(e, p.location.hash.replace('#',''))} >
                                    <Form.Group>
                                        <Button type="button" value="検索"><i className="fa fa-search"></i> 検索</Button>
                                    </Form.Group>
                                </Form>
                            </Nav>
                        </Navbar>
                    )
                }} />
                </BrowserRouter>
        );
    }
}


export default SearchControl;