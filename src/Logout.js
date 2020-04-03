////////////////////////////////////////////////////////////////////////////////
//
//  ダイアログを表示し、ログアウトする コンポーネント
//
import React from 'react';
import * as M from './message';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class Logout extends React.Component {

  goNextPage(e) {
    cookies.remove('jwt');
    document.location = '/';
  }

  render() {

    return (

      <Modal show={this.props.show} backdrop={'static'}>
        <Modal.Header closeButton>
          {this.props.err_flag ?
            <Modal.Title className="text-danger">{M.ERR_MSG}</Modal.Title>
            : <Modal.Title>{M.LOGOUT_Q}</Modal.Title>}
        </Modal.Header>
        {this.props.login_flag ?
          (<Modal.Body>
            {this.props.text}
            {M.LOGIN}
          </Modal.Body>)
          : null}
        <Modal.Footer>
          {this.props.login_flag ? null :
            <Button variant="secondary" onClick={(e) => this.props.handleClose()}>
              ✕ 閉じる
            </Button>
          }
          <Button variant="primary" onClick={(e) => this.goNextPage(e)} >
            {M.LOGIN_PAGE}
          </Button>
        </Modal.Footer>
      </Modal>

    );
  }
}


export default Logout;