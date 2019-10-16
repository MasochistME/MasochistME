import React from 'react'
import MemberSummary from '../MemberSummary';
import MemberDetails from '../MemberDetails';

export default class Member extends React.Component {
    constructor() {
        super()
        this.state = { show: false }
    }

    changeDetailsVisibility = () => this.setState({ show: !this.state.show })

    render() {
        const { member, index, rating, games, patron, badges } = this.props

        return (
            <li 
                className="member flex-column">
                    <MemberSummary member={ member } index={ index } rating={ rating } patron={ patron } badges={ badges } showDetailsCallback={ this.changeDetailsVisibility }/>
                    {
                        this.state.show
                            ? <MemberDetails member={ member } show={ this.state.show } rating={ rating } badges={ badges } games={ games }/>
                            : null
                    }
            </li>
        )
    }
}