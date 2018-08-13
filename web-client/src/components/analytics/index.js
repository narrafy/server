import React, { Component } from 'react'
import ApiClient from "../../api/ApiClient"
import ConversationLegend from './ConversationLegend'
import ConversationPlot from './ConversationPlot'
import {analyticsConfig } from '../../config/index'
import Subscribe from '../partials/Subscribe'

class Analytics extends Component
{
    constructor()
    {
        super()
        this.state = {
            count: "",
            avg: "",
            xQuestions: "",
            yMinutes:"",

        }
        this.apiClient = new ApiClient()
    }

    componentDidMount()
    {
        const countCb = res => {
            this.setState({
                count: res.data.total_doc
            })
        }

        const avgCb = res => {
            this.setState({
                avg: { questions: res.data.counter, minutes: res.data.minutes }
            })
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
                yQuestions: y
            })
        }

        this.apiClient.get(analyticsConfig.conversation.countEndPoint, countCb)
        this.apiClient.get(analyticsConfig.conversation.avgEndPoint, avgCb)
        this.apiClient.get(analyticsConfig.conversation.dataSetEndPoint, dataSetCb)
    }

    render() {
        return (
            <div>
                <section className="section analytics">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <ConversationPlot x={this.state.xMinutes} y={this.state.yQuestions} />
                            </div>
                        </div>
                        <div className="row">
                            <ConversationLegend avg={this.state.avg} count={this.state.count} />
                        </div>
                    </div>
                </section>
            <Subscribe />
            </div>
        )
    }
}

export default Analytics