import React from 'react'
import MemberSummary from '../MemberSummary';
import MemberDetails from '../MemberDetails';

export default class Member extends React.Component{
    constructor() {
        super()
        this.state = { show: false }
    }

    changeDetailsVisibility = () => this.setState({ show: !this.state.show })

    render() {
        const { member, index, rating, games } = this.props

        return (
            <li 
                className="member flex-column"
                key={ `member-${member.id}` }
                onClick={ this.changeDetailsVisibility }>
                    <MemberSummary member={ member } index={ index } rating={ rating } />
                    <MemberDetails member={ member } show={ this.state.show } rating={ rating } games={ games }/>
            </li>
        )
    }
}