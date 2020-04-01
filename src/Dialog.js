////////////////////////////////////////////////////////////////////////////////
//
//  ダイアログを表示し、ログアウトする コンポーネント
//
import React from 'react';
import { LOGIN, LOGIN_PAGE } from './message';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


class Dialog extends React.Component {

  render() {

    const handleClose = () => this.setState({ showDialog: !this.state.showDialog });
    return (

      <Modal show={this.props.show} onHide={this.props.handleClose} login_flag={this.props.login_flag} backdrop={'static'}>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">エラーが発生しました</Modal.Title>
        </Modal.Header>
        <Modal.Body >
          {this.props.text}
          {this.props.login_flag ? {LOGIN} : null}
        </Modal.Body>
        <Modal.Footer>
          {this.props.login_flag ? null :
            <Button variant="secondary" onClick={this.props.handleClose}>
              ✕ 閉じる
          </Button>
          }
          <Button variant="primary" onClick={this.props.handleClose}>
            {LOGIN_PAGE}
          </Button>
        </Modal.Footer>
      </Modal>

    );
  }
}


export default Dialog;