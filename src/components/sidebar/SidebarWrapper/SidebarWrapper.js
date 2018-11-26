import React from 'react'
import sidebar from '../../../shared/config/sidebar'
import SidebarSection from '../SidebarSection'

export default class SidebarWrapper extends React.Component{
    render() {
        return (
            <div className='wrapper-sidebar'>
                {
                    sidebar.map((section, sectionIndex) => <SidebarSection section={ section } key={ `section-${sectionIndex}` }/>)
                }
            </div>
        )
    }
}