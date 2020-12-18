import React from 'react'
import Dialog from '../Dialog'
import {
    ERR_WAIT_MSG,
    EXECUTION_MSG,
    EXPLANATION,
    NO_DATA_MSG,
    SEARCH_CONDITION,
    SEARCH_CONDITION_FOLDER,
    NOT_FOUND_FOLDER_PATH,
    CSV_RETENSION_PERIOD,
    MAIL_NOTIFICATION_MSG
} from '../../config/message';
import { STATUS_LABEL_FILE } from '../../config/config';

class SystemMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show_dialog: false
        }
    }

    // ダイアログ用のハンドラ
    handleClose = () => this.setState({ show_dialog: false });

    // 保管期間をAPIから返却したデータから算出
    diffTTLDate = () => {
        let row = this.props.login_state.items[0]
        let dateFrom
        let dateTo
        let diff
        if (this.props.location.hash === "#check") {
            if (this.props.login_state.items.length === 0) {
                diff = '90'
            } else {
                dateFrom = Date.parse(row["check_date"])
                dateTo = Date.parse(row["download_ttl"])
                diff = Math.floor((dateTo - dateFrom) / 86400000)
            }
        } else {
            if (this.props.login_state.items.length === 0) {
                diff = '10'
            } else {
                dateFrom = Date.parse(row["create_at"])
                dateTo = Date.parse(this.props.location.hash === "#file" ? row["csv_ttl"] : row["zip_ttl"])
                diff = Math.floor((dateTo - dateFrom) / 86400000)
            }
        }
        return diff
    }

    // システムメッセージを設定
    setSystemMessage = () => {
        var message = {}
        var location = this.props.location.hash.slice(1)

        // 初期遷移時は、実行タスクが0件でも初期表示する
        message.first_message = EXPLANATION[location]

        if (location === "file") {
            message.first_message = EXPLANATION[location].replace('10', this.diffTTLDate())
            // ダウンロード開始不可の場合のメッセージ
            if (this.props.login_state.items[0] !== undefined && this.props.login_state.is_process === true) {
                message.no_download_message = `「${STATUS_LABEL_FILE[this.props.login_state.items[0]['process_state']]}」${EXECUTION_MSG}`
            }

            // 検索フォルダパスの有無
            if (this.props.login_state.location_flag === false && this.props.login_state.is_folder_path === false) {
                message.notfound_message = NOT_FOUND_FOLDER_PATH
            }

        } else if (location === "check") {
            // 初期遷移時は、実行タスクが0件でも初期表示する
            message.first_message = EXPLANATION[location].replace('10', this.diffTTLDate())
            message.second_message = SEARCH_CONDITION_FOLDER

            // 検索結果の有無
            if (this.props.login_state.location_flag === false && this.props.login_state.is_folder_path === false) {
                message.notfound_message = NO_DATA_MSG
            }

        } else {
            // CSV作成受付後
            if (this.props.login_state.is_search_result === true && this.props.login_state.items.length !== 0) {
                message.first_message = MAIL_NOTIFICATION_MSG
                message.second_message = CSV_RETENSION_PERIOD.replace('10', this.diffTTLDate())
            } else {
                if (location === "folder") {
                    message.second_message = SEARCH_CONDITION_FOLDER
                } else {
                    message.second_message = SEARCH_CONDITION
                }
            }
        }
        return message
    }

    render() {
        var message = this.setSystemMessage()

        return (
            <div>
                {(message.no_download_message) && (message.no_download_message)}
                {(message.notfound_message) && (message.notfound_message)}
                {(message.no_download_message || message.notfound_message) && (<><br /><br /></>)}
                <div>
                    {message.first_message}
                    <br />
                    {message.second_message}
                </div>

                {// エラーが発生した時は、エラーメッセージを表示する
                    (this.props.login_state.items.length === 0) && (this.props.login_state.error !== null) && (
                        <Dialog show={this.state.show_dialog}
                            err_flag={true}
                            text={ERR_WAIT_MSG}
                            handleClose={this.handleClose}
                        />
                    )
                }
            </div>

        )
    }
}

export default SystemMessage
