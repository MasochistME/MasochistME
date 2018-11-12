import React from 'react'
import { connect } from 'react-redux'

class Profile extends React.Component {
    render() {
        const { props } = this;
        return (
            <div className='flex-column'>
                <div className='wrapper-description'>
                    <div className='page-description'>
                        <h1>{ `${props.username} (${props.privilege})` }</h1>
                    </div>
                </div>
                <div className='wrapper-profile'>
                    
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({ 
    username: state.username,
    privilege: state.privilege
})

export default connect(
    mapStateToProps
)( Profile )