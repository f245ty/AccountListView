import React from 'react';
import AWS from 'aws-sdk';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Nav } from 'react-bootstrap';
import HeaderMenu from './HeaderMenu';
import { Route, BrowserRouter } from 'react-router-dom';
import ItemList from './ItemList';
import Cookies from 'universal-cookie';
import jwt from 'jsonwebtoken';
// 【TODO：開発環境では、config_local使用】
// import { MENU_ITEMS, IDENTITY_POOL_ID, ACCOUNT_ID, LOGINS_SET_ID, ROLES, ROLE_ORDER } from './config';
import { MENU_ITEMS, IDENTITY_POOL_ID, ACCOUNT_ID, LOGINS_SET_ID, ROLES, ROLE_ORDER } from './config_local';
import Dialog from './Dialog';
import { GROUPS_ERR, ERR_WAIT_MSG } from './message';

const cookies = new Cookies();
var apigClientFactory = require('../node_modules/aws-api-gateway-client').default;


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
      show_dialog: false
    }
    // console.log(MENU_ITEMS['administrator'][1])

  }


  // ユーザが所属するグループから適切なロールを付与する
  // ロールは最も高い権限のものを有線して付与する
  getUserRole(user_groups) {

    var user_role = "user"
    console.log(user_groups)
    if (user_groups.groups !== undefined) {
      for (let order of ROLE_ORDER) {
        if (user_groups.indexOf(ROLES[order]) === -1) continue;
        else { user_role = order; break; }
      }
    }
    return user_role;
  }

  getUserGroups(client_config) {

    // CORS オリジンで呼べないので、Lambda から Azure AD の Token エンドポイントを呼び出して
    // 取得したトークンを取得している
    let get_user_profile_url = "https://stp3h4k946.execute-api.ap-northeast-1.amazonaws.com/develop/"
    let code = { code: cookies.get('code') };
    // let request_url = get_user_profile_url + "?code=" + code;
    // let xhr = new XMLHttpRequest();
    // let user_group_list = []
    // xhr.open('GET', request_url, false);
    // xhr.onload = (oEvent) => {
    //   console.log(oEvent)
    //   console.log(xhr.response)
    //   let res = JSON.parse(xhr.response);
    //   if (xhr.status !== 200) {
    //     this.setState({ show_dialog: true })
    //   } else {
    //     var not_implicit_id_token = jwt.decode(res.id_token);
    //     console.log(not_implicit_id_token);
    //     user_group_list = not_implicit_id_token.groups
    //   }
    // }
    // xhr.send();
    console.log(client_config)

    client_config.invokeUrl = get_user_profile_url;

    var apigClient = apigClientFactory.newClient(client_config);
    var pathParams = {};
    var pathTemplate = '';
    var method = 'GET';
    var additionalParams = {
      queryParams: code
    }
    var body = {}

    return apigClient.invokeApi(pathParams, pathTemplate, method, additionalParams, body)
      .then(function (result) {
        console.log(result)
        // state = modeling(result.data, state, csv_flag)
        return result
      }).catch(function (result) {
        console.log('API Gateway reply Error.')
        console.log(result)
        return []
      });
  }

  setLogIn(config, id_token) {
    var login_user = id_token.name
    var login_account = id_token.email ? id_token.email : id_token.preferred_username
    var user_groups = []; //グループに所属していない場合は権限なし
    if (id_token['groups']) user_groups = id_token.groups // 所属グループが5個以下の場合
    else if (id_token['hasgroups']) user_groups = this.getUserGroups(config)  // 所属グループが6個以上の場合
    var user_role = this.getUserRole(user_groups);

    this.setState({
      is_logged_in: true,
      id_token: id_token,
      login_user: login_user,
      login_account: login_account,
      user_role: user_role,
      client_config: config
    })

    console.log('login sequence')
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

  getClientConfig(id_token_jwt) {
    console.log(id_token_jwt)
    let url = "https://k8bto0c6d5.execute-api.ap-northeast-1.amazonaws.com/prototype/";

    // 解毒
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


  render() {

    // JWT が Cookie に設定されていたら、セッション情報を取得
    var id_token_jwt = cookies.get('jwt');
    if (typeof (id_token_jwt) === 'string' && this.state.id_token === null) {
      this.getClientConfig(id_token_jwt)
    }


    return (
      <div className="App">

        <BrowserRouter>
          <Route path="/" newProps render={(p) => {
            let hash = p.location.hash
            return (
              <Container fluid>
                <HeaderMenu location={p.location} login_state={this.state} />
                <form >

                </form>
                {
                  (this.state.is_logged_in) &&
                  (<Row>
                    <Nav variant="pills" className="flex-column">
                      {Object.keys(MENU_ITEMS[this.state.user_role]).map((key) => (
                        <Nav.Link href={key} active={hash === key ? true : false}>{MENU_ITEMS[this.state.user_role][key][1]}</Nav.Link>
                      ))}
                    </Nav>
                    {(hash in MENU_ITEMS[this.state.user_role]) && (
                      <Col className="mr-auto">
                        <ItemList location={p.location} login_state={this.state} client_config={this.state.client_config} />
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
            text={GROUPS_ERR + ERR_WAIT_MSG}
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
