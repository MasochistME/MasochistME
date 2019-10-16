import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'

class SectionSale extends React.Component {
    render() {
        const games = _.orderBy(this.props.games, ['sale.discount'], ['desc']);

        return (
        <div className='section'>
            <h3 className='section-title'>Games on sale</h3>
            <ul className='section-sale'>
                { 
                    games
                        .filter(game => game.sale.onSale)
                        .map((game, index) => (
                            <li key={ `sale-${index}` } className='sale-brick' style={{ backgroundImage: `url(${game.img})` }} >
                                <a className='sale-link' href={ `https://store.steampowered.com/app/${game.id}` } target='_blank' rel='noopener noreferrer' >
                                    <span className='link'>-{ game.sale.discount }%</span>
                                </a>
                            </li>
                            )
                        )
                }
            </ul>
        </div>)
    }
}


const mapStateToProps = state => ({ 
    games: state.games
})

export default connect(
  mapStateToProps
)( SectionSale )