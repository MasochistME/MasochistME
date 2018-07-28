import React from 'react'
import { connect } from 'react-redux'
import NavItem from './NavItem'

class Nav extends React.Component {
    render() {
        const { props } = this;
        return (
            <ul className='flex-row'>
                {   
                    props.state.tabs.map((item, index) => 
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

const mapStateToProps = state => ( { state })

export default connect(
    mapStateToProps
)( Nav )