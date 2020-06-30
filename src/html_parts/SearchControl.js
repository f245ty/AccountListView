import React from 'react';
import fetchData from '../function/fetchData';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { InputGroup } from 'react-bootstrap';
import { BrowserRouter, Route } from 'react-router-dom';
import { DEFAULT_ROWS_PAR_PAGE, MENU_ITEMS } from '../config/config'
import isAccessTokenEnable from '../function/isAccessTokenEnable';
import Cookies from 'universal-cookie';
import { ID_TOKEN_ERR, LOGIN } from '../config/message';
import Dialog from './Dialog';
import getCSVTasks from '../function/getCSVTasks';


const cookies = new Cookies();
const maxPageValue = 100

/**
 * コントロールに入力された条件で API を呼び出し
 * 結果を ItemList へセットする コンポーネント
 * @module SearchControl
 */
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
            client_config: props.client_config,
            show_dialog: false,     // ポップアップ表示フラグ
            loading: false,
            error: null
        };
        this.validation = false;
        this.onChangeText = this.onChangeText.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onChangeRow = this.onChangeRow.bind(this);
        this.onClickSearch = this.onClickSearch.bind(this);
    }

    /**
     * 
     * @param {XXX} e XXX
     * @param {XXX} hash XXX
     */
    onClickSearch = (e, hash) => {
        var state = this.state;
        state.type = hash;

        console.log('search id: ' + this.state.id);
        if (isAccessTokenEnable(this.props.login_state)) {

            // APIを叩いて、画面を更新する
            // 検索条件をデフォルトで検索するための処理
            if (state.id === null || state.id === "")
                state.id = this.props.login_state.login_account
            if (state.id === null || state.type === 'folder' || state.type === 'file') {
                if (state.id === this.props.login_state.login_account) state.id = "/";
            } else if (state.type !== "folder" && state.id.indexOf("/") > -1) {
                state.id = this.props.login_state.login_account;
            } else if (state.type === "folder" && state.id.indexOf("/") === -1) {
                state.id = "/";
            }

            console.log(state)
            console.log('search state')
            this.setState({ loading: true })
            if (this.props.location_hash === "#file") {
                getCSVTasks(this.state, this.props.client_config, this.props.login_state.login_account, true).then((data) => {
                    // console.log(data)
                    this.props.updateList(data)
                    this.setState({ loading: false })
                })
            } else {
                fetchData(state, this.state.client_config).then((data) => {
                    this.props.updateList(data)
                    this.setState({ loading: false })
                });
            }
            this.props.offLocationFlag()
        } else {
            console.log("id_token error.")
            this.setState({ show_dialog: !this.state.show_dialog });
            console.log(this.state.show_dialog)
            cookies.remove('jwt');
        }
        console.log('searched id: ' + this.state.id);
        e.preventDefault();
    }

    /**
     * 
     * @param {XXX} e XXX
     */
    onChangeText = (e) => {
        let id = e.target.value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        console.log('before id: ' + this.state.id + ', after id: ' + id);
        this.setState({ id: id });
    }

    /**
     * 
     * @param {XXX} e XXX
     */
    onChangeRow = (e) => { this.setState({ rows: e.target.value }); }

    /**
     * 
     * @param {XXX} e XXX
     * @param {XXX} e_type XXX
     */
    onClick = (e, e_type) => { ; }

    /**
     * ファイル情報集計タスクを取得する
     * ファイル情報集計メニューボタン押下時のみ
     */
    onGetCSVTasks() {
        console.log("will get csv tasks.")
        if (isAccessTokenEnable(this.props.login_state)) {
            getCSVTasks(this.state, this.props.client_config).then((data) => {
                // console.log(data)
                this.props.updateList(data)
            })
            this.props.offLocationFlag()
            this.props.offGetCSVTasksFlag()
            console.log(this.props.login_state)
            console.log("get csv_tasks.")
        }
    }

    /**
     * 
     * @return {XXX} XXX
     */
    render() {
        const options = [];
        for (let i = 1; i <= maxPageValue; i += 1) {
            options.push(<option key={i}>{i}</option>);
        }

        // メニュー切り替え時、検索窓をリセットしデフォルト表示
        if (this.props.login_state.location_flag) this.state.id = this.props.login_state.login_account


        // システム管理者権限を持たない場合はメールアドレス固定
        return (
            <BrowserRouter hashType="noslash">
                <Route render={(p) => {
                    // console.log("App.js location: " + this.props.location_hash)
                    // console.log("SearchControl.js location: " + p.location.hash)
                    // console.log("location_flag: " + this.props.login_state.location_flag)

                    // ファイル情報集計メニューを選択したときは、APIをGETで叩く
                    if (this.props.login_state.permit_get_API_flag) this.onGetCSVTasks()

                    return (
                        <div className="bg-dark p-3">
                            <Form onSubmit={(e) => this.onClickSearch(e, p.location.hash.replace("#", ""))}>
                                <InputGroup className="">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1">
                                            {MENU_ITEMS[this.props.login_state.user_role][p.location.hash][0]}
                                        </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    {p.location.hash === "#file" && (
                                        <Form.Control
                                            className="rounded-right"
                                            defaultValue={
                                                this.props.login_state.user_role === "administrator"
                                                    ? "/"
                                                    : undefined
                                            }
                                            placeholder="前方一致検索を行います。"
                                            type="text"
                                            required
                                            onChange={(e) => { this.onChangeText(e); }}
                                        />
                                    )}
                                    {p.location.hash === "#folder" && (
                                        <Form.Control
                                            className="rounded-right"
                                            defaultValue={
                                                this.props.login_state.user_role === "administrator"
                                                    ? "/"
                                                    : undefined
                                            }
                                            placeholder="前方一致検索を行います。"
                                            type="text"
                                            required
                                            onChange={(e) => { this.onChangeText(e); }}
                                        />
                                    )}
                                    {p.location.hash === "#owner" && (
                                        <Form.Control
                                            className="rounded-right"
                                            defaultValue={
                                                this.props.login_state.user_role === "administrator"
                                                    ? this.state.id
                                                    : undefined
                                            }
                                            value={
                                                this.props.login_state.user_role === "manager"
                                                    ? this.state.id
                                                    : undefined
                                            }
                                            placeholder="前方一致検索を行います。"
                                            type="text"
                                            required
                                            onChange={(e) => {
                                                this.onChangeText(e);
                                            }}
                                        />
                                    )}
                                    {p.location.hash === "#user" && (
                                        <Form.Control
                                            className="rounded-right"
                                            defaultValue={
                                                this.props.login_state.user_role === "administrator"
                                                    ? this.state.id
                                                    : undefined
                                            }
                                            value={
                                                this.props.login_state.user_role === "manager"
                                                    ? this.state.id
                                                    : undefined
                                            }
                                            placeholder="前方一致検索を行います。"
                                            type="text"
                                            required
                                            onChange={(e) => {
                                                this.onChangeText(e);
                                            }}
                                        />
                                    )}
                                    {p.location.hash !== "#file" ?
                                        (<InputGroup.Append className="mx-3">
                                            <Form.Control as="select" defaultValue={DEFAULT_ROWS_PAR_PAGE} onChange={e => { this.onChangeRow(e); }}>
                                                {options}
                                            </Form.Control>
                                        </InputGroup.Append>)
                                        : null}
                                    <InputGroup.Append>
                                        <Button className="rounded-left" type="submit" disabled={p.location.hash === "#file" && this.props.query.is_process}>
                                            <i className={p.location.hash === "#file" ? "fas fa-download" : "fa fa-search"}></i> {p.location.hash === "#file" ? "ダウンロード" : "検索"}
                                        </Button>
                                    </InputGroup.Append>
                                </InputGroup>
                            </Form>

                            <Dialog show={this.state.loading} search_flag={this.state.loading} />
                        </div>
                    );
                }}
                />

                {/* ダイアログ表示 */}
                <Dialog
                    show={this.state.show_dialog}
                    text={ID_TOKEN_ERR + LOGIN}
                    logout_flag={true}
                    err_flag={true}
                />
            </BrowserRouter>
        );
    }
}

export default SearchControl;
