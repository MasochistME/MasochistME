import React from 'react'
import { connect } from 'react-redux'
import { changeTab } from '../../../../shared/store/modules/Tabs'
import { showProfile } from '../../../../shared/store/modules/Profiles'

class MemberSummary extends React.Component {
    showProfile = id => {
        this.props.dispatch(showProfile(id));
        this.props.dispatch(changeTab('profile'));
    }

    render() {
        const { member, index, rating, patron } = this.props
        const disabled = member.points === 0 ? true : false
        const tier = patron 
            ? patron.tier
            : null

        return(
            <div className={disabled ? 'member-disabled member-summary flex-row' : 'member-summary flex-row' }>
                <div className="member-position">{ index+1 }</div>
                <img className={ `member-avatar ${tier ? `member-patron tier${tier}` : ''}`} src={ member.avatar } alt="avatar" title={ tier ? `This member is a tier ${ patron.description.toUpperCase() } supporter` : ''} />
                <div className="member-info flex-row">
                    {
                        disabled
                            ? <icon className="fas fa-exclamation-triangle" title="This member has their Steam profile set to private."></icon> 
                            : <div></div>
                    }
                    <div className="member-name" onClick={ () => this.showProfile( member.id ) }>{ member.name }</div>
                    <div className="member-ranking flex-row">
                        <div className="member-rating-score">
                            { member.points }
                            <span className="bold"> Σ</span>
                        </div>
                        {   
                            rating.map((score, scoreIndex) => {
                                return <div className="member-rating-score" key={`member-rating-score-${scoreIndex}`}>
                                    { member.ranking[score.id] !== undefined
                                        ? member.ranking[score.id]
                                        : "NaN" }
                                    <i className={ score.icon } style={{ paddingRight: "5px"}}/> 
                                </div>
                            })
                        }
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