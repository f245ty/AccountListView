import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Nav,Navbar } from 'react-bootstrap';
import HeaderMenu from './HeaderMenu'
import { Route, HashRouter, BrowserRouter } from 'react-router-dom';


const MENU_ITEM = {
  "#owner":"管理フォルダ一覧",
  "#user":"権限付きフォルダ一覧"
}


function App() {
  return (
    <div className="App">
      <HeaderMenu />
      <Container fluid>
        <Row>
          <BrowserRouter>
            <Route render={(p) =>{
              let hash = p.location.hash
              return(
                <Nav variant="pills" className="flex-column">
                  <Nav.Link href="#owner" active={hash=="#owner"? true:false}>{MENU_ITEM['#owner']}</Nav.Link>
                  <Nav.Link href="#user" active={hash=="#user"? true:false}>{MENU_ITEM['#user']}</Nav.Link>
                </Nav>
              )
            }}/>
          </BrowserRouter>
          <Col className="mr-auto">
            <div id="ItemList"></div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
