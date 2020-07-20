import React from 'react';
import Dialog from '../Dialog'
import {
    ATTENTION_MSG,
    ERR_WAIT_MSG,
    EXECUTION_MSG,
    EXPLANATION,
    NO_DATA_MSG,
    SEARCH_CONDITION,
    SEARCH_CONDITION_FOLDER,
    NOT_FIND_FOLDER_PATH
} from '../../config/message';
import {STATUS_LABEL} from '../../config/config';

class SystemMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show_dialog: false
        }
    }

    // ダイアログ用のハンドラ
    handleClose = () => this.setState({ show_dialog: false });

    render() {
        return (
            <>
                {// 検索してないときは何も表示しない
                    (this.props.login_state.location_flag) && (
                        <p>
                            {(this.props.location.hash === "#owner") && (EXPLANATION["owner"])}
                            {(this.props.location.hash === "#user") && (EXPLANATION["user"])}
                            {(this.props.location.hash === "#folder") && (EXPLANATION["folder"])}
                            {(this.props.location.hash === "#file") && (EXPLANATION["file"])}
                            <br />
                            {this.props.location.hash === "#folder" ? SEARCH_CONDITION_FOLDER
                                :
                                this.props.location.hash === "#file" ? null
                                    : SEARCH_CONDITION}
                        </p>
                    )
                }
                {// 検索して結果が0件の時は 結果がないと表示する
                // ファイル情報集計機能に初期遷移時は、実行タスクが0件でも初期表示する
                    (!this.props.login_state.location_flag) && (this.props.login_state.items.length === 0) && (
                        this.props.location.hash === "#file"
                            ? this.props.login_state.is_folder_path === undefined
                                ? <p>
                                    {EXPLANATION["file"]}
                                    <br />
                                </p>
                                : <p>
                                    {NOT_FIND_FOLDER_PATH}
                                </p>
                            : <p>
                                {NO_DATA_MSG}
                            </p>
                    )
                }
                {// エラーが発生した時は、エラーメッセージを表示する
                    (this.props.login_state.items.length === 0) && (this.props.login_state.error !== null) && (
                        <Dialog show={this.state.show_dialog} err_flag={true} text={ERR_WAIT_MSG} handleClose={this.handleClose} />
                    )
                }
                {// 表示行数が0行の時は表示しない
                    (!this.props.login_state.location_flag) && (this.props.login_state.items.length !== 0) && (
                        <div>
                            {this.props.location.hash === "#file"
                                ? <div className="text-left">
                                    {this.props.login_state.is_folder_path === false
                                        ?
                                        <p>
                                            {NOT_FIND_FOLDER_PATH}
                                            <br />
                                            <br />
                                        </p>
                                        :
                                        <p>
                                            {this.props.login_state.is_process
                                                ? 
                                                <span>「{STATUS_LABEL[this.props.login_state.items[0]['process_state']]}」{EXECUTION_MSG} <br /><br /></span>
                                                :
                                                null}
                                            {EXPLANATION["file"]}
                                            <br />
                                            <br />
                                            <span>{ATTENTION_MSG} {ERR_WAIT_MSG}</span>
                                        </p>
                                    }
                                </div>
                                : null
                            }
                        </div>
                    )
                }
            </>
        )
    }
}

export default SystemMessage
