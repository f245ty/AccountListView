import React from 'react';
import Button from 'react-bootstrap/Button';
import { Navbar } from 'react-bootstrap';
import logo from '../static/image/header_img.png';
import Cookies from 'universal-cookie';
// 【TODO：開発環境では、config_local使用】
// import { LOGIN_URI, ROLE_NAME } from './config';
import { LOGIN_URI, ROLE_NAME } from '../config/config_local'
// import { SESSION_ERR } from './message';
import Dialog from './Dialog';

const cookies = new Cookies();

class HeaderMenu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show_dialog: false,
            timeout: false
        }
    }
    // ログイン、ログアウト切り替え
    // 【TODO:リーダブルではない】
    onClickLogin(e) {
        if (this.props.login_state.is_logged_in === true) {
            this.setState({ show_dialog: !this.state.show_dialog })
        }
        else {
            let nonce = Math.random().toString(36).slice(-8);
            cookies.set('nonce', nonce, { path: '/' });
            document.location = LOGIN_URI + nonce;
        }
    }


    render() {

        // hash を各要素に分割
        let hashs = this.props.location.hash.slice(1).split('&');
        let hash = {};
        for(let item of hashs){
            let kv = item.split('=');
            hash[kv[0]]=kv[1];
        }

        // id_token がハッシュに指定されていたら Cookie に退避
        if (hash['id_token']) {
            let id_token = hash['id_token']
            cookies.set('jwt', id_token, { path: '/' });
            document.location = "/"
        }

        // code がハッシュに指定されていたら Cookie に退避
        if (hash['code']) {
            let code = hash['code']
            cookies.set('code', code, { path: '/' });
            document.location = "/"
        }

        // ダイアログ用のハンドラ
        const handleClose = () => this.setState({ show_dialog: false });
        // // 一定期間操作が無ければダイアログを表示し、ログアウト
        // if (this.props.login_state.is_logged_in === true && this.state.show_dialog === false)
        //     setTimeout(handleShow, 30000000);

        return (
            <Navbar>
                <Navbar.Brand href="#home" className="mr-auto">
                    <img
                        src={logo}
                        className="d-inline-block align-top"
                        alt="Company Logo." />
                </Navbar.Brand>
                <form className="form-inline my-2 my-lg-0">
                    {this.props.login_state.login_user}{(this.props.login_state.user_role) && ("(" + ROLE_NAME[this.props.login_state.user_role] + ")")}
                    <Button variant="outline-primary" onClick={(e) => this.onClickLogin(e)}>
                        {
                            // ログインしていなければログイン、ログインしていればログアウトを表示
                            this.props.login_state.is_logged_in ? "ログアウト" : "ログイン"
                        }
                    </Button>
                    <Dialog
                        show={this.state.show_dialog}
                        logout_flag={this.state.show_dialog}
                        handleClose={handleClose}
                    />

                </form>
            </Navbar>
        );
    }
}

export default HeaderMenu