import React from 'react';
import { Button, Form, Modal, Icon, ModalActions, Pagination } from 'semantic-ui-react';
import DropdownItems from './DropdownItems';

export default class Store extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            name: '',
            address: '',
            id: 0,
            createModalOpen: false,
            deleteModalOpen: false,
            editModalOpen: false,
            data: {
                list: [],
                totalPage: 0,
                totalRecord: 0
            },
            buttonSortingName: 'sort',
            buttonSortingAddress: 'sort',
            sortColumnName: 'id',
            sortOrder: '',
            dropdownValue: '10'
        };
    }

    componentDidMount() {
        this.loadData();

    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((this.state.sortOrder !== prevState.sortOrder) ||
            (this.state.buttonSortingName !== prevState.buttonSortingName) ||
            (this.state.buttonSortingAddress !== prevState.buttonSortingAddress) ||
            (this.state.dropdownValue !== prevState.dropdownValue)) {
            this.loadData();
        }
    }

    createStore = () => {
        fetch("/Store/CreateStore", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Name: this.state.name,
                Address: this.state.address
            })
        })
            .then(res => {
                if (res.ok) {
                    this.setState({ createModalOpen: false, name: '', address: '' });
                    this.loadData();
                    console.log(res);
                } else {
                    alert("ALERT!!!\n\nPlease check fields and try again\n\n\n\nName field: Max number of characters is 50\n\Address field: Max number of characters is 250 ")
                }
            }).catch(err => err);
    }

    editStore = (id) => {
        fetch("/Store/EditStore/" + id, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Name: this.state.name,
                Address: this.state.address
            })
        }).then((res) => {
            if (res.ok) {
                this.setState({ editModalOpen: false, name: '', address: '' });
                this.loadData();
                console.log(res);
            } else {
                alert("ALERT!!!\n\nPlease check fields and try again\n\n\n\nName field: Max number of characters is 50\n\Address field: Max number of characters is 250 ")
            }
        }).catch(err => err);
    }

    loadData = () => {
        console.log('testing before fetch : ' + this.state.sortColumnName + ' ' + this.state.sortOrder)
        fetch("/Store/StoreList?sortColumnName=" + this.state.sortColumnName +
            "&sortOrder=" + this.state.sortOrder +
            "&pageSize=" + this.state.dropdownValue + "&currentPage=1")
            .then(res => res.json())
            .then((result) => {
                console.log(result)
                console.log('testing button ' + this.state.sortColumnName)
                this.setState({
                    data: result,
                    isLoading: false
                });
            })

            .catch(error => {
                if (error.response) {
                    console.log(error.responderEnd);
                }
            })
    }

    deleteStore = (id) => {
        fetch("/Store/DeleteStore/" + id, {
            method: 'DELETE'
        })
            .then(res => {
                this.setState({ deleteModalOpen: false });
                this.loadData();
                console.log(res);
            }).catch(err => err);
    }


    render() {

        let serviceList = this.state.data.list;

        let tableData = null;

        if (serviceList != "") {
            tableData = serviceList.map(service =>
                <tr key={service.id}>
                    <td>{service.name}</td>
                    <td>{service.address}</td>
                    <td>
                        {/*Edit Modal*/}
                        <Modal open={this.state.editModalOpen} size={'tiny'} trigger={<Button icon color='yellow' labelPosition='left' onClick={() => this.setState({ editModalOpen: true, id: service.id, name: service.name, address: service.address })}><Icon name='edit' />EDIT</Button>}>
                            <Modal.Header>Edit store</Modal.Header>
                            <Modal.Content>
                                <Form>
                                    <Form.Field>
                                        <label>NAME</label>
                                        <input value={this.state.name} onChange={(event) => this.setState({ name: event.target.value })} placeholder='Name' />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>ADDRESS</label>
                                        <input value={this.state.address} onChange={(event) => this.setState({ address: event.target.value })} placeholder='Address' />
                                    </Form.Field>
                                </Form>
                            </Modal.Content>
                            <ModalActions>
                                <Button secondary onClick={() => this.setState({ editModalOpen: false, name: '', address: '' })}>Cancel</Button>
                                <Button onClick={() => { this.editStore(this.state.id) }} icon positive type='submit' labelPosition='right'><Icon name='check' />Edit</Button>
                            </ModalActions>
                        </Modal>
                    </td>

                    <td>
                        {/*Delete Modal*/}
                        <Modal open={this.state.deleteModalOpen} trigger={<Button icon color='red' labelPosition='left' onClick={() => this.setState({ deleteModalOpen: true, id: service.id })}> <Icon name='trash' />DELETE</Button>}>
                            <Modal.Header>Delete store</Modal.Header>
                            <Modal.Content>
                                <Form>
                                    <Form.Field>
                                        <h4>Are you sure?</h4>
                                    </Form.Field>
                                </Form>
                            </Modal.Content>
                            <ModalActions>
                                <Button secondary onClick={() => this.setState({ deleteModalOpen: false })}>Cancel</Button>
                                <Button icon onClick={(id) => this.deleteStore(this.state.id)} color='red' labelPosition='right' type='submit'><Icon name='cancel' />Delete</Button>
                            </ModalActions>
                        </Modal>
                    </td>
                </tr>
            )
        }
        return (
            <React.Fragment>
                <div>
                    {/*New store Modal*/}
                    <Modal open={this.state.createModalOpen} size={'tiny'} trigger={<Button primary onClick={() => this.setState({ createModalOpen: true })}>New Store</Button>}>
                        <Modal.Header>Create store</Modal.Header>
                        <Modal.Content>
                            <Form>
                                <Form.Field>
                                    <label>NAME</label>
                                    <input value={this.state.name} onChange={(event) => this.setState({ name: event.target.value })} placeholder='Name' />
                                </Form.Field>
                                <Form.Field>
                                    <label>ADDRESS</label>
                                    <input value={this.state.address} onChange={(event) => this.setState({ address: event.target.value })} placeholder='Address' />
                                </Form.Field>
                            </Form>
                        </Modal.Content>
                        <ModalActions>
                            <Button secondary onClick={() => this.setState({ createModalOpen: false, name: '', address: '' })}>Cancel</Button>
                            <Button onClick={this.createStore} icon positive type='submit' labelPosition='right'><Icon name='check' />Create</Button>
                        </ModalActions>
                    </Modal>

                    <DropdownItems handleClick={(event, { name, value }) => this.setState({ dropdownValue: value })} />


                    <table className="ui fixed celled striped table">
                        <thead>
                            <tr>
                                <th>Name&emsp;
                                    <Button circular icon={this.state.buttonSortingName}
                                        onClick={() => {
                                            (this.state.buttonSortingName === 'angle up' || this.state.buttonSortingName === 'sort') ?
                                                (this.setState({ buttonSortingAddress: 'sort', buttonSortingName: 'angle down', sortColumnName: 'Name', sortOrder: 'asc' })) :
                                                (this.setState({ buttonSortingAddress: 'sort', buttonSortingName: 'angle up', sortColumnName: 'Name', sortOrder: 'desc' }))
                                        }}
                                    /></th>
                                <th>Location&emsp;
                                    <Button circular icon={this.state.buttonSortingAddress}
                                        onClick={() => {
                                            (this.state.buttonSortingAddress === 'angle up' || this.state.buttonSortingAddress === 'sort') ?
                                                (this.setState({ buttonSortingName: 'sort', buttonSortingAddress: 'angle down', sortColumnName: 'Address', sortOrder: 'asc' })) :
                                                (this.setState({ buttonSortingName: 'sort', buttonSortingAddress: 'angle up', sortColumnName: 'Address', sortOrder: 'desc' }))
                                        }}
                                    /></th>
                                <th>Actions</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData}
                        </tbody>
                    </table>
                </div>
            </React.Fragment >

        )
    }
}