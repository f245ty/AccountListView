import React from 'react';
import Button from 'react-bootstrap/Button';
import { Navbar } from 'react-bootstrap';
import logo from './header_img.png';
import Cookies from 'universal-cookie';
import jwt from 'jsonwebtoken';


var login = 'https://login.microsoftonline.com/8a08112f-92e8-43fe-9a0a-56d393b9f042/oauth2/v2.0/authorize?client_id=3a0aef16-07ab-4f88-8122-4114b7c496a1&scope=openid+profile+email&response_type=id_token&response_mode=fragment&nonce=1112' 

const cookies = new Cookies();

class HeaderMenu extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            id_token: cookies.get('id_token'),
            name: ""
        }
    } 


    // ログイン、ログアウト制御
    onClickLogin(e){
        if(this.props.is_logged_in === true){
            cookies.set('id_token', "", { path: '/' });
            document.location = "/";
            e.preventDefault();
        }
        else{
            document.location = login;
        }
    }

    
    render(){
        var login_name = "";

        // id_token がハッシュに指定されていたら Cookie に退避
        if(this.props.location.hash.split('=')[0] === '#id_token'){
            let id_token = this.props.location.hash.split('=')[1].split('&')[0];
            cookies.set('id_token', id_token, { path: '/' });
            document.location = "/"
        }

        // id_token がクッキーに設定されていたら必要な情報を取得
        if(this.state.id_token !== "")
             login_name = jwt.decode(this.state.id_token).name;
        

        return(
            <Navbar>
                <Navbar.Brand href="#home" className="mr-auto">
                    <img
                        src={logo}
                        className="d-inline-block align-top"
                        alt="Company Logo.">
                    </img>
                </Navbar.Brand>
                <form className="form-inline my-2 my-lg-0">
                    {login_name}
                    <Button variant="outline-primary" onClick={(e) => this.onClickLogin(e) }>
                        {
                            // ログインしていなければログイン、ログインしていればログアウトを表示
                            this.props.is_logged_in ? "ログアウト":"ログイン"
                        }
                    </Button>
                
                </form>
            </Navbar>
        );
    }
}







export default HeaderMenu