import React from 'react';

export default class ChartWrapper extends React.Component {
	render() {
        const { children, title, width } = this.props;

        return (
            <div className='wrapper-chart flex-column' style={ width ? { width: `${width}%` } : {} }>
                <h3 className='chart-title'>
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
