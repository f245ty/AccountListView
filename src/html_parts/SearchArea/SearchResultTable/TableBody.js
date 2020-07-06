import React from 'react';
import { STATUS_LABEL } from '../../../config/config'

class TableBody extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
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
                                        <a href={row[col]} role="button">{row[col].split(".com/")[1]}</a>
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
