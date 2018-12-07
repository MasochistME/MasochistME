import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

class PageHome extends React.Component{
    render() {
        const { props } = this
        const blog = _.orderBy(props.blog, ['date'], ['desc'])
        
        return (
            <div>
                {
                    blog.map((entry, entryIndex) => 
                        <div className='blog-entry' key={ `entry-${entryIndex}` }>
                            <h1>
                                { entry.title}
                            </h1>
                            <h2>
                                ~{ entry.author }, { new Date(entry.date).toLocaleDateString() }
                            </h2>
                            <div dangerouslySetInnerHTML={{__html: entry.content}}></div>
                        </div>
                    )
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({ 
    blog: state.blog 
})

export default connect(
  mapStateToProps
)( PageHome )