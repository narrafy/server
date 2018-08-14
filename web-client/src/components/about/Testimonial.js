import React from 'react'
import Slider from 'react-slick'
import logo from '../../assets/logo.svg'

const Testimonial = () => {

    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
    };

    return (
        <section id="testimonials">

            <div className="container">
                <div className="quote"><img src={logo} alt="logo" /></div>
                <Slider {...settings}>
                    <div>
                        <blockquote>
                            <p className="text-center">"Narrafy develops and expands narrative approaches using
                                information technology. Augumented conversations follow from this!"</p>
                            <p className="user text-center"><strong>Ovidiu </strong> - counselor and therapist</p>
                        </blockquote>
                    </div>
                    <div>
                        <blockquote>
                            <p className="text-center">"Thank you very much Narrafy, you have been very helpful.
                                I really enjoyed the story of myself"</p>
                            <p className="user text-center"><strong>Rose </strong> - therapist</p>
                        </blockquote>
                    </div>
                    <div>
                        <blockquote>
                            <p className="text-center">"Nice job. It has future. Keep working on it.
                                </p>
                            <p className="user text-center"><strong>Rick </strong> - user</p>
                        </blockquote>
                    </div>
                </Slider>
            </div>
        </section>
    )
}

export default Testimonial