import React, { Component } from 'react'
import Thread from './Thread'

export default class ThreadList extends Component {

    render(){
        return(
            <div className="card">
                <div className={"card-header"}>
                    Conversations
                </div>
                <ul className={"list-group list-group-flush"}>
                    {
                        this.props.threads.map((thread, index) => {
                            const isActive = thread.conversation_id === this.props.activeThread
                            return(<Thread 
                                key = {index} 
                                isActive = {isActive} 
                                onThreadClick={this.props.onThreadClick}  
                                id={thread.conversation_id} 
                                date={thread.date_last_entry} 
                                minutes={thread.minutes}
                                seconds={thread.seconds}
                                counter={thread.counter}
                                />)
                        })
                    }
                </ul>
            </div>
        )
    }
}