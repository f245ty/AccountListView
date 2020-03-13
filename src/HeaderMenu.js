import React from 'react';
import Button from 'react-bootstrap/Button';
import { Nav, Navbar } from 'react-bootstrap';
import logo from './header_img.png';


class HeaderMenu extends React.Component {
    render(){
        return(
            <Navbar>
                <Navbar.Brand href="#home" className="mr-auto">
                    <img
                        src={logo}
                        className="d-inline-block align-top">
                    </img>
                </Navbar.Brand>
                <form class="form-inline my-2 my-lg-0">

                    <Button>
                        {
                            // ログインしていなければログイン、ログインしていればログアウトを表示
                            false ? "ログアウト":"ログイン"
                        }
                    </Button>
                
                </form>
            </Navbar>
        );
    }
}







export default HeaderMenu