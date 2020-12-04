import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { MENU_ITEMS } from '../config/config'

/**
 * サイドバーを管理する。
 * @module SideMenu
 */
class SideMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    /**
     * 
     * @param {string} hash ハッシュ値
     */
    handleChangePage = (hash) => {
        this.props.onChangePage(hash);
    }

    render() {
        return (
            <Nav variant="pills" className="flex-column">
                {Object.keys(MENU_ITEMS[this.props.user_role]).map((hash) => (
                    <Nav.Link onClick={() => this.handleChangePage(hash)}
                        key={hash}
                        href={hash}
                        active={this.props.hash === hash ? true : false}
                        className={hash === "#file" ? "mt-4" : null}>
                        {MENU_ITEMS[this.props.user_role][hash][1]}
                    </Nav.Link>
                ))}
            </Nav>
        )
    }
}

export default SideMenu
