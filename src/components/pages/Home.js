import React from 'react'
import blog from '../../mock/blog' //THIS IS FOR DEV PURPOSES - GONNA BE CHANGED TO JSON DOWNLOADED FRMO THE SERVER

export default class PageHome extends React.Component{
    render() {
        console.log(blog)
        return (
            <div>
                {
                    blog.map(entry => 
                        <div className='blog-entry'>
                            <h1>
                                { entry.title}
                            </h1>
                            <h2>
                                ~{ entry.author }, { new Date(entry.date).toLocaleDateString() }
                            </h2>
                            <p>{ entry.content }</p>
                        </div>
                    )
                }
            </div>
        )
    }
}