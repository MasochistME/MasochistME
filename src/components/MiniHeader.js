import React from 'react'

export default class MiniHeader extends React.Component{
    constructor() {
        super()
        this.state = {
            title: "Game List",
            icon: "fas fa-gamepad"
        }
    }
    render() {
        return (
            <div className='wrapper-miniheader flex-row'>
                <div className='flex-row'>
                    <i className={ this.state.icon } />
                    <p>{ this.state.title }</p>
                </div>
            </div>
        )
    }
} 