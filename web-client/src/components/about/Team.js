import React from 'react'
import ceoPicture from '../../assets/ceo.jpg'
import coFounderPicture from '../../assets/co-founder.jpg'
import botPicture from '../../assets/robot.png'

function Team()
{
    return(<section id="team" className="section-white">
        <div className="container">
            <h2 className="text-center"> Team </h2>
            <div className="row row-eq-height">
                <div className="col-md-2 col-md-offset-3 member-image">
                    <img src={ceoPicture} alt="icon" className="team img-responsive"/>
                </div>
                <div className="col-md-6  member-text">
                    <h4>Ion Dronic</h4>
                    <p><strong>CEO and Founder </strong> <br/> Engineer with 6+ years experience in software
                        development. Researcher
                        presenting <a href="https://arxiv.org/abs/1712.03080" title="path-to-ai">A path to AI</a> at
                        <a href="https://www.ieee.org/conferences_events/conferences/conferencedetails/index.html?Conf_ID=42793"
                           title="SAI"> IntelliSys Conference </a> London, September 2018.
                    </p>
                    <a href="https://www.linkedin.com/in/ion-dronic-94446337/" className="fa fa-linkedin"
                       target="_blank" title="Linkedin"></a>
                </div>
            </div>

            <div className="row row-eq-height">
                <div className="col-md-2 col-md-offset-3 member-image">
                    <img src={coFounderPicture} alt="icon" className="team img-responsive"/>
                </div>
                <div className="col-md-6  member-text">
                    <h4>Aliona Dronic</h4>
                    <p><strong>Co-Founder</strong> <br/> Couple counselor with a master's degree in psychology.
                    </p>
                    <a href="https://www.linkedin.com/in/aliona-dronic-0410bb120/" className="fa fa-linkedin"
                       target="_blank" title="Linkedin"></a>
                </div>
            </div>
            <div className="row row-eq-height">
                <div className="col-md-2 col-md-offset-2 member-image">
                    <img src={botPicture} alt="icon" className="team img-responsive"/>
                </div>
                <div className="col-md-8 member-text">
                    <h4>Narrafy Bot</h4>
                    <p><strong>Chief Customer Support </strong> <br/> A baby robot, awake when everybody else is
                        sleeping.</p>
                    <a href="https://m.me/narrafy" target="_blank" className="fa fa-facebook" title="Facebook"></a>
                </div>
            </div>
        </div>
    </section>)
}

export default Team;