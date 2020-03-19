import React from 'react';
import AWS from 'aws-sdk';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Nav } from 'react-bootstrap';
import HeaderMenu from './HeaderMenu'
import { Route, BrowserRouter } from 'react-router-dom';
import ItemList from './ItemList';
import Cookies from 'universal-cookie';
import jwt from 'jsonwebtoken';
import { MENU_ITEMS, IDENTITY_POOL_ID } from './config'

import { Modal, Button } from 'react-bootstrap';

const cookies = new Cookies();



class App extends React.Component {
  constructor(props){
    super(props);
    console.log('page loaded')
    this.state = {
        is_logged_in: false,
        id_token: null,
        login_user: null,
        login_account: null,
        user_role: null,
        client_config: {}
    }
    console.log(MENU_ITEMS['administrator'][1])

  }


  // ユーザが所属するグループから適切なロールを付与する
  // ロールは最も高い権限のものを有線して付与する
  getUserRole(user_groups){
    // ロール付与グループ一覧
    // 現時点では固定
    const roles = {
      "86c759da-6918-4d19-8931-2cfa5f8f6ec7":"administrator",
      "a746a5b4-795b-4d5a-8d2b-4559b92d9bf4":"manager",
      }
    var user_role = "user"
    for( let group in roles){
      if(user_groups.indexOf(group) === -1 )continue;
      else{ user_role = roles[group]; break;}
    }
    return user_role;
  }

  setLogIn(config, id_token)
  {
    var login_user = id_token.name
    var login_account = id_token.preferred_username
    var user_groups = id_token['groups']? id_token.groups: []; //グループに所属していない場合は権限なし
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

  setLogout()
  {
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

  getClientConfig(id_token_jwt)
  {
    console.log(id_token_jwt)
    let url = "https://k8bto0c6d5.execute-api.ap-northeast-1.amazonaws.com/prototype/";

    // 解毒
    if(id_token_jwt === null ){
      console.log('JWT is null');
      return;
    }

    // JWT 形式じゃなかったら破棄
    var id_token = jwt.decode(id_token_jwt);
    if(id_token === null ){
      console.log('invalid JWT');
      cookies.remove('jwt');
      return;
    }

    // nonce が一致しなかったらトークンを破棄
    let nonce = cookies.get('nonce');
    if(nonce !== id_token.nonce){
      cookies.remove('jwt');
      cookies.remove('nonce');
      return;
    }
    else cookies.remove('nonce');

    var params = {
        AccountId: "707439530427",
        IdentityPoolId: IDENTITY_POOL_ID,
        Logins: {
            "login.microsoftonline.com/8a08112f-92e8-43fe-9a0a-56d393b9f042/v2.0": id_token_jwt
        }
    };

    // 資格情報の取得
    var cognitoidentity = new AWS.CognitoIdentity();
    cognitoidentity.getId( params,
      (err, data) => {
        if (err){
          console.log('can not get CognitIdentity')
          console.log(err, err.stack); // an error occurred
          this.setLogout()
        }else{
          let p = {
            IdentityId : data.IdentityId,                        
            Logins: params.Logins
          }
          cognitoidentity.getCredentialsForIdentity(p,
            (err, data) => {
              if (err){ // an error occurred
                console.log('can not get Credential')
                console.log(err, err.stack);
                console.log(id_token_jwt)
                this.setLogout()
              }else{
                var config = {
                  invokeUrl: url,
                  accessKey: data.Credentials.AccessKeyId,
                  secretKey: data.Credentials.SecretKey,
                  sessionToken: data.Credentials.SessionToken,
                  region: 'ap-northeast-1'
                }
                this.setLogIn(config,id_token)
              }
            });
        }
      });
  }


  render(){
    // ダイアログ用のハンドラ
    const handleClose = () => this.setState({show:false});
    const handleShow = () => this.setState({show:true});

    if(this.state.show === false)setTimeout(handleShow, 3000);

    // JWT が Cookie に設定されていたら、セッション情報を取得
    var id_token_jwt = cookies.get('jwt');
    if(typeof(id_token_jwt) === 'string' && this.state.id_token === null){
        this.getClientConfig(id_token_jwt)
    }

    return (
      <div className="App">
        {/* モーダルダイアログ
        <>
          <Button variant="primary" onClick={handleShow}>
            Launch demo modal
          </Button>

          <Modal show={this.state.show} onHide={handleClose} backdrop={'static'}>
            <Modal.Header closeButton>
              <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleClose}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </>
         */}
          <BrowserRouter>
            <Route newProps render={ (p) => {
              let hash = p.location.hash
              return(
                <Container fluid>
                  <HeaderMenu location={p.location} login_state={this.state} /> 
                  {
                    (this.state.is_logged_in)&& 
                      (<Row>
                      <Nav variant="pills" className="flex-column">
                        {Object.keys(MENU_ITEMS[this.state.user_role]).map((key) => (
                            <Nav.Link href={key} active={hash===key? true:false}>{MENU_ITEMS[this.state.user_role][key][1]}</Nav.Link>
                        ))}
                      </Nav>
                      {(hash in MENU_ITEMS[this.state.user_role])&&(
                        <Col className="mr-auto">
                          <ItemList location={p.location} login_state={this.state} client_config={this.state.client_config}/>
                        </Col>
                      )}
                      </Row>)
                  }
                </Container>
              )}}/>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
