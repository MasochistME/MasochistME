import React from 'react'
import { connect } from 'react-redux'
import { changeTab } from '../../store/modules/Tabs';

class NavItem extends React.Component {
    openTab = props => 
        props.item.external 
            ? window.open(props.item.link) 
            : props.dispatch(changeTab(props.item.link))

    render() {
        const { props } = this;
        return (
            <li 
                onClick={ () => this.openTab(props) } 
                className={ 
                    props.item.link === props.activeTab
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

const mapStateToProps = state => ({ 
    activeTab: state.activeTab 
})
const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(
    mapStateToProps,
    mapDispatchToProps
)( NavItem )