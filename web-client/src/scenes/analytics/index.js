import React, { Component } from 'react'
import {connect} from 'react-redux'
import ReactGA from 'react-ga'
import { ConversationPlot} from './components'
import {fetchConversationAvg, fetchConversationDataSet } from '../../actions/conversation'

class Index extends Component
{
    constructor()
    {
        super()
        ReactGA.pageview(window.location.pathname + window.location.search)
    }

    componentDidMount() {
        const { dispatch, token } = this.props
        dispatch(fetchConversationAvg(token))
        dispatch(fetchConversationDataSet(token))
    }

    render() {
            return (
                <section className="section analytics">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-8">
                                <ConversationPlot />
                            </div>
                        </div>
                    </div>
                </section>
            )
    }
}

const mapStateToProps = state => {
    const {token} = state.authenticationReducer
    return { token }
}

export default connect (mapStateToProps)(Index)