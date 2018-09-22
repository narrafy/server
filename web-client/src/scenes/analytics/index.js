import React, { Component } from 'react'
import {connect} from 'react-redux'
import ReactGA from 'react-ga'
import ConversationPlot from './components/ConversationPlot'
import {fetchConversationAvg, fetchConversationDataSet } from '../../actions/conversation'
import {getToken} from '../../utils'

class Index extends Component
{
    constructor()
    {
        super()
        ReactGA.pageview(window.location.pathname + window.location.search)
    }

    componentDidMount() {
        const { dispatch } = this.props
        const token = getToken()
        dispatch(fetchConversationAvg(token))
        dispatch(fetchConversationDataSet(token))
    }

    render() {
            const {count, avg_minutes, avg_questions, xMinutes, yQuestions}  = this.props
            return (
                <section className="section analytics">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-8">
                                <span class="badge badge-light"> Average answered questions: { avg_questions} </span><br />
                                <span class="badge badge-light"> Average time spent (minutes): { avg_minutes} </span><br />
                                <span class="badge badge-primary"> Conversation sample: {count} </span><br />
                                <ConversationPlot x = {xMinutes} y = {yQuestions} />
                            </div>
                        </div>
                    </div>
                </section>
            )
    }
}

const mapStateToProps = state => {
    const {count, avg_minutes, avg_questions, xMinutes, yQuestions} = state.conversation
    return { avg_minutes, avg_questions, count, xMinutes, yQuestions }
}

export default connect (mapStateToProps)(Index)