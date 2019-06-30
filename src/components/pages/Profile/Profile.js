import React from 'react'
import { connect } from 'react-redux'

class Profile extends React.Component {
    render() {
        const { props } = this;
        const user = props.members.find(member => member.id === props.id);
        const patron = props.patrons.find(tier => tier.list.find(p => p.steamid === user.id) ? { tier: tier.tier, description: tier.description } : false)

        return (
            <div className='flex-column'>
                <div className='wrapper-description'>
                    <div className='page-description'>
                        <div className='flex-row'>
                            <h1>{ user.name }</h1>
                            {
                                patron
                                    ? <div className='profile-patron' title={ `This user is a tier ${patron.description.toUpperCase()} supporter` }><i className='fas fa-medal' /> { patron.description.toUpperCase() } </div>
                                    : ''
                            }
                        </div>
                        <div className="flex-row">
                            <img src={ user.avatar }
                                className={ `profile-avatar ${ patron ? `tier${patron.tier}` : ''}` }
                                alt="avatar" />
                            <div>Quisque lacinia nisl tristique ultrices dignissim. Curabitur ac neque tincidunt, dictum sapien quis, feugiat felis. Morbi iaculis massa vel nunc malesuada vulputate. Quisque quis sem nisl. Vestibulum finibus lorem in ante euismod suscipit. Nam justo diam, semper ac nibh auctor, tristique varius nisi. Praesent ultrices facilisis urna, vel varius mauris eleifend in. Vivamus ut venenatis quam. Suspendisse dolor augue, maximus eget lacus elementum, euismod accumsan neque. Aliquam erat volutpat. Donec nec lorem elementum, tempus elit in, faucibus dolor. Vivamus molestie tincidunt ipsum, pretium scelerisque augue imperdiet id. Etiam tempus placerat lorem quis posuere. </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({ 
    members: state.members,
    patrons: state.patrons,
    id: state.profileID
})

export default connect(
    mapStateToProps
)( Profile )