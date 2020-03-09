import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Nav,Navbar } from 'react-bootstrap';

function App() {
  return (
    <div className="App">
      <Navbar>
        <img src="images/favicon.ico" alt="header logo" ></img>
        <a href="# " className="pull-right">ログアウト</a>
      </Navbar>
      <Container className="main">
        <Row className="m-container">
          <Nav id="SideMenu" className="navber navbar-expand-xl fixed-left">
            SideMenu
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
