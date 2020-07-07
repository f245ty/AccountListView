import Cookies from 'universal-cookie';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { MENU_ITEMS } from '../../config/config'
import Dialog from '../Dialog';
import isAccessTokenEnable from '../../function/isAccessTokenEnable'
import getCSVTasks from '../../function/getCSVTasks';
import fetchData from '../../function/fetchData';

class Searchbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
        this.maxPageValue = 100
        this.cookies = new Cookies()
    }

    onClickSearch = (event, hash, searchText) => {
        let searchType = this.props.location.hash.replace("#", "")
        if (isAccessTokenEnable(this.props.login_state)) {
            console.log('search state')
            this.setState({ loading: true })
            if (hash === "#file") {
                getCSVTasks(this.props.login_state.searchText, this.props.login_state, true).then((tableItems) => {
                    this.props.handleChangeTableItems(tableItems);
                    this.setState({ loading: false })
                })
            } else {
                fetchData(this.props.login_state.page, searchType, this.props.login_state).then((tableItems) => {
                    this.props.handleChangeTableItems(tableItems)
                    this.setState({ loading: false })
                });
            }
            this.props.handleChangeLocationFlg();
        } else {
            console.log("id_token error.")
            this.props.handleChangeShowDialog();
            this.cookies.remove('jwt');
        }
        event.preventDefault();
    }

    handleChangeText = (event) => {
        this.props.handleChangeText(event);
    }

    handleChangeRows = (event) => {
        this.props.handleChangeRows(event);
    }

    handleChangeTableItems = (tableItems) => {
        this.props.handleChangeTableItems(tableItems);
    }

    render() {
        const options = [];
        for (let i = 1; i <= this.maxPageValue; i += 1) {
            options.push(<option key={i}>{i}</option>);
        }

        return (
            <div className="bg-dark p-3">
                <Form onSubmit={(e) => this.onClickSearch(e, this.props.location.hash, this.props.login_state.searchText)}>
                    <InputGroup className="">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">
                                {MENU_ITEMS[this.props.login_state.user_role][this.props.location.hash][0]}
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        {(this.props.location.hash === "#file") && (
                            <Form.Control
                                className="rounded-right"
                                defaultValue={this.props.login_state.searchText}
                                placeholder="完全一致検索を行います。"
                                type="text"
                                required
                                onChange={(e) => { this.handleChangeText(e); }}
                            />
                        )}
                        {(this.props.location.hash === "#folder") && (
                            <>
                                <Form.Control
                                    className="rounded-right"
                                    defaultValue={this.props.login_state.searchText}
                                    placeholder="前方一致検索を行います。"
                                    type="text"
                                    required
                                    onChange={(e) => { this.handleChangeText(e); }}
                                />
                                <InputGroup.Append className="mx-3">
                                    <Form.Control as="select" defaultValue={this.props.login_state.rowsParPage} onChange={e => { this.handleChangeRows(e); }}>
                                        {options}
                                    </Form.Control>
                                </InputGroup.Append>
                            </>
                        )}
                        {(this.props.location.hash === "#owner") && (
                            <>
                                <Form.Control
                                    className="rounded-right"
                                    defaultValue={
                                        this.props.login_state.user_role === "administrator"
                                            ? this.props.login_state.searchText
                                            : undefined
                                    }
                                    value={
                                        this.props.login_state.user_role === "manager"
                                            ? this.props.login_state.searchText
                                            : undefined
                                    }
                                    placeholder="前方一致検索を行います。"
                                    type="text"
                                    required
                                    onChange={(e) => { this.handleChangeText(e); }}
                                />
                                <InputGroup.Append className="mx-3">
                                    <Form.Control as="select" defaultValue={this.props.login_state.rowsParPage} onChange={e => { this.handleChangeRows(e); }}>
                                        {options}
                                    </Form.Control>
                                </InputGroup.Append>
                            </>
                        )}
                        {(this.props.location.hash === "#user") && (
                            <>
                                <Form.Control
                                    className="rounded-right"
                                    defaultValue={
                                        this.props.login_state.user_role === "administrator"
                                            ? this.props.login_state.searchText
                                            : undefined
                                    }
                                    value={
                                        this.props.login_state.user_role === "manager"
                                            ? this.props.login_state.searchText
                                            : undefined
                                    }
                                    placeholder="前方一致検索を行います。"
                                    type="text"
                                    required
                                    onChange={(e) => { this.handleChangeText(e); }}
                                />
                                <InputGroup.Append className="mx-3">
                                    <Form.Control as="select" defaultValue={this.props.login_state.rowsParPage} onChange={e => { this.handleChangeRows(e); }}>
                                        {options}
                                    </Form.Control>
                                </InputGroup.Append>
                            </>
                        )}
                        <InputGroup.Append>
                            <Button className="rounded-left" type="submit" disabled={this.props.location.hash === "#file" && this.props.login_state.is_process}>
                                <i className={this.props.location.hash === "#file" ? "fas fa-download" : "fa fa-search"}></i> {this.props.location.hash === "#file" ? "ダウンロード" : "検索"}
                            </Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Form>
                <Dialog show={this.state.loading} search_flag={this.state.loading} />
            </div>
        )
    }
}

export default Searchbar
