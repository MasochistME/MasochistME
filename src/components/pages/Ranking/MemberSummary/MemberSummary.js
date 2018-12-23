import React from 'react'
import { connect } from 'react-redux'

class MemberSummary extends React.Component {
    render() {
        const { member, index, rating } = this.props
        const disabled = member.points === 0 ? true : false

        return(
            <div className={disabled ? 'member-disabled member-summary flex-row' : 'member-summary flex-row' }>
                <div className="member-position">{ index+1 }</div>
                <img className="member-avatar" src={ member.avatar } alt="avatar"/>
                <div className="member-info flex-row">
                    {
                        disabled
                            ? <icon className="fas fa-exclamation-triangle" title="This member has their Steam profile set to private."></icon> 
                            : <div></div>
                    }
                    <div className="member-name">{ member.name }</div>
                    <div className="member-ranking flex-row">
                        <div className="member-rating-score">
                            { member.points }
                            <span className="bold"> Σ</span>
                        </div>
                        {   
                            rating.map((score, scoreIndex) => {
                                return <div className="member-rating-score" key={`member-rating-score-${scoreIndex}`}>
                                    { member.ranking[score.score] !== undefined
                                        ? member.ranking[score.score]
                                        : "NaN" }
                                    <i className={ score.link } style={{ paddingRight: "5px"}}/> 
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