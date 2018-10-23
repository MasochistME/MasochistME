import React from 'react'
import MiniHeader from '../../MiniHeader'
import Page from '../../../../components/pages/Page'

export default class ContentWrapper extends React.Component{
    render() {
        const { props } = this;
        return (
            <div className={ `wrapper-content` }>
                <MiniHeader />
                <Page { ...props } />
            </div>
        )
    }
}