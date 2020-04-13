import React from 'react'
import { connect } from 'react-redux'
import { changeTab } from '../../../../shared/store/modules/Tabs'
import { showProfile } from '../../../../shared/store/modules/Profiles'

class MemberSummary extends React.Component {
    constructor() {
        super()
        this.state = { 
            detailsVisible: false,
            member: 0
        }
    }

    showProfile = () => {
        this.props.dispatch(showProfile(this.state.member));
        this.props.dispatch(changeTab('profile'));
    }

    summarizeBadgePoints = (member, badges) => {
        let sum = 0;
        member.badges.map(badge => {
            const membersBadge = badges.find(b => badge.id == b['_id']);
            if (membersBadge) {
                if (typeof membersBadge.points !== 'number')
                    membersBadge.points = parseInt(membersBadge.points);
                sum += membersBadge.points;
            }
        })
        return sum;
    }

    detailsVisible = (event) => {
        this.setState({ detailsVisible: !this.state.detailsVisible })
        this.props.showDetailsCallback();
        event.stopPropagation();
    }

    componentDidMount = () => {
        this.setState({ member: this.props.member.id })
    }

    render() {
        const { member, index, rating, patron, badges } = this.props
        const badgePoints = this.summarizeBadgePoints(member, badges);
        const disabled = member.points - badgePoints <== 0 ? true : false
        const tier = patron 
            ? patron.tier
            : null
        const shekelmaster = tier == 4

        return(
            <div className={`member-summary flex-row ${disabled ? 'member-disabled' : ''} ${shekelmaster ? 'member-shekelmaster' : '' }` } onClick={ this.showProfile }>
                <div className="member-position">{ index+1 }</div>
                <img className="member-avatar" src={ member.avatar } alt="avatar" />
                {
                    tier 
                        ? <i className={ `fas fa-donate member-patron tier${tier}` } title={ patron.description.toUpperCase() } />
                        : <i className='fas fa-donate member-patron' style={{ color: 'transparent' }}/>
                }
                <div className="member-info flex-row">
                    <i className={ `fas fa-chevron-down icon-hover ${ this.state.detailsVisible ? 'icon-active' : '' }`} onClick={ this.detailsVisible }/>
                    <div className='flex-row'>
                        {
                            disabled
                                ? <i className="fas fa-exclamation-triangle" title="This member has their Steam profile set to private." />
                                : <div></div>
                        }
                        <div className={ `member-name ${ shekelmaster ? `tier${tier}` : ''}` }>{ member.name }</div>
                    </div>
                    <div className='dummy'></div>
                    <div className="member-ranking flex-row">
                        <div className="member-rating-score" title="Sum of all points">
                            { member.points ? member.points : 0 }
                            <span className="bold"> Σ</span>
                        </div>
                        {   
                            rating.map((score, scoreIndex) => {
                                return <div className="member-rating-score" key={`member-rating-score-${scoreIndex}`}>
                                    { member.ranking[score.id] !== undefined
                                        ? member.ranking[score.id]
                                        : 0 }
                                    <i className={ score.icon } style={{ paddingRight: "5px"}}/> 
                                </div>
                            })
                        }
                        <div className="member-rating-score" title="Sum of points for badges">
                            { badgePoints }
                            <i className='fas fa-medal' style={{ paddingRight: "5px"}}/> 
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({ dispatch })
export default connect(
    mapDispatchToProps
)( MemberSummary )
