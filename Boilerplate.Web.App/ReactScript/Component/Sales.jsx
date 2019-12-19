import React from 'react';
import { Button, Form, Modal, Icon, ModalActions, Pagination, Dropdown } from 'semantic-ui-react'
import { DateInput } from 'semantic-ui-calendar-react';
import Moment from 'react-moment';
import DropdownItems from './DropdownItems';
import moment from 'moment/moment.js'


export default class Sales extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            customerData: [],
            customer: '',
            productData: [],
            product: '',
            storeData: [],
            store: '',
            dateSold: '',
            id: 0,
            createModalOpen: false,
            deleteModalOpen: false,
            editModalOpen: false,
            data: {
                list: [],
                totalPage: 0,
                totalRecord: 0
            },
            buttonSortingCustomer: 'sort',
            buttonSortingProduct: 'sort',
            buttonSortingStore: 'sort',
            buttonSortingDateSold: 'sort',
            sortColumnName: 'id',
            sortOrder: '',
            dropdownValue: '10'
        };
    }

    componentDidMount() {
        this.loadData();
        this.getCustomerList();
        this.getProductList();
        this.getStoreList();

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((this.state.sortOrder !== prevState.sortOrder) ||
            (this.state.buttonSortingCustomer !== prevState.buttonSortingCustomer) ||
            (this.state.buttonSortingProduct !== prevState.buttonSortingProduct) ||
            (this.state.buttonSortingStore !== prevState.buttonSortingStore) ||
            (this.state.buttonSortingDateSold !== prevState.buttonSortingDateSold) ||
            (this.state.dropdownValue !== prevState.dropdownValue)) {
            this.loadData();
        }
    }

    getCustomerList = () => {
        fetch("/Customer/CustomerListSales")
            .then(res => res.json())
            .then((data) => {
                let thisList = data
                    .sort((a, b) => a.name > b.name)
                    .map(list => { return { key: list.id, text: list.name, value: list.id } })
                this.setState({
                    customerData: [{ value: '', display: '(Select Customer)' }].concat(thisList),
                    isLoading: false
                });
            })

            .catch(error => {
                if (error.response) {
                    console.log(error.responderEnd);
                }
            })
    }

    getProductList = () => {
        fetch("/Product/ProductListSales")
            .then(res => res.json())
            .then((data) => {
                let thisList = data
                    .sort((a, b) => a.name > b.name)
                    .map(list => { return { key: list.id, text: list.name, value: list.id } })
                this.setState({
                    productData: [{ value: '', display: '(Select Product)' }].concat(thisList),
                    isLoading: false
                });
            })
            .catch(error => {
                if (error.response) {
                    console.log(error.responderEnd);
                }
            })
    }


    getStoreList = () => {
        fetch("/Store/StoreListSales")
            .then(res => res.json())
            .then((data) => {
                let thisList = data
                    .sort((a, b) => a.name > b.name)
                    .map(list => { return { key: list.id, text: list.name, value: list.id } })
                this.setState({
                    storeData: [{ value: '', display: '(Select Store)' }].concat(thisList),
                    isLoading: false
                });
            })
            .catch(error => {
                if (error.response) {
                    console.log(error.responderEnd);
                }
            })
    }

    createSale = () => {
        console.log("date " + this.state.dateSold + " cust " + this.state.customer + " store " + this.state.store + " product " + this.state.product)
        console.log("testing moment - " + moment(this.state.dateSold, "DD-MM-YYYY").format("MM-DD-YYYY"))
        fetch("/Sales/CreateSales", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                DateSold: moment(this.state.dateSold, "DD-MM-YYYY").format("MM-DD-YYYY"),
                CustomerId: this.state.customer,
                ProductId: this.state.product,
                StoreId: this.state.store
            })
        })
            .then(res => {
                if (res.ok) {
                    this.setState({ createModalOpen: false, dateSold: '', customer: '', store: '', product: '' });
                    this.loadData();
                    console.log(res);
                } else {
                    alert("ALERT!!!\n\nPlease check all fields and try again")
                }
            }).catch(err => err);
    }

    editSale = (id) => {
        console.log("date " + this.state.dateSold + " cust " + this.state.customer + " store " + this.state.store + " product " + this.state.product)
        fetch("/Sales/EditSales/" + id, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                DateSold: moment(this.state.dateSold, "DD-MM-YYYY").format("MM-DD-YYYY"),
                CustomerId: this.state.customer,
                ProductId: this.state.product,
                StoreId: this.state.store
            })
        }).then((res) => {
            this.setState({ editModalOpen: false, dateSold: '', customer: '', store: '', product: '' });
            this.loadData();
            console.log(res);
        }).catch(err => err);
    }

    loadData = () => {
        console.log('testing before fetch : ' + this.state.sortColumnName + ' ' + this.state.sortOrder)
        fetch("/Sales/SalesList?sortColumnName=" + this.state.sortColumnName +
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

    deleteSale = (id) => {
        fetch("/Sales/DeleteSales/" + id, {
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
                    <td>{service.customer.name}</td>
                    <td>{service.product.name}</td>
                    <td>{service.store.name}</td>
                    <td><Moment format="DD/MM/YYYY">{service.dateSold}</Moment></td>


                    <td>
                        {/*Edit Modal*/}
                        <Modal open={this.state.editModalOpen} size={'tiny'} trigger={<Button icon color='yellow' labelPosition='left' onClick={() => this.setState({ editModalOpen: true, id: service.id, dateSold: moment(service.dateSold, "YYYY-DD-MM").format("MM-DD-YYYY"), customer: service.customer.id, product: service.product.id, store: service.store.id })}><Icon name='edit' />EDIT</Button>}>
                            <Modal.Header>Edit sale</Modal.Header>
                            <Modal.Content>
                                <Form>
                                    <Form.Field>
                                        <label>Date Sold</label>
                                        <DateInput
                                            name="dateSold"
                                            placeholder="Date Sold"
                                            value={this.state.dateSold}
                                            iconPosition="right"
                                            onChange={(event, { name, value }) => this.setState({ dateSold: value })}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Customer</label>
                                        <Dropdown
                                            placeholder='Select Customer'
                                            fluid
                                            selection
                                            options={this.state.customerData}
                                            value={this.state.customer}
                                            onChange={(event, { name, value }) => this.setState({ customer: value })}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Product</label>
                                        <Dropdown
                                            placeholder='Select Product'
                                            fluid
                                            selection
                                            options={this.state.productData}
                                            value={this.state.product}
                                            onChange={(event, { name, value }) => this.setState({ product: value })}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Store</label>
                                        <Dropdown
                                            placeholder='Select Store'
                                            fluid
                                            selection
                                            options={this.state.storeData}
                                            value={this.state.store}
                                            onChange={(event, { name, value }) => this.setState({ store: value })}
                                        />
                                    </Form.Field>
                                </Form>
                            </Modal.Content>
                            <ModalActions>
                                <Button secondary onClick={() => this.setState({ editModalOpen: false, dateSold: '', customer: '', store: '', product: '' })}>Cancel</Button>
                                <Button onClick={() => { this.editSale(this.state.id) }} icon positive type='submit' labelPosition='right'><Icon name='check' />Edit</Button>
                            </ModalActions>
                        </Modal>
                    </td>

                    <td>
                        {/*Delete Modal*/}
                        <Modal open={this.state.deleteModalOpen} trigger={<Button icon color='red' labelPosition='left' onClick={() => this.setState({ deleteModalOpen: true, id: service.id })}> <Icon name='trash' />DELETE</Button>}>
                            <Modal.Header>Delete sale</Modal.Header>
                            <Modal.Content>
                                <Form>
                                    <Form.Field>
                                        <h4>Are you sure?</h4>
                                    </Form.Field>
                                </Form>
                            </Modal.Content>
                            <ModalActions>
                                <Button secondary onClick={() => this.setState({ deleteModalOpen: false })}>Cancel</Button>
                                <Button icon onClick={(id) => this.deleteSale(this.state.id)} color='red' labelPosition='right' type='submit'><Icon name='cancel' />Delete</Button>
                            </ModalActions>
                        </Modal>
                    </td>
                </tr>
            )
        }
        return (
            <React.Fragment>
                <div>
                    {/*New sale Modal*/}
                    <Modal open={this.state.createModalOpen} size={'tiny'} trigger={<Button primary onClick={() => this.setState({ createModalOpen: true })}>New Sale</Button>}>
                        <Modal.Header>Create sale</Modal.Header>
                        <Modal.Content>
                            <Form>
                                <Form.Field>
                                    <label>Date Sold</label>
                                    <DateInput
                                        name="dateSold"
                                        placeholder="Date Sold"
                                        value={this.state.dateSold}
                                        iconPosition="right"
                                        onChange={(event, { name, value }) => this.setState({ dateSold: value })}
                                    />

                                </Form.Field>
                                <Form.Field>
                                    <label>Customer</label>
                                    <Dropdown
                                        placeholder='Select Customer'
                                        scrolling
                                        fluid
                                        selection
                                        options={this.state.customerData}
                                        value={this.state.customer}
                                        onChange={(event, { name, value }) => this.setState({ customer: value })}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Product</label>
                                    <Dropdown
                                        placeholder='Select Product'
                                        scrolling
                                        fluid
                                        selection
                                        options={this.state.productData}
                                        value={this.state.product}
                                        onChange={(event, { name, value }) => this.setState({ product: value })}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Store</label>
                                    <Dropdown
                                        placeholder='Select Store'
                                        scrolling
                                        fluid
                                        selection
                                        options={this.state.storeData}
                                        value={this.state.store}
                                        onChange={(event, { name, value }) => this.setState({ store: value })}
                                    />
                                </Form.Field>
                            </Form>
                        </Modal.Content>
                        <ModalActions>
                            <Button secondary onClick={() => this.setState({ createModalOpen: false, dateSold: '', customer: '', store: '', product: '' })}>Cancel</Button>
                            <Button onClick={this.createSale} icon positive type='submit' labelPosition='right'><Icon name='check' />Create</Button>
                        </ModalActions>
                    </Modal>

                    <DropdownItems handleClick={(event, { name, value }) => this.setState({ dropdownValue: value })} />

                    <table className="ui fixed celled striped table">
                        <thead>
                            <tr>
                                <th>Customer&emsp;
                                    <Button circular icon={this.state.buttonSortingCustomer}
                                        onClick={() => {
                                            (this.state.buttonSortingCustomer === 'angle up' || this.state.buttonSortingCustomer === 'sort') ?
                                                (this.setState({ buttonSortingProduct: 'sort', buttonSortingStore: 'sort', buttonSortingDateSold: 'sort', buttonSortingCustomer: 'angle down', sortColumnName: 'Customer.Name', sortOrder: 'asc' })) :
                                                (this.setState({ buttonSortingProduct: 'sort', buttonSortingStore: 'sort', buttonSortingDateSold: 'sort', buttonSortingCustomer: 'angle up', sortColumnName: 'Customer.Name', sortOrder: 'desc' }))
                                        }}
                                    /></th>
                                <th>Product&emsp;
                                    <Button circular icon={this.state.buttonSortingProduct}
                                        onClick={() => {
                                            (this.state.buttonSortingProduct === 'angle up' || this.state.buttonSortingProduct === 'sort') ?
                                                (this.setState({ buttonSortingCustomer: 'sort', buttonSortingStore: 'sort', buttonSortingDateSold: 'sort', buttonSortingProduct: 'angle down', sortColumnName: 'Product.Name', sortOrder: 'asc' })) :
                                                (this.setState({ buttonSortingCustomer: 'sort', buttonSortingStore: 'sort', buttonSortingDateSold: 'sort', buttonSortingProduct: 'angle up', sortColumnName: 'Product.Name', sortOrder: 'desc' }))
                                        }}
                                    /></th>
                                <th>Store&emsp;
                                    <Button circular icon={this.state.buttonSortingStore}
                                            onClick={() => {
                                                (this.state.buttonSortingStore === 'angle up' || this.state.buttonSortingStore === 'sort') ?
                                                    (this.setState({ buttonSortingCustomer: 'sort', buttonSortingDateSold: 'sort', buttonSortingProduct: 'sort', buttonSortingStore: 'angle down', sortColumnName: 'Store.Name', sortOrder: 'asc' })) :
                                                    (this.setState({ buttonSortingCustomer: 'sort', buttonSortingDateSold: 'sort', buttonSortingProduct: 'sort', buttonSortingStore: 'angle up', sortColumnName: 'Store.Name', sortOrder: 'desc' }))
                                            }}
                                        /></th>
                                <th>Date Sold&emsp;
                                    <Button circular icon={this.state.buttonSortingDateSold}
                                            onClick={() => {
                                                (this.state.buttonSortingDateSold === 'angle up' || this.state.buttonSortingDateSold === 'sort') ?
                                                    (this.setState({ buttonSortingCustomer: 'sort', buttonSortingProduct: 'sort', buttonSortingStore: 'sort', buttonSortingDateSold: 'angle down', sortColumnName: 'Convert.ToDateTime(DateSold).ToString("yyyy/dd/MM")', sortOrder: 'asc' })) :
                                                    (this.setState({ buttonSortingCustomer: 'sort', buttonSortingProduct: 'sort', buttonSortingStore: 'sort', buttonSortingDateSold: 'angle up', sortColumnName: 'Convert.ToDateTime(DateSold).ToString("yyyy/dd/MM")', sortOrder: 'desc' }))
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