import React from 'react'
import simulaLogo from '../../assets/img/simula.png'
import psiterraLogo from '../../assets/img/psiterra.png'
import innovationNorwayLogo from '../../assets/img/innovation-norway.jpg'

function Partner()
{
    return(
        <section id="partners" className="section-white">
            <div className="container">
                <h2 className="text-center"> Partners </h2>

                <div className="row row-eq-height">
                    <div className="col-md-4 col-md-offset-2 member-image">
                        <img src={simulaLogo} width="100px" height="100px" alt="icon"
                             className="team img-responsive" />
                    </div>
                    <div className="col-md-8 member-text">
                        <h4> The Simula Garage</h4>
                        <p><strong> The Simula Garage </strong> is an initiative from
                            <a href="https://www.simula.no/" rel="noopener noreferrer" title="Simula" target="_blank">Simula Research
                                Laboratory</a> that gives
                            ambitious entrepreneurs office space and ongoing technical support. <br/>
                        </p>

                        <a href="https://grundergarasjen.no/" target="_blank" rel="noopener noreferrer" className="fa fa-link" title="Web"></a>

                    </div>
                </div>

                <div className="row row-eq-height">
                    <div className="col-md-4 col-md-offset-2 member-image">
                        <img src={innovationNorwayLogo} width="250px" height="100px" alt="icon"
                             className="team img-responsive" />

                    </div>
                    <div className="col-md-8 member-text">
                        <h4>Innovation Norway</h4>
                        <p><strong> Government Fund </strong> <br/> It is the Norwegian Government’s most important
                            instrument for
                            innovation and development of Norwegian enterprises and industry.
                        </p>
                        <a href="http://www.innovasjonnorge.no/" target="_blank" rel="noopener noreferrer"
                           className="fa fa-link"
                           title="Linkedin"></a>
                    </div>
                </div>

                <div className="row row-eq-height">
                    <div className="col-md-4 member-image">
                        <img src={psiterraLogo} width="250px" height="150px" alt="icon" className="img-responsive" />

                    </div>
                    <div className="col-md-8 member-text">
                        <h4>Psiterra</h4>
                        <p><strong>Romanian Narrative Therapy Association</strong> <br/> Romanian narrative therapy
                            association, specialized in running counseling trainings
                            and offering psychological services.
                        </p>
                        <a href="http://www.psiterra.ro" target="_blank" rel="noopener noreferrer" className="fa fa-link" title="Linkedin"></a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Partner