import Cookies from 'universal-cookie';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { MENU_ITEMS, FILE_VALIDATION_PATH } from '../../config/config'
import { FILE_VALIDATION_MSG, ID_TOKEN_ERR, LOGIN } from '../../config/message'
import Dialog from '../Dialog';
import isAccessTokenEnable from '../../function/isAccessTokenEnable'
import getCSVTasks from '../../function/getCSVTasks';
import fetchData from '../../function/fetchData';

var cookies = new Cookies()

class Searchbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            search_flag: false,
            err_flag: false,
            text: ""
        }
    }

    onClickSearch = (event, hash) => {
        if (isAccessTokenEnable(this.props.login_state)) {
            console.log('search state')

            // 「/」のバリデーションチェック
            if (hash === "#file" || hash === "#folder") {
                if (!this.isValidateFolderPath(this.props.login_state.searchText)) {
                    console.log(this.props.login_state.searchText, " validated.")
                    this.setState({
                        loading: true,
                        err_flag: true,
                        search_flag: false,
                        text: FILE_VALIDATION_MSG
                    })
                } else {
                    this.executeSearch(hash)
                }
            } else {
                this.executeSearch(hash)
            }
        } else {
            console.log("id_token error.")
            this.handleChangeShowDialog(ID_TOKEN_ERR + LOGIN);
            cookies.remove('jwt');
        }
        event.preventDefault();
    }

    executeSearch = (hash) => {
        this.setState({
            loading: true,
            search_flag: true
        })

        if (hash === "#file") {
            getCSVTasks(this.props.location.hash, this.props.login_state, true).then((datas) => {
                this.handleChangeTableItems(datas, 1);
                this.setState({ loading: false })
            })
        } else {
            fetchData(this.props.location.hash, this.props.login_state, true).then((datas) => {
                this.handleChangeTableItems(datas, 1)
                this.setState({ loading: false })
            });
        }
        this.props.handleChangeLocationFlg();
    }

    isValidateFolderPath = (path) => {
        if (path === FILE_VALIDATION_PATH) return false
        else return true
    }

    handleChangeSystemMsg = () => {
        this.props.handleChangeSystemMsg();
    }

    handleChangeText = (event) => {
        this.props.handleChangeText(event);
    }

    handleChangeShowDialog = (message) => {
        this.props.handleChangeShowDialog(message);
    }

    handleClose = () => {
        this.setState({
            loading: false,
            search_flag: false,
            err_flag: false,
            text: ""
        })
    }

    handleChangeTableItems = (tableItems, num) => {
        this.props.handleChangeTableItems(tableItems, num);
    }

    render() {

        return (
            <div className="bg-dark p-3">
                <Form onSubmit={(e) => this.onClickSearch(e, this.props.location.hash, this.props.login_state.searchText)}>
                    <InputGroup className="">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">
                                {MENU_ITEMS[this.props.login_state.user_role][this.props.location.hash][0]}
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        {(this.props.location.hash === "#check") && (
                            <Form.Control
                                className="rounded-right"
                                value={this.props.login_state.searchText}
                                placeholder="前方一致検索を行います。"
                                type="text"
                                required
                                onChange={(e) => { this.handleChangeText(e); }}
                            />
                        )}
                        {(this.props.location.hash === "#file") && (
                            <Form.Control
                                className="rounded-right"
                                value={this.props.login_state.searchText}
                                placeholder="完全一致検索を行います。"
                                type="text"
                                required
                                onChange={(e) => { this.handleChangeText(e); }}
                            />
                        )}
                        {(this.props.location.hash === "#folder") && (
                            <Form.Control
                                className="rounded-right"
                                value={this.props.login_state.searchText}
                                placeholder="前方一致検索を行います。"
                                type="text"
                                required
                                onChange={(e) => { this.handleChangeText(e); }}
                            />
                        )}
                        {(this.props.location.hash === "#owner") && (
                            <Form.Control
                                className="rounded-right"
                                value={this.props.login_state.searchText}
                                placeholder="前方一致検索を行います。"
                                type="text"
                                required
                                readOnly={this.props.login_state.user_role === "manager"}
                                onChange={(e) => { this.handleChangeText(e); }}
                            />
                        )}
                        {(this.props.location.hash === "#user") && (
                            <Form.Control
                                className="rounded-right"
                                value={this.props.login_state.searchText}
                                placeholder="前方一致検索を行います。"
                                type="text"
                                required
                                readOnly={this.props.login_state.user_role === "manager"}
                                onChange={(e) => { this.handleChangeText(e); }}
                            />
                        )}
                        <InputGroup.Append>
                            <Button className="rounded ml-3" type="submit" disabled={this.props.location.hash === "#file" && this.props.login_state.is_process}>
                                {this.props.location.hash === "#check"
                                    ? <i className="fas fa-search"></i>
                                    : <i className="fas fa-file-signature"></i>
                                }
                                {this.props.location.hash === "#check"
                                    ? " 検索"
                                    : " CSV 書出"
                                }
                            </Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Form>
                <Dialog
                    show={this.state.loading}
                    search_flag={this.state.search_flag}
                    err_flag={this.state.err_flag}
                    text={this.state.text}
                    handleClose={this.handleClose}
                />
            </div>
        )
    }
}

export default Searchbar
