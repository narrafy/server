import React from 'react'
import PropTypes from 'prop-types'
import {postQuickReplyMessage} from "../../actions";
import {connect} from "react-redux";

class QuickReply extends React.Component
{
    constructor(){
        super()
        this.handleOnClick = this.handleOnClick.bind(this)
    }


    handleOnClick(e)
    {
        const {dispatch, ctx} = this.props
        dispatch(postQuickReplyMessage("You", e, ctx))
    }

    render () {
        return (
            <button type="button" onClick={this.handleOnClick} className="btn btn-default btn-outline quick-reply">{this.props.title}</button>
        )
    }
}

QuickReply.propTypes = {
    handleOnClick: PropTypes.func.isRequired
}

const mapStateToProps = state => {
    return { ctx: state.context }
}

export default connect(mapStateToProps)(QuickReply)