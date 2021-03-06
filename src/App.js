import AWS from 'aws-sdk';
import jwt from 'jsonwebtoken';
import Cookies from 'universal-cookie';
import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Route, BrowserRouter } from 'react-router-dom';
import Dialog from './html_parts/Dialog';
import HeaderMenu from './html_parts/HeaderMenu';
import SideMenu from './html_parts/SideMenu';
import SearchArea from './html_parts/SearchArea'
import isAccessTokenEnable from './function/isAccessTokenEnable';
import filterTableItems from './function/filterTableItems';
import getCSVTasks from './function/getCSVTasks';
import {
    ACCOUNT_ID,
    GET_GROUPS_URL,
    IDENTITY_POOL_ID,
    LOGINS_SET_ID,
    MENU_ITEMS,
    REGION,
    ROLES,
    ROLE_ORDER
} from './config/config';
import {
    ERR_WAIT_MSG,
    ID_TOKEN_ERR,
    LOGIN,
    LOGIN_ERR
} from './config/message';
import './assets/styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import fetchData from './function/fetchData';
import getCheckAuth from './function/getCheckAuth';

var apigClientFactory = require('../node_modules/aws-api-gateway-client').default;

/**
 * 
 * @module App
 */
class App extends React.Component {
    constructor(props) {
        super(props);
        console.log('page loaded')
        this.state = {
            client_config: {},                      // AWS系の認証情報を格納
            datetime: "",                           // データ更新日を格納
            dialog_text: LOGIN_ERR + ERR_WAIT_MSG,  // モーダル表示メッセージ
            error: null,                            // エラーモーダル表示判定用
            id_token: null,                         // AD発行トークン情報格納
            is_folder_path: "",                     // #fileにおけるフォルダ検索結果可能
            is_logged_in: false,                    // ログイン判定用
            is_process: false,                      // #fileにおける実行中タスク有無判定用
            is_search_permission: true,             // #fileにおける検索許可フラグ
            is_search_result: "",                // #file以外の機能における検索結果フラグ
            items: [],                              // APIで取得したアイテム群
            tableItems: [],                         // tableに表示するアイテム群
            loading: false,                         // ロードモーダル表示判定用
            location_flag: false,                   // 検索実行判定用
            login_account: null,                    // ログインメールアドレス
            login_user: null,                       // ログインユーザ名
            order: "asc",                           // テーブル表示ソート条件
            page: 1,                                // テーブル表示ページ番号
            pages: null,                            // テーブル表示最終ページ番号
            searchText: '',                         // 検索値
            show_dialog: false,                     // ベースモーダル表示判定用
            sort: {},                               // テーブル表示ソートカラム名
            user_role: null,                        // ログインユーザADロール
        }
        this.cookies = new Cookies();
    }

    /**
     * JWTトークン検証を行い、Cognitoへ認証情報を問い合わせ、ログイン/ログアウトを実施する。
     * @param {string} id_token_jwt jwtトークン
     */
    getClientConfig(id_token_jwt) {
        console.log(`id_token_jwt: ${id_token_jwt}`)

        // トークンがない場合は終了
        if (id_token_jwt === null) {
            console.log('JWT is null');
            return;
        }

        // JWT 形式じゃなかったら破棄
        var id_token = jwt.decode(id_token_jwt);
        if (id_token === null) {
            console.log('invalid JWT');
            this.cookies.remove('jwt');
            return;
        }

        // nonce が一致しなかったらトークンを破棄
        let nonce = this.cookies.get('nonce');
        this.cookies.remove('nonce');
        if (nonce !== id_token.nonce) {
            this.cookies.remove('jwt');
            return;
        }
        console.log('Below is the log of id_token in getClientConfig')
        console.log(id_token)

        var params = {
            AccountId: ACCOUNT_ID,
            IdentityPoolId: IDENTITY_POOL_ID,
            Logins: {
                [LOGINS_SET_ID]: id_token_jwt
            }
        };

        // 資格情報の取得
        var cognitoidentity = new AWS.CognitoIdentity();
        cognitoidentity.getId(params,
            (err, data) => {
                if (err) {
                    console.log('can not get CognitIdentity')
                    console.log(err, err.stack); // an error occurred
                    this.onChangeShowDialog(LOGIN_ERR + ERR_WAIT_MSG)
                    this.setLogout()
                } else {
                    let p = {
                        IdentityId: data.IdentityId,
                        Logins: params.Logins
                    }
                    cognitoidentity.getCredentialsForIdentity(p,
                        (err, data) => {
                            if (err) { // an error occurred
                                console.log('can not get Credential')
                                console.log(err, err.stack);
                                console.log(id_token_jwt)
                                this.onChangeShowDialog(LOGIN_ERR + ERR_WAIT_MSG)
                                this.setLogout()
                            } else {
                                var config = {
                                    invokeUrl: GET_GROUPS_URL,
                                    accessKey: data.Credentials.AccessKeyId,
                                    secretKey: data.Credentials.SecretKey,
                                    sessionToken: data.Credentials.SessionToken,
                                    region: REGION
                                }
                                this.setLogIn(config, id_token)
                            }
                        }
                    );
                }
            }
        );
    }

    /**
     * ログインし、情報をセットする
     * @param {object} config API Gatewayの設定連想配列
     * @param {object} id_token jwtトークンをデコードした連想配列
     */
    async setLogIn(config, id_token) {
        var login_user = id_token.name
        var login_account = id_token.email ? id_token.email : id_token.preferred_username
        var user_role = "user"
        try {
            // 所属グループが5個以下の場合
            if (id_token['groups']) {
                var user_groups = id_token.groups
                user_role = this.applyUserGroup(user_groups)
            }
            // 所属グループが6個以上の場合
            else if (id_token['hasgroups']) {
                user_role = await this.getUserRole(config);
            }
            this.setState({
                is_logged_in: true,
                id_token: id_token,
                login_user: login_user,
                login_account: login_account,
                user_role: user_role,
                client_config: config
            })
            console.log('login sequence')
        } catch {
            this.onChangeShowDialog(LOGIN_ERR + ERR_WAIT_MSG)
        }
        console.log(this.state)
    }

    /**
     * GetUserProfileをコールし、ユーザロールを取得する。
     * @param {object} config API Gatewayの設定連想配列
     * @return {string} システム内で利用する、ユーザロール
     */
    getUserRole(config) {
        // CORS オリジンで呼べないので、Lambda から Azure AD の Token エンドポイントを呼び出して
        // 取得したトークンを取得している
        let code = { "code": this.cookies.get('code') };
        var apigClient = apigClientFactory.newClient(config);
        var pathParams = {};
        var pathTemplate = '';
        var method = 'GET';
        var additionalParams = {
            queryParams: code
        }
        var body = {}

        return apigClient.invokeApi(pathParams, pathTemplate, method, additionalParams, body)
            .then(result => {
                var id_token = jwt.decode(result.data.id_token);
                console.log('Below is the log of id_token in getUserRole')
                console.log(id_token)
                var user_role = this.applyUserGroup(id_token.groups)
                return user_role
            })
            .catch(function (result) {
                console.log('API Gateway reply Error.')
                console.log(result)
                this.setLogout()
                return result
            });
    }

    /**
     * ユーザが所属するグループから適切なロールを付与する
     * ロールは最も高い権限のものを優先して付与する
     * @param {string} user_groups ログインユーザに付随するグループID情報
     * @return {string} システム内で利用する、ユーザロール
     */
    applyUserGroup(user_groups) {
        var user_role = "user"
        if (user_groups !== undefined) {
            for (let order of ROLE_ORDER) {
                if (user_groups.indexOf(ROLES[order]) !== -1) {
                    user_role = order;
                    break;
                }
            }
        }
        console.log(`user_role: ${user_role}`)
        return user_role;
    }

    /**
     * ログアウトする手段
     */
    setLogout() {
        this.cookies.remove('jwt');
        this.setState({
            is_logged_in: false,
            id_token: null,
            login_user: null,
            login_account: null,
            user_role: null,
            client_config: {},
            show: null
        })
        console.log('logout sequence')
    }

    onChangeText = (event) => {
        let searchText = event.target.value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        console.log('before searchText: ' + this.state.searchText + ', after searchText: ' + searchText);
        this.setState({ searchText: searchText });
    }

    onChangeLocationFlg = () => {
        this.setState({ location_flag: false })
    }

    onChangeSystemMsg = () => {
        this.setState({ is_search_permission: false })
    }

    onChangeShowDialog = (dialog_text) => {
        this.setState({
            show_dialog: true,
            dialog_text: dialog_text
        })
    }

    handleClose = () => {
        this.setState({ show_dialog: false });
    }

    onChangeTableItems = (state, num) => {
        let tableItems = filterTableItems(state.items, num)
        state.tableItems = tableItems
        state.page = num
        Object.keys(state).forEach(key => {
            this.setState({ [key]: state[key] });
        })
    }

    onGetCsvTasks = (hash) => {
        console.log("will get csv tasks.")
        if (isAccessTokenEnable(this.state)) {
            if (hash === "#file") {
                getCSVTasks(hash, this.state, false).then((tableItems) => {
                    this.onChangeTableItems(tableItems, this.state.page);
                })
            } else if (hash === "#check") {
                getCheckAuth(hash, this.state).then((tableItems) => {
                    this.onChangeTableItems(tableItems, this.state.page);
                })
            } else {
                fetchData(hash, this.state, false).then((tableItems) => {
                    this.onChangeTableItems(tableItems, this.state.page);
                })
            }
            this.onChangeLocationFlg();
            console.log("get csv_tasks.")
        } else {
            console.log("id_token error.")
            this.onChangeShowDialog(ID_TOKEN_ERR + LOGIN)
            this.cookies.remove('jwt');
        }
    }

    onChangePage = (hash) => {
        let updateSearchText = this.state.login_account
        if (MENU_ITEMS[this.state.user_role][hash][0] === "/") {
            updateSearchText = "/"
        }
        this.setState({
            searchText: updateSearchText,
            page: 1,
            items: [],
            location_flag: true,
            sort: {}
        })
        this.onGetCsvTasks(hash)
        console.log(`hash: ${hash}, updateSearchText: ${this.searchText}`)
    }

    render() {
        // JWT が Cookie に設定されていたら、セッション情報を取得
        var id_token_jwt = this.cookies.get('jwt');
        if (typeof (id_token_jwt) === 'string' && this.state.id_token === null) {
            this.getClientConfig(id_token_jwt)
        }

        return (
            <div className="App">
                <BrowserRouter>
                    <Route path="/" render={(p) => {
                        let hash = p.location.hash
                        return (
                            <Container fluid>
                                <Row>
                                    <Col>
                                        <HeaderMenu location={p.location} login_state={this.state} />
                                    </Col>
                                </Row>
                                {(this.state.is_logged_in) && (
                                    <Row>
                                        <Col md="auto">
                                            <SideMenu
                                                hash={hash}
                                                user_role={this.state.user_role}
                                                onChangePage={this.onChangePage}
                                            />
                                        </Col>
                                        {(hash in MENU_ITEMS[this.state.user_role]) && (
                                            <Col>
                                                <SearchArea
                                                    location={p.location}
                                                    login_state={this.state}
                                                    client_config={this.state.client_config}
                                                    onChangeText={this.onChangeText}
                                                    onChangeSystemMsg={this.onChangeSystemMsg}
                                                    onChangeTableItems={this.onChangeTableItems}
                                                    onChangeShowDialog={this.onChangeShowDialog}
                                                    onChangeLocationFlg={this.onChangeLocationFlg}
                                                />
                                            </Col>
                                        )}
                                    </Row>
                                )}
                            </Container>
                        )
                    }} />
                    {/* ダイアログ表示 */}
                    <Dialog
                        show={this.state.show_dialog}
                        text={this.state.dialog_text}
                        logout_flag={true}
                        err_flag={true}
                        handleClose={this.handleClose}
                    />
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
