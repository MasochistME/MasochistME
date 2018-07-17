import React from 'react'
import tabs from '../config/tabs.json'
import NavItem from './NavItem'

export default class Nav extends React.Component {
    render() {
        return (
            <ul className='flex-row'>
                {   
                    tabs.map((item, index) => 
                        <NavItem 
                            key={ `nav-${index} `}
                            item={ item } 
                            index={ index } 
                        />)
                }
            </ul>
        )
    }
}