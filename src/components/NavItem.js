import React from 'react'
import { connect } from 'react-redux'
import { changeTab } from '../redux/modules/Tabs';

class NavItem extends React.Component {
    render() {
        const { props } = this;
        return (
            <li 
                onClick={ () => props.dispatch(changeTab(props.item.link)) } 
                className='flex-column'>
                <div className='flex-column'>
                    <i className={ props.item.icon } />
                    <p>{ props.item.text }</p>
                </div>
            </li>
        )
    }
}

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(
    null,
    mapDispatchToProps
)( NavItem )