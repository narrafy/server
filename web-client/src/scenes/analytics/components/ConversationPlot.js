import React from 'react';
import Plot from '../../../../node_modules/react-plotly.js/react-plotly'
import { connect } from 'react-redux';

class ConversationPlot extends React.Component {

    render() {
        const { x, y} = this.props
        return (

            <Plot
                data={[
                    {
                        x: x,
                        y: y,
                        type: 'bar',
                        marker: {color: 'blue'},
                    }
                ]}
                layout={
                    {
                        title: 'Narrafy Analytics',
                        //barmode: 'stack',
                        yaxis: {
                            title: 'Questions answered',
                            range: [ 0, 60 ],
                        titlefont: {
                            size: 16,
                            color: 'rgb(107, 107, 107)'
                        },
                        tickfont: {
                            size: 14,
                            color: 'rgb(107, 107, 107)'
                            }
                        },
                        xaxis: {
                            title: 'Session time (minutes)' ,
                            range: [ 1, 60 ],
                            titlefont: {
                            size: 16,
                            color: 'rgb(107, 107, 107)'
                        },
                        tickfont: {
                            size: 14,
                            color: 'rgb(107, 107, 107)'
                            }
                        },
                    }
                }
            />
        );
    }
}

export default ConversationPlot
