import React from 'react'
import { Dropdown, Label } from 'semantic-ui-react'

const itemsPerPage = [
    {
        key: '0',
        text: '5',
        value: '5'
    },
    {
        key: '1',
        text: '10',
        value: '10'
    },
    {
        key: '2',
        text: '20',
        value: '20'
    },
    {
        key: '3',
        text: '50',
        value: '50'
    },
    {
        key: '4',
        text: '100',
        value: '100'
    },

]

export default class DropdownItems extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="dropFloatRight">
                <Dropdown
                    placeholder='Items per page'
                    compact
                    selection
                    defaultValue='10'
                    options={itemsPerPage}
                    onChange={this.props.handleClick}
                />&emsp;
        <Label as='a' color='teal' tag>
                    Items per page
        </Label>
            </div>
        );
    }
}
