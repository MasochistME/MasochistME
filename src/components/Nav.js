import React from 'react'

const items = [
    { 
        text: "homepage",
        icon: "fas fa-home",
        link: "/"
    },
    {
        text: "members",
        icon: "fas fa-users",
        link: "/members"
    },
    {
        text: "game list",
        icon: "fas fa-gamepad",
        link: "/games"
    },
    {
        text: "event log",
        icon: "fas fa-history",
        link: "events"
    },
    {
        text: "curator",
        icon: "fab fa-steam",
        link: "curator"        
    }
]

export default class Nav extends React.Component{
    render() {
        return (
            <ul className='flex-row'>
                {
                    items.map((item, index) => 
                        <li 
                            key={ `nav-${index}` }
                            className='flex-column'>
                            <div className='flex-column'>
                                <i className={ item.icon } />
                                <p>{ item.text }</p>
                            </div>
                        </li>
                    )
                }
            </ul>
        )
    }
}