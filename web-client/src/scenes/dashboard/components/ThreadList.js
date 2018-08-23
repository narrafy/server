import React, { Component } from 'react'
import Thread from './Thread'

export default class ThreadList extends Component {

    constructor(){
        super()
        this.onThreadClick = this.onThreadClick.bind(this)
    }
    
    onThreadClick(e){
        this.props.onThreadClick(e)
    }

    render(){
        return(
            <div className="card">
                <div className={"card-header"}>
                    Conversations
                </div>
                <ul className={"list-group list-group-flush"}>
                    {
                        this.props.threads.map((thread, index) => {
                            return(<Thread 
                                key = {index} 
                                onThreadClick={this.onThreadClick}  
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