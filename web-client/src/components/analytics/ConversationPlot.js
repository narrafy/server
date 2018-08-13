import React from 'react';
import Plot from 'react-plotly.js'

class ConversationPlot extends React.Component {
    render() {
        return (
            <Plot
                data={[
                    {
                        x: this.props.x,
                        y: this.props.y,
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
                            title: 'Session time (minutes)',
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
