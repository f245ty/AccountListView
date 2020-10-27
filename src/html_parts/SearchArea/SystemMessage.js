import React from 'react'
import Dialog from '../Dialog'
import {
    ERR_WAIT_MSG,
    EXECUTION_MSG,
    EXPLANATION,
    NO_DATA_MSG,
    SEARCH_CONDITION,
    SEARCH_CONDITION_FOLDER,
    NOT_FIND_FOLDER_PATH,
    FILE_VALIDATION_MSG,
    CSV_RETENSION_PERIOD,
    MAIL_NOTIFICATION_MSG
} from '../../config/message';
import { STATUS_LABEL } from '../../config/config';

class SystemMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show_dialog: false
        }
    }

    // ダイアログ用のハンドラ
    handleClose = () => this.setState({ show_dialog: false });

    diffTTLDate = () => {
        let row = this.props.login_state.tableItems[0]
        let dateFrom = Date.parse(row["create_at"])
        let dateTo = Date.parse(this.props.location.hash === "#file" ? row["csv_ttl"] : row["zip_ttl"])
        return Math.floor((dateTo - dateFrom) / 86400000)
    }

    render() {
        return (
            <>
                {// 初期遷移時は、実行タスクが0件でも初期表示する
                    // 検索して結果が0件の時は 結果がないと表示する
                    (!this.props.login_state.location_flag) && (this.props.login_state.items.length === 0) && (
                        this.props.login_state.is_folder_path === undefined
                            ? <div>
                                {(this.props.location.hash === "#owner") && (EXPLANATION["owner"])}
                                {(this.props.location.hash === "#user") && (EXPLANATION["user"])}
                                {(this.props.location.hash === "#folder") && (EXPLANATION["folder"])}
                                {(this.props.location.hash === "#file") && (EXPLANATION["file"])}
                                <br />
                                {this.props.location.hash === "#folder" && (SEARCH_CONDITION_FOLDER)}
                                {(this.props.location.hash === "#owner" || this.props.location.hash === "#user") && (SEARCH_CONDITION)}
                            </div>
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
                {// API実行後の表示
                    (!this.props.login_state.location_flag) && (this.props.login_state.items.length !== 0) && (
                        <div className="text-left">
                            {this.props.location.hash !== "#file"
                                ?
                                this.props.login_state.is_search_result
                                    ?
                                    <div>
                                        {MAIL_NOTIFICATION_MSG}
                                        {CSV_RETENSION_PERIOD.replace('10', this.diffTTLDate())}
                                    </div>
                                    : <div>
                                        {(this.props.location.hash === "#owner") && (EXPLANATION["owner"])}
                                        {(this.props.location.hash === "#user") && (EXPLANATION["user"])}
                                        {(this.props.location.hash === "#folder") && (EXPLANATION["folder"])}
                                        <br />
                                        {(this.props.location.hash === "#folder") && (SEARCH_CONDITION_FOLDER)}
                                        {(this.props.location.hash === "#owner" || this.props.location.hash === "#user") && (SEARCH_CONDITION)}
                                    </div>
                                : null}

                            {this.props.location.hash === "#file"
                                ?
                                <div>
                                    {(this.props.login_state.is_search_permission === false) && (FILE_VALIDATION_MSG)}
                                    {(this.props.login_state.is_folder_path === false) && (NOT_FIND_FOLDER_PATH)}
                                    {(this.props.login_state.is_search_permission !== false && this.props.login_state.is_folder_path !== false) && (
                                        <div>
                                            {(this.props.login_state.is_process === true) && (
                                                <span>「{STATUS_LABEL[this.props.login_state.items[0]['process_state']]}」{EXECUTION_MSG} <br /><br /></span>
                                            )}
                                            {EXPLANATION["file"]}
                                        </div>
                                    )}
                                </div>
                                : null}
                        </div>
                    )
                }
            </>
        )
    }
}

export default SystemMessage
