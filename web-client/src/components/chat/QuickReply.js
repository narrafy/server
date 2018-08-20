import React from 'react'

export default class QuickReply extends React.Component
{
    constructor(){
        super()
        this.handleOnClick = this.handleOnClick.bind(this)
    }

    handleOnClick()
    {
        this.props.sendQuickReply(this.props.title)
    }

    render () {
        return (
            <button type="button" onClick={this.handleOnClick} className="btn btn-default btn-outline quick-reply">{this.props.title}</button>
        )
    }
}