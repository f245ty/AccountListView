import React from 'react';
import Cookies from 'universal-cookie';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import * as M from '../config/message';
import 'bootstrap/dist/css/bootstrap.min.css';

const cookies = new Cookies();

/**
 * ダイアログを表示し、ログアウトする コンポーネント
 * @module Dialog
 */
class Dialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {}
	}

	/**
	 * 
	 * @param {XXX} e XXX
	 */
	goLoginPage(e) {
		cookies.remove('jwt');
		document.location = '/';
	}

	handleClose = () => {
		this.props.handleCloseDialog();
	}

	/**
	 * 
	 * @return {XXX} XXX
	 */
	render() {
		return (
			<Modal id='dialog' show={this.props.show} backdrop={'static'}>
				<Modal.Header>
					{/* メッセージをflagで制御 */}
					{this.props.err_flag
						? <Modal.Title className="text-danger">{M.ERR_MSG}</Modal.Title>
						: this.props.logout_flag
							? <Modal.Title>{M.LOGOUT}</Modal.Title>
							: null
					}
					{this.props.search_flag
						? <Modal.Title>{M.SEARCH_MSG}</Modal.Title>
						: null
					}
					{this.props.csv_flag
						? <Modal.Title>{M.CSV_HEADER}</Modal.Title>
						: null
					}
				</Modal.Header>
				{this.props.search_flag
					? <Modal.Body>
						<div className="text-center">
							{/* //ローディングアイコン */}
							<br />
							<p><i className="fa fa-refresh fa-spin fa-5x"></i></p>
							<p>Loading...</p>
							{this.props.search_flag ? <div>{M.WAIT_MSG}</div> : null}
						</div>
					</Modal.Body>
					: null
				}
				{this.props.text
					? <Modal.Body>
						{this.props.text}
					</Modal.Body>
					: null
				}
				<Modal.Footer>
					{this.props.search_flag
						? null
						: (this.props.err_flag && this.props.logout_flag)
							? null
							: <Button variant="secondary" onClick={(e) => this.handleClose()}>
								✕ 閉じる
							</Button>
					}
					{this.props.logout_flag
						? <Button variant="primary" onClick={(e) => this.goLoginPage(e)} >
							{M.LOGIN_PAGE}
						</Button>
						: null
					}
				</Modal.Footer>
			</Modal>
		);
	}
}

export default Dialog;
