import React from 'react'

export default class MemberDetails extends React.Component {
    render() {
        const classDisplay = this.props.show ? "member-details display-flex" : "member-details display-none"
        
        return(
            <div className={ classDisplay }>
                *List of 100%d games coming soon!*
            </div>
        )

    }
}