import React, { Component } from 'react'
import ReactGA from 'react-ga'
import ApiClient from "../../services/api/ApiClient"
import {ConversationLegend, ConversationPlot} from './components'
import {conversation} from '../../config/index'
import Auth from '../login/services/Auth';
const auth = new Auth();

export default class Index extends Component
{
    constructor()
    {
        super()
        ReactGA.pageview(window.location.pathname + window.location.search)
        this.state = {
            profile: null,
            count: "",
            avg: "",
            xQuestions: "",
            yMinutes:"",
        }
        this.handleLogout = this.handleLogout.bind(this)
        this.apiClient = new ApiClient()
    }

    componentWillMount(){
        if(!auth.loggedIn()){
            this.props.history.replace('/login')
        }
        else{
            try{
                const profile = auth.getProfile()
                this.setState({
                    profile: profile
                })
            }catch (e) {
                auth.logout()
                this.props.history.replace('/login')
            }
        }
    }

    handleLogout(){
        auth.logout()

        this.setState({
            profile: null
        })

        this.props.history.replace('/login');
    }

    componentDidMount() {
        const avgCb = res => {
            if(res.data.counter && res.data.minutes){
                this.setState({
                    avg: { questions: res.data.counter.toFixed(2), minutes: res.data.minutes.toFixed(2)}
                })
            }
        }
        const dataSetCb = res => {

            let x = []
            let y = []
            for(let item in res.data){
                x.push(res.data[item].minutes)
                y.push(res.data[item].counter)
            }
            this.setState({
                xMinutes: x,
                yQuestions: y,
                count: res.data.length
            })
        }
        this.apiClient.get(conversation.analytics.avgEndPoint, avgCb, auth.getToken())
        this.apiClient.get(conversation.analytics.dataSetEndPoint, dataSetCb, auth.getToken())
    }

    render() {
        if(this.state.profile){
            return (
                <section className="section analytics">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-4">
                                <ConversationLegend avg={this.state.avg} count={this.state.count} />
                            </div>
                            <div className="col-md-8">
                                <ConversationPlot x={this.state.xMinutes} y={this.state.yQuestions} />
                            </div>
                        </div>
                    </div>
                </section>
            )
        }
    }
}