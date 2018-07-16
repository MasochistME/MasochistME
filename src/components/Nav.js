import React from 'react'
import tabs from '../config/tabs.json'

export default class Nav extends React.Component{
    render() {
        return (
            <ul className='flex-row'>
                {
                    tabs.map((item, index) => 
                        <li 
                            key={ `nav-${index}` }
                            className='flex-column'>
                            <div className='flex-column'>
                                <i className={ item.icon } />
                                <p>{ item.text }</p>
                            </div>
                        </li>
                    )
                }
            </ul>
        )
    }
}