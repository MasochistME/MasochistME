import React from 'react'
import { connect } from 'react-redux'

class SectionTop extends React.Component { 
    memberRow = (member, index) => 
        <div className="small-member" key={ `sidebar-member-${index}` }>
            <div>{ index+1 }.</div>
            <div><span className="bold">{ member.name }</span></div>
            <div>{ member.points } pts</div>
        </div>

    render() {
        const { props } = this;
        const members = props.members.slice(0, 10)
        return(
        <div className='section'>
            <h3 className='section-title'>Top 10 members</h3>
            <div className="flex-column">
                { members.map((member, memberIndex) => this.memberRow(member, memberIndex)) }
            </div>
        </div>)
    }
}

const mapStateToProps = state => ({ 
    members: state.members
})

export default connect(
  mapStateToProps
)( SectionTop )