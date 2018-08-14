import React, {Component} from 'react'
import QuickReply from './QuickReply'

class QuickReplyMessage extends Component
{

    constructor(){
        super()
        this.state = {
            displayQuickReply: true
        }
        this.sendQuickReply = this.sendQuickReply.bind(this)
    }

    sendQuickReply(e)
    {
        this.props.sendMessage(e)
        this.setState({
            displayQuickReply: false
        })
    }

    render() {
        if(!this.state.displayQuickReply)
        {
            return (
                <div className="message-inner">
                    <div className="message-username">{this.props.username}</div>
                    <p> {this.props.text} </p>
                </div>
            )
        }

        return (
            <div className="message-inner">
                <div className="message-username">{this.props.username}</div>
                <p> {this.props.text} </p>
                {
                    this.props.quickReplies.map((reply, index)=>{
                        return(
                            <QuickReply key={index} sendQuickReply = {this.sendQuickReply} title = {reply.title} />
                        )
                    })
                }
            </div>
        )
    }
}

export default QuickReplyMessage