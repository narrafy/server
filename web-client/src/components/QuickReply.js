import React from 'react'

function QuickReply (props) {
    return (
        <button className="btn btn-default btn-outline quick-reply"
                onClick={props.onClick}>{props.label}</button>
    )
}

export default QuickReply