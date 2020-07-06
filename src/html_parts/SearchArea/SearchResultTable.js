import React from 'react';
import Table from 'react-bootstrap/Table';
import TableBody from './SearchResultTable/TableBody'
import TableHeader from './SearchResultTable/TableHeader'
import TablePagination from './SearchResultTable/TablePagination'

class SearchResultTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    handleChangeTableItems = (tableItems) => {
        this.props.handleChangeTableItems(tableItems);
    }

    render() {
        return (
            <>
                {(this.props.login_state.items.length !== 0) && (
                    <div>
                        {this.props.location.hash === "#file"
                            ? null
                            :
                            <TablePagination
                                login_state={this.props.login_state}
                                location={this.props.location}
                                handleChangeTableItems={this.handleChangeTableItems}
                            />
                        }
                        <Table striped bordered hover id="res_table">
                            <TableHeader
                                login_state={this.props.login_state}
                                location={this.props.location}
                                handleChangeTableItems={this.handleChangeTableItems}
                            />
                            <TableBody
                                login_state={this.props.login_state}
                                location={this.props.location}
                                handleChangeTableItems={this.handleChangeTableItems}
                            />
                        </Table>
                    </div>
                )}
            </>
        )
    }
}

export default SearchResultTable
