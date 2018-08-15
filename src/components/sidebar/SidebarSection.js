import React from 'react'
import SectionUpdate from './sections/SectionUpdate'
import { SectionTop, SectionHistory } from './Sections'

const returnProperSection = section => {
    switch(section) {
        case 'update': return <SectionUpdate />
        case 'top': return <SectionTop />
        case 'history': return <SectionHistory />
        default: return null
    }
}

export default class SidebarSection extends React.Component{
    render() {
        const { props } = this;
        return returnProperSection(props.section)
    }
}