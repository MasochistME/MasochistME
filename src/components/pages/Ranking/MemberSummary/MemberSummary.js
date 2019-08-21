import React from 'react'
import { connect } from 'react-redux'
import { changeTab } from '../../../../shared/store/modules/Tabs'
import { showProfile } from '../../../../shared/store/modules/Profiles'

class MemberSummary extends React.Component {
    showProfile = id => {
        this.props.dispatch(showProfile(id));
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

    render() {
        const { member, index, rating, patron, badges } = this.props
        const disabled = member.points === 0 ? true : false
        const tier = patron 
            ? patron.tier
            : null
        const shekelmaster = tier == 4

        return(
            <div className={`member-summary flex-row ${disabled ? 'member-disabled' : ''} ${shekelmaster ? 'member-shekelmaster' : '' }` }>
                <div className="member-position">{ index+1 }</div>
                <img className="member-avatar" src={ member.avatar } alt="avatar" />
                {
                    tier 
                        ? <i className={ `fas fa-donate member-patron tier${tier}` } title={ patron.description.toUpperCase() } />
                        : <i className='fas fa-donate member-patron' style={{ color: 'transparent' }}/>
                }
                <div className="member-info flex-row">
                    {
                        disabled
                            ? <icon className="fas fa-exclamation-triangle" title="This member has their Steam profile set to private."></icon> 
                            : <div></div>
                    }
                    <div className={ `member-name ${ shekelmaster ? `tier${tier}` : ''}` } onClick={ () => this.showProfile( member.id ) }>{ member.name }</div>
                    <div className="member-ranking flex-row">
                        <div className="member-rating-score" title="Sum of all points">
                            { member.points ? member.points + this.summarizeBadgePoints(member, badges) : 0 }
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
                            { this.summarizeBadgePoints(member, badges) }
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