import React from 'react'

function ConversationLegend(props)
{
    return(
        <div className="col-md-5">
            <ul className="list-group">
                <li className="list-group-item"> Session time (average minutes):
                    <span className="label label-success"> {props.avg.minutes}
                                    </span></li>
                <li className="list-group-item"> Answered questions (average number): {props.avg.questions} <span
                    className="label label-success"> </span></li>
                <li className="list-group-item"> Conversation sample: <span
                    className="label label-success"> {props.count}</span></li>
            </ul>
        </div>
    )
}

export default ConversationLegend