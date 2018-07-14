import React from 'react'

export default class Login extends React.Component{
    render() {
        return (
            <div className='button flex-row'>
                <p>Not logged in</p>
                <i class="fas fa-sign-in-alt"></i>
            </div>
        )
    }
}