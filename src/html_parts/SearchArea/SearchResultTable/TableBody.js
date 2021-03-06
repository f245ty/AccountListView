import Cookies from 'universal-cookie';
import React from 'react';
import { STATUS_LABEL, STATUS_LABEL_FILE } from '../../../config/config';
import getS3Url from '../../../function/getS3Url';
import isAccessTokenEnable from '../../../function/isAccessTokenEnable'

var cookies = new Cookies()

class TableBody extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    csvDownload = (filename, s3_url) => {
        if (isAccessTokenEnable(this.props.login_state)) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', s3_url);
            xhr.responseType = "blob"
            xhr.onload = (oEvent) => {
                console.log(xhr)
                // ダウンロード完了後の処理を定義する
                if (xhr.status === 200) {
                    let bom = new Uint8Array([0xEF, 0xBB, 0xBF]); // UTF-8
                    let blob
                    if (this.props.location.hash === "#file" || this.props.location.hash === "#check") {
                        blob = new Blob([bom, xhr.response], { type: 'text/csv' });
                    } else {
                        blob = new Blob([xhr.response, { headers: { Accept: 'application/zip' } }])
                    }
                    let f_name = filename;
                    if (window.navigator.msSaveBlob) {
                        // IEとEdge
                        window.navigator.msSaveBlob(blob, f_name);
                    }
                    else {
                        // それ以外のブラウザ
                        // Blobオブジェクトを指すURLオブジェクトを作る
                        let objectURL = window.URL.createObjectURL(blob);
                        // リンク（<a>要素）を生成し、JavaScriptからクリックする
                        let link = document.createElement("a");
                        document.body.appendChild(link);
                        link.href = objectURL;
                        link.download = f_name;
                        link.click();
                        document.body.removeChild(link);
                    }
                    this.props.onChangeLoading(false)
                } else {
                    this.props.onChangeError()
                }
            }
            xhr.send();
        } else {
            console.log("id_token error.")
            this.props.handleChangeShowDialog();
            cookies.remove('jwt');
        }
    }


    onClickDownloadLn = (event, filename) => {
        event.preventDefault();
        this.props.onChangeLoading(true)
        let pj_name = ""
        if (this.props.location.hash === "#file") {
            pj_name = "file in folder"
        } else {
            pj_name = "authority reference"
        }
        getS3Url(pj_name, filename, this.props.login_state).then((s3_url) => {
            this.csvDownload(filename, s3_url)
        })
    }

    render() {
        return (
            <tbody>
                {this.props.login_state.tableItems.map((row, index) => (
                    <tr key={index}
                        className={
                            this.props.location.hash === "#check"
                                ? row["unauthorized_users"] !== 0
                                    ? "table-danger"
                                    : null
                                : null
                        }
                    >
                        {Object.keys(row).map((col, index) => {
                            return (
                                <td key={index}
                                    className={
                                        // ステータスラベルの切り替え
                                        "失敗" === (this.props.location.hash === "#file" ? STATUS_LABEL_FILE[row[col]] : STATUS_LABEL[row[col]])
                                            && col === 'process_state'
                                            ? "text-center text-danger"
                                            : col === '#'
                                                || col === 'create_at'
                                                || col.match('ttl')
                                                || col === 'check_date'
                                                || col === 'process_state'
                                                || col.match('download')
                                                || col === "unauthorized_users"
                                                ? "text-center"
                                                : "text-left"
                                    }
                                >
                                    { col === 'download_ln'
                                        ?
                                        <a href={this.props.location}
                                            role="button"
                                            onClick={(event) => this.onClickDownloadLn(event, row[col].split(".com/")[1])}
                                        >
                                            {row[col].split(".com/")[1]}
                                        </a>
                                        :
                                        col === 'process_state'
                                            ?
                                            this.props.location.hash === "#file"
                                                ? STATUS_LABEL_FILE[row[col]]
                                                : STATUS_LABEL[row[col]]
                                            :
                                            row[col]}
                                </td>
                            )
                        })}
                    </tr>))
                }
            </tbody>
        )
    }
}

export default TableBody
