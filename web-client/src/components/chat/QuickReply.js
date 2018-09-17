import React from 'react'
import PropTypes from 'prop-types'
import {postMessage, quickButtonClick} from "../../actions/conversation";
import {connect} from "react-redux";

class QuickReply extends React.Component
{
    constructor(){
        super()
        this.state = {
            show_quick_reply : true
        }
        this.handleOnClick = this.handleOnClick.bind(this)
    }

    handleOnClick()
    {
        const {dispatch, ctx, title} = this.props
        this.setState({
            show_quick_reply : false
        })
        dispatch(quickButtonClick(title))
        dispatch(postMessage("You", title, ctx))
    }

    render () {
        const { title } = this.props
        const { show_quick_reply } = this.state
        if(show_quick_reply){
            return (
                <button type="button" onClick={this.handleOnClick} className="btn btn-default btn-outline quick-reply">{title}</button>
            )
        } else {
            return(<span></span>)
        }
    }
}

QuickReply.propTypes = {
    handleOnClick: PropTypes.func.isRequired
}

const mapStateToProps = state => {

    const { context } = state.conversation
    return { ctx: context }
}

export default connect(mapStateToProps)(QuickReply)