import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Pagination from 'react-bootstrap/Pagination';
import { ATTENTION_MSG, ERR_WAIT_MSG } from '../../../config/message';

class TablePagination extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    // クリックされたページを現在のページに更新
    handlePage(num) {
        this.props.handleChangeTableItems(this.props.login_state, num)
    }

    render() {
        // -2:前後2ページ表示
        var items = [];
        var state = this.props.login_state;
        var active = state.page;
        var end = state.pages;

        // 最初のページ
        if (active !== 1) {
            items.push(
                <Pagination.Item key={1} onClick={() => this.handlePage(1)}>
                    {1}
                </Pagination.Item>
            )
        }

        // ...
        if (active > 4) {
            items.push(<Pagination.Ellipsis key={"..."} disabled />)
        }
        // 前2ページ
        if (active > 3 && active <= end) {
            items.push(
                <Pagination.Item
                    key={'page#{active-2}'}
                    onClick={() => this.handlePage(active - 2)}>
                    {active - 2}
                </Pagination.Item>
            )
        }
        if (active > 2 && active <= end) {
            items.push(
                <Pagination.Item
                    key={"page#{active-1}"}
                    onClick={() => this.handlePage(active - 1)}>
                    {active - 1}
                </Pagination.Item>
            )
        }
        // 現在のページ
        items.push(
            <Pagination.Item
                key={"page#{active}"}
                // onClick={e => { this.handlePage(active) }}
                active>
                {active}
            </Pagination.Item>
        )
        // 後2ページ
        if (active + 1 < end) {
            items.push(
                <Pagination.Item
                    key={"page#{active+1}"}
                    onClick={() => this.handlePage(active + 1)}>
                    {active + 1}
                </Pagination.Item>
            )
        }
        if (active + 2 < end) {
            items.push(
                <Pagination.Item
                    key={"page#{active+2}"}
                    onClick={() => this.handlePage(active + 2)}>
                    {active + 2}
                </Pagination.Item>
            )
        }

        // ...
        if (active + 3 < end) {
            items.push(<Pagination.Ellipsis key={"page#{active+3}"} disabled />)
        }

        // 最後のページ
        if (active < end) {
            items.push(
                <Pagination.Item key={"e"} onClick={() => this.handlePage(end)}>
                    {end}
                </Pagination.Item>
            )
        }

        return (
            <Navbar className="pb-0">
                <Navbar.Text className="mr-auto">
                    <Pagination size="sm" className="text-center ailgn-items-center" >{items}</Pagination>
                </Navbar.Text>
                <Navbar>
                    <span className="text-left mb-0 small">{ATTENTION_MSG}{ERR_WAIT_MSG}</span>
                </Navbar>
            </Navbar>
        );
    }
}

export default TablePagination
