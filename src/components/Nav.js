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
    }
]

export default class Nav extends React.Component{
    render() {
        return (
            <ul>
                {
                    items.map((item, index) => 
                        <li key={ `nav-${index}` }>
                            { item.text }
                        </li>
                    )
                }
            </ul>
        )
    }
}