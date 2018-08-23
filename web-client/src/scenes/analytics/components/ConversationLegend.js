import React from 'react'

export default function ConversationLegend(props)
{
    return(
        <div className={"card"}>
            <div className={"card-header"}>
                Conversation averages
            </div>
            <ul className="list-group list-group-flush">
                <li className="list-group-item"> Session time:
                    <span className="label label-success"> {props.avg.minutes} </span>
                </li>
                <li className="list-group-item"> Answered questions: <span
                    className="label label-success"> {props.avg.questions} </span>
                </li>
                <li className="list-group-item"> Conversation sample: <span
                    className="label label-success"> {props.count}</span>
                </li>
            </ul>
        </div>
    )
}