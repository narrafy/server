import React, { Component } from 'react'
import {connect} from 'react-redux'
import Thread from './Thread'

class ThreadList extends Component {


    render(){

        const { threads } = this.props

        return(
            <div className="card">
                <div className={"card-header"}>
                    Conversations
                </div>
                <ul className={"list-group list-group-flush"}>
                    {
                        threads && threads.map((thread, index) => {
                            return(<Thread 
                                onClick={this.handleOnClick}
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

    const { threads } = state.thread

    return { threads }
}

export default connect(mapStateToProps)(ThreadList)