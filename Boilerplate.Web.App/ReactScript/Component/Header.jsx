import React, { Component } from 'react'
import { Menu, Segment } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom';


// The Header creates links that can be used to navigate
// between routes.
export default class Header extends Component {


    render() {


        return (
            <Segment inverted>
                <Menu inverted pointing secondary>
                    <Menu.Item as={NavLink} exact to='/'
                        name='home'
                    />
                    <Menu.Item as={NavLink} to='/customer'
                        name='customer'
                    />
                    <Menu.Item as={NavLink} to='/product'
                        name='product'
                    />
                    <Menu.Item as={NavLink} to='/store'
                        name='store'
                    />
                    <Menu.Item as={NavLink} to='/sales'
                        name='sales'
                    />
                </Menu>
            </Segment>
        )
    }
}

