import React from 'react'
import Thread from './Thread'

export default function ThreadList(props){
    return(
        <div className="thread-list">
            <ul>
                <h3> Conversations: </h3>
                {
                    props.threads.map((thread, index) => {
                        return(<Thread key = {index} id={thread.conversation_id} date={thread.date} />)
                    })
                }
            </ul>
        </div>
    )
}