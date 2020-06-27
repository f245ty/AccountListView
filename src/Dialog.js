////////////////////////////////////////////////////////////////////////////////
//
//  ダイアログを表示し、ログアウトする コンポーネント
//
import React from 'react';
import * as M from './config/message';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class Dialog extends React.Component {

  goLoginPage(e) {
    cookies.remove('jwt');
    document.location = '/';
  }

  render() {

    return (

      <Modal id='dialog' show={this.props.show} backdrop={'static'}>
        <Modal.Header>
          {/* メッセージをflagで制御 */}
          {this.props.err_flag ? <Modal.Title className="text-danger">{M.ERR_MSG}</Modal.Title>
            : (this.props.logout_flag ? <Modal.Title>{M.LOGOUT}</Modal.Title> : null)}
          {this.props.search_flag ? <Modal.Title>{M.SEARCH_MSG}</Modal.Title> : null}
        </Modal.Header>
        {this.props.search_flag ?
          (<Modal.Body>
            <div className="text-center">
              {/* //ローディングアイコン */}
              <br />
              <p><i className="fa fa-refresh fa-spin fa-5x"></i></p>
              <p>Loading...</p>
              {this.props.search_flag ? <div>{M.WAIT_MSG}</div> : null}
            </div>
          </Modal.Body>)
          : null}
        {this.props.text ?
          (<Modal.Body>
            {this.props.text}
          </Modal.Body>)
          : null}
        <Modal.Footer>
          {this.props.search_flag ?
            null :
            (this.props.err_flag && this.props.logout_flag) ?
              null :
              <Button variant="secondary" onClick={(e) => this.props.handleClose()}>
                ✕ 閉じる
            </Button>
          }
          {this.props.logout_flag ?
            <Button variant="primary" onClick={(e) => this.goLoginPage(e)} >
              {M.LOGIN_PAGE}
            </Button>
            : null}
        </Modal.Footer>
      </Modal>

    );
  }
}


export default Dialog;