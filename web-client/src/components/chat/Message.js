import React, {Component} from 'react'

class Message extends Component {

    render() {
        const { username, text} = this.props
        return(
            <div className="message-inner">
                <div className="message-username">{username}</div>
                <p> {text} </p>
            </div>
        )
    }
}

export default Message