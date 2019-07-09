import React from 'react'
import SectionUpdate from '../Sections/SectionUpdate'
import SectionHistory from '../Sections/SectionHistory'
import SectionTop from '../Sections/SectionTop'
import SectionTrivia from '../Sections/SectionTrivia'
import SectionSale from '../Sections/SectionSale'

const returnProperSection = section => {
    switch(section) {
        case 'update': return <SectionUpdate />
        case 'trivia': return <SectionTrivia />
        case 'top': return <SectionTop />
        case 'history': return <SectionHistory />
        case 'sales': return <SectionSale />
        default: return null
    }
}

export default class SidebarSection extends React.Component{
    render() {
        const { props } = this;
        return returnProperSection(props.section)
    }
}