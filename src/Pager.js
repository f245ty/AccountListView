////////////////////////////////////////////////////////////////////////////////
//
//  ページングを行う コンポーネント
//

import React from 'react';
import fetchData from './fetchData';
import Pagination from 'react-bootstrap/Pagination';
import Row from 'react-bootstrap/Row';
import { Col } from 'react-bootstrap';


class Pager extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }


    handlePage(e, num) {
        // console.info("Go to #" + num + " page. ");
        this.state = this.props.query;
        this.state.page = num;
        // APIを叩いて、画面を更新する
        fetchData(
            this.state).then((data) => { this.props.updateList(data) }
            );
    }



    render() {

        // -2:前後2ページ表示
        var items = [];
        this.state = this.props.query;
        var active = this.state.page;
        var end = this.state.pages;

        // 最初のページ
        if (this.props.query.page !== 1) {
            items.push(
                <Pagination.Item key={1} onClick={e => { this.handlePage(e, 1) }}>
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
                    onClick={e => { this.handlePage(e, active - 2) }}>
                    {active - 2}
                </Pagination.Item>
            )
        }
        if (active > 2 && active <= end) {
            items.push(
                <Pagination.Item
                    key={"page#{active-1}"}
                    onClick={e => { this.handlePage(e, active - 1) }}>
                    {active - 1}
                </Pagination.Item>
            )
        }
        // 現在のページ
        items.push(
            <Pagination.Item
                key={"page#{active}"}
                // onClick={e => { this.handlePage(e, active) }}
                active>
                {active}
            </Pagination.Item>
        )
        // 後2ページ
        if (active + 1 < end) {
            items.push(
                <Pagination.Item
                    key={"page#{active+1}"}
                    onClick={e => { this.handlePage(e, active + 1) }}>
                    {active + 1}
                </Pagination.Item>
            )
        }
        if (active + 2 < end) {
            items.push(
                <Pagination.Item
                    key={"page#{active+2}"}
                    onClick={e => { this.handlePage(e, active + 2) }}>
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
                <Pagination.Item key={"e"} onClick={e => { this.handlePage(e, end) }}>
                    {end}
                </Pagination.Item>
            )
        }

        return (
            <div>
                <Row>
                    <Col className="text-left">
                        <p>検索結果：{this.props.query.total} 件</p>
                    </Col>
                    <Col>
                        <Pagination className="text-align-center">{items}</Pagination>
                    </Col>
                    {/* <Col>
                        <p>データ更新日：</p>
                    </Col> */}
                </Row>
            </div>
        );
    }
}

export default Pager;