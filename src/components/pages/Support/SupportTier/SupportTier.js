import React from 'react'
import _ from 'lodash';
import SupportPatron from '../SupportPatron';

class SupportTier extends React.Component{
    render() {
        const { props } = this;
        const tier = props.tier;
        const patrons = _.orderBy(tier.list, [patron => patron.name.toLowerCase()], ['asc']);
        
        return (
            <div className='support-tier flex-column'>
                <h2>
                    <i className={ tier.symbol } /> - { tier.description }
                </h2>
                <div className='support-patrons'>
                {
                    patrons.map((patron, index) => <SupportPatron key={ `patron-${index}` } patron={ patron } tier={ tier.tier }/>)
                }
                </div>
            </div>
        )
    }
}

export default SupportTier;