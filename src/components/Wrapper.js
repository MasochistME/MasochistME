import React from 'react'

export default class Wrapper extends React.Component{
    render() {
        const { props } = this;
        return (
            <div className={ `wrapper-${props.type}` }>
                { this.props.children }
            </div>
        )
    }
}