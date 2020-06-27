import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import "../static/css/App.css";
import "bootstrap/dist/css/bootstrap.min.css";

/**
 * 
 * @return {XXX} XXX
 */
function App_load() {
    return (
        <div className="App_load">
            <Navbar>
                <img src="images/header_img.png" alt="header logo"></img>
            </Navbar>
            <Container className="Load"></Container>
        </div>
    );
}

export default App_load;
