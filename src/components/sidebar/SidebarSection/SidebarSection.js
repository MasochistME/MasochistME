import React from 'react'
import SectionUpdate from '../Sections/SectionUpdate'
import SectionHistory from '../Sections/SectionHistory'
import SectionTop from '../Sections/SectionTop'
import SectionTrivia from '../Sections/SectionTrivia'

const returnProperSection = section => {
    switch(section) {
        case 'update': return <SectionUpdate />
        case 'trivia': return <SectionTrivia />
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