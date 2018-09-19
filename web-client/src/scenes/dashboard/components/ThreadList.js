import React, { Component } from 'react'
import {connect} from 'react-redux'
import Thread from './Thread'

class ThreadList extends Component {

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

const mapStateToProps = state => {

    const { threads} = state.thread

    return { threads }
}

export default connect(mapStateToProps)(ThreadList)