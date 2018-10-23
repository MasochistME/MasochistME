import React from 'react'
import { connect } from 'react-redux'
import { changeTab } from '../../store/modules/Tabs';

class NavItem extends React.Component {
    render() {
        const { props } = this;
        return (
            <li 
                onClick={ () => props.dispatch(changeTab(props.item.link)) } 
                className={ 
                    props.item.link === props.state.activeTab
                        ? `flex-column tab-active`
                        : `flex-column` }>
                <div className='flex-column'>
                    <i className={ props.item.icon } />
                    <p>{ props.item.text }</p>
                </div>
            </li>
        )
    }
}

const mapStateToProps = state => ({ state })
const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(
    mapStateToProps,
    mapDispatchToProps
)( NavItem )