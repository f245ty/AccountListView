import Cookies from 'universal-cookie';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Dialog from './Dialog';
import { LOGIN_URI, ROLE_NAME } from '../config/config';
import logo from '../assets/images/header_img.png';

const cookies = new Cookies();

/**
 * ヘッダーメニュを管理する。ログインに関するフラグの管理も担当し、他からのアクセス影響を受けない。
 * @module HeaderMenu
 */
class HeaderMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show_dialog: false
        }
    }

    // TODO: リーダブルではない
    /**
     * ログイン、ログアウト切り替え
     */
    onClickLogin(e) {
        if (this.props.login_state.is_logged_in === true) {
            this.setState({ show_dialog: !this.state.show_dialog })
        } else {
            let nonce = Math.random().toString(36).slice(-8);
            cookies.set('nonce', nonce, { path: '/' });
            document.location = LOGIN_URI + nonce;
        }
    }

    /**
     * ヘッダーメニューを作成する。ログインフラグに応じて、ボタン内部を変更する。
     */
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

        return (
            <Navbar>
                <Navbar.Brand href="#home" className="mr-auto">
                    <img src={logo} className="d-inline-block align-top" alt="Company Logo." />
                </Navbar.Brand>
                <form className="form-inline my-2 my-lg-0">
                    {this.props.login_state.login_user}{(this.props.login_state.user_role) && (`(${ROLE_NAME[this.props.login_state.user_role]})`)}
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
