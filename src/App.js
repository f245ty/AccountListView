import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Nav,Navbar } from 'react-bootstrap';
import HeaderMenu from './HeaderMenu'

function App() {
  return (
    <div className="App">
      <HeaderMenu />
      <Container fluid>
        <Row>
          <Nav variant="pills" className="flex-column">
            <Nav.Link href="/index.html#owner">管理フォルダ一覧</Nav.Link>
            <Nav.Link href="/index.html#user">権限付きフォルダ一覧</Nav.Link>
          </Nav>
          <Col className="main">
            <div id="ItemList"></div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
