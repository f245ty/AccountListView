import React from 'react';
import Button from 'react-bootstrap/Button';
import { Navbar } from 'react-bootstrap';
import logo from './header_img.png';
import Cookies from 'universal-cookie';
import { LOGIN_URI, ROLE_NAME } from './config'

const cookies = new Cookies();

class HeaderMenu extends React.Component {

    // ログイン、ログアウト切り替え
    // 【TODO:リーダブルではない】
    onClickLogin(e){
        if(this.props.login_state.is_logged_in === true){
            cookies.remove('jwt');
            document.location = '/';
        }
        else{
            let nonce = Math.random().toString(36).slice(-8);
            cookies.set('nonce', nonce, { path: '/' });
            document.location = LOGIN_URI + nonce;
        }
    }

    
    render(){
        // id_token がハッシュに指定されていたら Cookie に退避
        if(this.props.location.hash.split('=')[0] === '#id_token'){
            let id_token = this.props.location.hash.split('=')[1].split('&')[0];
            cookies.set('jwt', id_token, { path: '/' });
            document.location = "/"
        }

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
                    {this.props.login_state.login_user}{(this.props.login_state.user_role)&&("(" + ROLE_NAME[this.props.login_state.user_role] +")")}
                    <Button variant="outline-primary" onClick={(e) => this.onClickLogin(e) }>
                        {
                            // ログインしていなければログイン、ログインしていればログアウトを表示
                            this.props.login_state.is_logged_in ? "ログアウト":"ログイン"
                        }
                    </Button>
                
                </form>
            </Navbar>
        );
    }
}

export default HeaderMenu