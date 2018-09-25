import React from 'react'

export default function Video (props) {

    return (
        <section id="video" className="section-white">
            <div className="container">
                <div className="embed-responsive embed-responsive-16by9">
                    <iframe className="embed-responsive-item" src = { props.src }
                            allowFullScreen></iframe>
                </div>
            </div>
        </section>
    )
}