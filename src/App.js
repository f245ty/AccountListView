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
import { IDENTITY_POOL_ID } from './config'


const MENU_ITEM = {
  "#owner":"管理フォルダ権限一覧",
  "#user":"権限所有フォルダ一覧"
}

const cookies = new Cookies();

class App extends React.Component {
  constructor(props){
    super(props);

    this.state = {
        is_logged_in: false,
        id_token: jwt.decode(cookies.get('id_token')),
        client_config: {}
    }

    var id_token_jwt = cookies.get('id_token');
    if(typeof(id_token_jwt) == 'string')
      this.getClientConfig(id_token_jwt)
  }

  setLogIn(config)
  {
    this.setState({
      is_logged_in: true,
      client_config: config
    })
  }

  setLogout()
  {
    console.log('logout sequence')
    cookies.remove('id_token');
    this.setState({
      is_logged_in: false,
      client_config: {}
    })
  }


  getClientConfig(id_token_jwt)
  {
    console.log(id_token_jwt)
    let url = "https://k8bto0c6d5.execute-api.ap-northeast-1.amazonaws.com/prototype/";

    // 解毒
    if(id_token_jwt === null ){ console.log('id_token_jwt is null'); return; }
    var id_token = jwt.decode(id_token_jwt);
    if(id_token === null ){console.log('invalid id_token_jwt'); return;}
    // nonce が一致しなかったらトークンを破棄
    let nonce = cookies.get('nonce');
    if(nonce !== id_token.nonce){
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
              if (err){
                console.log('can not get Credential')
                console.log(err, err.stack); // an error occurred
                this.setLogout()
              }else{
                var config = {
                  invokeUrl: url,
                  accessKey: data.Credentials.AccessKeyId,
                  secretKey: data.Credentials.SecretKey,
                  sessionToken: data.Credentials.SessionToken,
                  region: 'ap-northeast-1'
                }
                this.setLogIn(config)
              }
            });
        }
      });
  }


  render(){
    return (
      <div className="App">
        <BrowserRouter>
            <Route newProps render={ (p) => {
              let hash = p.location.hash
              return(
                <Container fluid>
                  <HeaderMenu location={p.location} is_logged_in={this.state.is_logged_in} /> 
                  {
                    (this.state.is_logged_in)&& 
                      (<Row>
                      <Nav variant="pills" className="flex-column">
                        <Nav.Link href="#owner" active={hash==="#owner"? true:false}>{MENU_ITEM['#owner']}</Nav.Link>
                        <Nav.Link href="#user" active={hash==="#user"? true:false}>{MENU_ITEM['#user']}</Nav.Link>
                      </Nav>
                      {(hash==="#owner" || hash === "#user")&&(
                        <Col className="mr-auto">
                          <ItemList location={p.location} client_config={this.state.client_config}/>
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
