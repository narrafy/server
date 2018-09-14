import React, {Component} from 'react'
import { sendMessage, userTyping } from "../../actions"
import { connect } from "react-redux"

class SendMessageForm extends Component{

    constructor()
    {
        super()
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(e){
        this.props.dispatch(userTyping(e.target.value))
    }

    handleSubmit(e) {
        const {dispatch, msg, ctx}  = this.props
        e.preventDefault();
        dispatch(sendMessage("You", msg, ctx))
    }

    render(){
        return (
            <div className="chat-input">
                <form onSubmit={this.handleSubmit}
                      className="send-message-form">
                    <input className="textInput"
                           onChange={this.handleChange}
                           value = {this.props.msg}
                           placeholder="Text me maybe"
                           type="text" required />
                    <input id="submit-button" type="submit" value="enter" onSubmit={this.handleSubmit} />
                </form>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return { msg: state.current_message, ctx: state.context }
}

export default connect(mapStateToProps)(SendMessageForm)
