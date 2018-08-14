import React from 'react'

function Banner()
{
    return(
        <section className="section slider bg-pr">
            <div className="container">
                <div className="row">
                    <div className="col-lg-10 m-auto">
                        <div className="block">
                            <h1>About Us</h1>
                            <h3> We are building machine learning tools to streamline repetitive processes in the
                                 therapy rooms around the world.
                                <br/>
                            </h3>
                            <div className="download">
                                <a href="https://arxiv.org/abs/1712.03080" target="_blank" className="btn btn-default">
                                    Read more
                                </a>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Banner