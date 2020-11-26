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
            dateFrom = Date.parse(row["create_at"])
            dateTo = Date.parse(this.props.location.hash === "#file" ? row["csv_ttl"] : row["zip_ttl"])
            diff = Math.floor((dateTo - dateFrom) / 86400000)
        }
        return diff
    }

    render() {
        return (
            <>
                {// 初期遷移時は、実行タスクが0件でも初期表示する
                    (this.props.login_state !== undefined && !this.props.login_state.location_flag) && (
                        // ダウンロード開始不可の場合のメッセージ
                        (this.props.login_state.items.length !== 0 && this.props.login_state.is_process === true)
                            ?
                            <p>
                                <span>「{STATUS_LABEL_FILE[this.props.login_state.items[0]['process_state']]}」{EXECUTION_MSG} <br /><br /></span>
                                {EXPLANATION["file"]}
                            </p>
                            :
                            (this.props.login_state.is_folder_path === undefined && this.props.login_state.is_search_result === undefined)
                                ? <div>
                                    {(this.props.location.hash === "#owner") && (EXPLANATION["owner"])}
                                    {(this.props.location.hash === "#user") && (EXPLANATION["user"])}
                                    {(this.props.location.hash === "#folder") && (EXPLANATION["folder"])}
                                    {(this.props.location.hash === "#file") && (EXPLANATION["file"])}
                                    {(this.props.location.hash === "#check") && (EXPLANATION["check"].replace('10', this.diffTTLDate()))}
                                    <br />
                                    {this.props.location.hash === "#folder" && (SEARCH_CONDITION_FOLDER)}
                                    {(this.props.location.hash === "#owner" || this.props.location.hash === "#user") && (SEARCH_CONDITION)}
                                </div>
                                :
                                // API実行後のメッセージ
                                <div className="text-left">
                                    {this.props.location.hash !== "#file"
                                        ?
                                        (this.props.login_state.is_search_result === true && this.props.login_state.items.length !== 0)
                                            ?
                                            <div>
                                                {MAIL_NOTIFICATION_MSG}
                                                <br />
                                                {CSV_RETENSION_PERIOD.replace('10', this.diffTTLDate())}
                                            </div>
                                            :
                                            // 検索して結果が0件の時は 結果がないと表示する
                                            <div>
                                                {NO_DATA_MSG}
                                            </div>
                                        :
                                        <div>
                                            {(this.props.login_state.is_search_permission === false) && (FILE_VALIDATION_MSG)}
                                            {(this.props.login_state.is_folder_path === false) && (NOT_FIND_FOLDER_PATH)}
                                        </div>}
                                </div>
                    )
                }
                {// エラーが発生した時は、エラーメッセージを表示する
                    (this.props.login_state.items.length === 0) && (this.props.login_state.error !== null) && (
                        <Dialog show={this.state.show_dialog} err_flag={true} text={ERR_WAIT_MSG} handleClose={this.handleClose} />
                    )
                }
            </>
        )
    }
}

export default SystemMessage
