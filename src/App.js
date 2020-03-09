import React from 'react';
import AWS from "aws-sdk";
import './App.css';

// react-route
// 認証トークンを受け取るため
import { BrowserRouter as Router, Route} from "react-router-dom";
import jwt from 'jsonwebtoken';


// Amazon Cognito 認証情報プロバイダーを初期化します
AWS.config.region = 'ap-northeast-1'; // リージョン
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'ap-northeast-1:9cd11c18-7668-4ea3-8427-40a8aed8ec94',
});


class App extends React.Component {
  id_token = '';

  render(){
    jwt.decode('');

    return(
      <Router>
      <Route render={ (props) =>
        props.location.hash ? (
          <div className="App">
            {console.log(jwt.decode(props.location.hash.split('&')[0].replace('#id_token=','')))}
            <a href='https://login.microsoftonline.com/8a08112f-92e8-43fe-9a0a-56d393b9f042/oauth2/v2.0/token?client_id=3a0aef16-07ab-4f88-8122-4114b7c496a1&scope=openid&response_type=id_token+code&response_mode=fragment&nonce=1112'>アクセストークンの取得</a>
            <div>
              header
            </div>
            <div>
              <div id="SideMenu">
                SideMenu
              </div>
              <div id="Board">
                <div id="ItemList"></div>
                </div>
              </div>
          </div>
        ):(
          <div className="App">
            <a href='https://login.microsoftonline.com/8a08112f-92e8-43fe-9a0a-56d393b9f042/oauth2/v2.0/authorize?client_id=3a0aef16-07ab-4f88-8122-4114b7c496a1&scope=openid&response_type=id_token&response_mode=fragment&nonce=1112'>ログイン</a>
            <div>
              header
            </div>
            <div>
              <div id="SideMenu">
                SideMenu
              </div>
              <div id="Board">
                <div id="ItemList"></div>
                </div>
              </div>
          </div>
        )
      } />
     </Router>
    );
  }
}

export default App;
