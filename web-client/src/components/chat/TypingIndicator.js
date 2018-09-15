import React, {Component} from 'react'
import {connect} from "react-redux";

class TypingIndicator extends Component{

    render(){
        const {isServerTyping} = this.props
        if(isServerTyping){
            return(
                <div className="typing-indicator-box">
                    <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            )
        }
        return null
    }
}

const mapStateToProps = state => {
    const { isServerTyping } = state.conversationReducer
    return { isServerTyping: isServerTyping }
}

export default connect(mapStateToProps)(TypingIndicator)