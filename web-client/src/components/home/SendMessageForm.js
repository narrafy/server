import React, {Component} from 'react'

class SendMessageForm extends Component{

    constructor()
    {
        super()
        this.state = {
            message: ''
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(e){
        this.setState({
            message: e.target.value
        })
    }

    handleSubmit(e)
    {
        e.preventDefault();
        this.props.sendMessage(this.state.message)
        this.setState({
                message: ''
            }
        )
    }
    render(){
        return (
            <div className="chat-input">
                <form onSubmit={this.handleSubmit}
                      className="send-message-form">
                    <input className="textInput"
                           onChange={this.handleChange}
                           value = {this.state.message}
                           placeholder="Text me maybe"
                           type="text" />
                    <input id="enter" type="submit" value="enter" onSubmit={this.handleSubmit} />
                </form>
            </div>
        )
    }
}

export default SendMessageForm