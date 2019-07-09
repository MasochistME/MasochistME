import React from 'react';

export default class ChartWrapper extends React.Component {
	render() {
        return (
            <div className='wrapper-chart flex-column'>
                <h3 className='chart-title'>
                    { this.props.title }
                </h3>
                { this.props.children }
            </div>
        )
    }
}
