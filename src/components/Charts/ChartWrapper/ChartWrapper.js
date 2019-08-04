import React from 'react';

export default class ChartWrapper extends React.Component {
	render() {
        const { children, title, width } = this.props;

        return (
            <div className='profile-section flex-column' style={ width ? { width: `${width}%` } : {} }>
                <h3 className='profile-section-title'>
                    { 
                        typeof title === 'object'
                            ? title.map(t => <p>{ t }</p> ) 
                            : title
                    }
                </h3>
                { children }
            </div>
        )
    }
}
