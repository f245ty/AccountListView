import Cookies from 'universal-cookie';
import React from 'react';
import { STATUS_LABEL } from '../../../config/config';
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
            xhr.responseType = "text"
            xhr.onload = (oEvent) => {
                // ダウンロード完了後の処理を定義する
                if (xhr.status === 200) {
                    let bom = new Uint8Array([0xEF, 0xBB, 0xBF]); // UTF-8
                    let blob = new Blob([bom, xhr.response], { type: 'text/csv' });
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
        getS3Url(filename, this.props.login_state).then((s3_url) => {
            this.csvDownload(filename, s3_url)
        })
    }

    render() {
        return (
            <tbody>
                {this.props.login_state.items.map((row, index) => (
                    <tr key={index}>
                        {Object.keys(row).map((col, index) => {
                            return (
                                <td key={index}
                                    className={col.indexOf('p_') === 0 || col === '#' || col === 'create_at' || col === 'csv_ttl' || col === 'process_state' || col === 'download_ln'
                                        ? "text-center"
                                        : "text-left"}>
                                    {col === 'download_ln'
                                        ?
                                        <a href="#file" role="button" onClick={(event) => this.onClickDownloadLn(event, row[col].split(".com/")[1])}>
                                            {row[col].split(".com/")[1]}
                                        </a>
                                        :
                                        col === 'process_state'
                                            ?
                                            STATUS_LABEL[row[col]]
                                            :
                                            row[col]}
                                </td>
                            )
                        })}
                    </tr>))}
            </tbody>
        )
    }
}

export default TableBody
