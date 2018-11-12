import React from 'react'
import { connect } from 'react-redux'

class Profile extends React.Component {
    render() {
        const { props } = this;
        return (
            <div className='flex-column'>
                <div className='wrapper-description'>
                    <div className='page-description'>
                        <p>This is your profile.</p>
                        <ul>
                            <li>Privilege: <span style={{ fontWeight: "bold" }}>{ props.privilege }</span></li>
                        </ul>
                    </div>
                </div>
                <div className='wrapper-profile'>
                    
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({ 
    privilege: state.privilege 
})

export default connect(
    mapStateToProps
)( Profile )