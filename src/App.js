/* eslint-disable import/first */
import AWS from 'aws-sdk';
import jwt from 'jsonwebtoken';
import Cookies from 'universal-cookie';
import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Nav from 'react-bootstrap/Nav';
import { Route, BrowserRouter } from 'react-router-dom';
import Dialog from './html_parts/Dialog';
import HeaderMenu from './html_parts/HeaderMenu';
import ItemList from './html_parts/ItemList';
import {
  ACCOUNT_ID,
  GET_GROUPS_URL,
  IDENTITY_POOL_ID,
  LOGINS_SET_ID,
  MENU_ITEMS,
  ROLES,
  ROLE_ORDER
} from './config/config';
import { ERR_WAIT_MSG, LOGIN_ERR } from './config/message';
import './static/css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const cookies = new Cookies();
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
      is_logged_in: false,
      id_token: null,
      login_user: null,
      login_account: null,
      user_role: null,
      client_config: {},
      show_dialog: false,
      location_flag: false,
      permit_get_API_flag: false,
    }
  }

  /**
   * ユーザが所属するグループから適切なロールを付与する
   * ロールは最も高い権限のものを有線して付与する
   * @param {XXX} user_groups XXX
   * @return {XXX} XXX
   */
  applyUserGroup(user_groups) {

    var user_role = "user"
    if (user_groups !== undefined) {
      for (let order of ROLE_ORDER) {
        if (user_groups.indexOf(ROLES[order]) === -1) continue;
        else { user_role = order; break; }
      }
    }
    // console.log(user_role)
    return user_role;
  }

  /**
   * 
   * @param {XXX} client_config XXX
   * @return {XXX} XXX
   */
  getUserRole(client_config) {
    console.log('getUserRole')

    // CORS オリジンで呼べないので、Lambda から Azure AD の Token エンドポイントを呼び出して
    // 取得したトークンを取得している
    let code = { code: cookies.get('code') };
    // console.log(code)

    client_config.invokeUrl = GET_GROUPS_URL;

    var apigClient = apigClientFactory.newClient(client_config);
    var pathParams = {};
    var pathTemplate = '';
    var method = 'GET';
    var additionalParams = {
      queryParams: code
    }
    var body = {}

    return apigClient.invokeApi(pathParams, pathTemplate, method, additionalParams, body)
      .then(result => {
        var not_implicit_id_token = jwt.decode(result.data.id_token);
        console.log(not_implicit_id_token)
        var user_role = this.applyUserGroup(not_implicit_id_token.groups)
        console.log(user_role)
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
   * 
   * @param {XXX} config XXX
   * @param {XXX} id_token XXX
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

    } catch{
      this.setState({ show_dialog: true })
    }

    console.log(this.state)
  }

  setLogout() {
    cookies.remove('jwt');
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

  /**
   * 
   * @param {XXX} id_token_jwt XXX
   */
  getClientConfig(id_token_jwt) {
    console.log(id_token_jwt)
    let url = "https://k8bto0c6d5.execute-api.ap-northeast-1.amazonaws.com/prototype/";

    // 解読
    if (id_token_jwt === null) {
      console.log('JWT is null');
      return;
    }

    // JWT 形式じゃなかったら破棄
    var id_token = jwt.decode(id_token_jwt);
    if (id_token === null) {
      console.log('invalid JWT');
      cookies.remove('jwt');
      return;
    }
    console.log(id_token)

    // nonce が一致しなかったらトークンを破棄
    let nonce = cookies.get('nonce');
    if (nonce !== id_token.nonce) {
      cookies.remove('jwt');
      cookies.remove('nonce');
      return;
    }
    else cookies.remove('nonce');

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
          this.setState({ show_dialog: true })
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
                this.setState({ show_dialog: true })
                this.setLogout()
              } else {
                var config = {
                  invokeUrl: url,
                  accessKey: data.Credentials.AccessKeyId,
                  secretKey: data.Credentials.SecretKey,
                  sessionToken: data.Credentials.SessionToken,
                  region: 'ap-northeast-1'
                }
                this.setLogIn(config, id_token)
              }
            });
        }
      });
  }

  /**
   * メニュー押下時に、メニュー切り替えフラグをtrueにする
   * また、ファイル情報集計メニューの場合、ファイル情報集計実行タスク検索API実施フラグをtrueにする
   * @param {xxx} location 押下したメニュー
   */
  onClickLocation(location) {
    this.onLocationFlag()
    if (location === "#file") this.onGetCSVTasksFlag()
  }

  // メニューがクリックされ、renderのタイミングのフラグ
  onLocationFlag = () => this.setState({ location_flag: true })
  offLocationFlag = () => this.setState({ location_flag: false })

  // ファイル情報集計実行タスク検索をするフラグ
  onGetCSVTasksFlag = () => this.setState({ permit_get_API_flag: true })
  offGetCSVTasksFlag = () => this.setState({ permit_get_API_flag: false })

  render() {
    // JWT が Cookie に設定されていたら、セッション情報を取得
    var id_token_jwt = cookies.get('jwt');
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
                <HeaderMenu location={p.location} login_state={this.state} />
                {
                  (this.state.is_logged_in) &&
                  (<Row>
                    <Nav variant="pills" className="flex-column">
                      {Object.keys(MENU_ITEMS[this.state.user_role]).map((key) => (
                        <Nav.Link onClick={(e) => this.onClickLocation(key)}
                          key={key}
                          href={key}
                          active={hash === key ? true : false}
                          className={key === "#file" ? "mt-4" : null}>
                          {MENU_ITEMS[this.state.user_role][key][1]}
                        </Nav.Link>
                      ))}
                    </Nav>
                    {(hash in MENU_ITEMS[this.state.user_role]) && (
                      <Col className="mr-auto">
                        <ItemList
                          location={p.location}
                          offLocationFlag={this.offLocationFlag}
                          login_state={this.state}
                          client_config={this.state.client_config}
                          onGetCSVTasksFlag={this.onGetCSVTasksFlag}
                          offGetCSVTasksFlag={this.offGetCSVTasksFlag}
                        />
                      </Col>
                    )}
                  </Row>)
                }
              </Container>
            )
          }} />
          {/* ダイアログ表示 */}
          <Dialog
            show={this.state.show_dialog}
            text={LOGIN_ERR + ERR_WAIT_MSG}
            logout_flag={true}
            err_flag={true}
          // handleClose={handleClose}
          />
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
