import React from 'react';
import Slider from 'react-slick';
// Import Slick's default styles:
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Testimonial = () => {
  // Example testimonial data
  const testimonialData = [
    {
      name: 'Emily Davis',
      rating: 4,
      comment: 'Duis aute irure dolor in reprehenderit in voluptate velit.',
      image: 'https://via.placeholder.com/80'
    },
    {
      name: 'David Wilson',
      rating: 5,
      comment: 'Excepteur sint occaecat cupidatat non proident.',
      image: 'https://via.placeholder.com/80'
    },
    {
      name: 'John Doe',
      rating: 5,
      comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      image: 'https://via.placeholder.com/80'
    },
    {
      name: 'Jane Smith',
      rating: 4,
      comment: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      image: 'https://via.placeholder.com/80'
    },
    {
      name: 'Michael Johnson',
      rating: 5,
      comment: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
      image: 'https://via.placeholder.com/80'
    },
  ];

  // Custom "Next" arrow component
  const NextArrow = ({ onClick }) => {
    return (
      <div
        onClick={onClick}
        className="
          absolute
          top-1/2
          right-0
          transform 
          -translate-y-1/2 
          z-10
          flex 
          items-center 
          justify-center 
          w-8 h-8
          rounded-full
          bg-black 
          text-white 
          cursor-pointer
          hover:bg-gray-800
        "
      >
        {/* Simple right arrow in SVG */}
        <svg
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </div>
    );
  };

  // Custom "Previous" arrow component
  const PrevArrow = ({ onClick }) => {
    return (
      <div
        onClick={onClick}
        className="
          absolute
          top-1/2
          left-0
          transform 
          -translate-y-1/2 
          z-10
          flex 
          items-center 
          justify-center 
          w-8 h-8
          rounded-full
          bg-black
          text-white
          cursor-pointer
          hover:bg-gray-800
        "
      >
        {/* Simple left arrow in SVG */}
        <svg
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
      </div>
    );
  };

  // react-slick settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    // Attach our custom arrows
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 992, // e.g., tablets
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 576, // e.g., mobile
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  return (
    <section className="w-full  py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <h2 className="text-center mb-8 text-2xl font-semibold">
          Testimonials
        </h2>

        <Slider {...settings} className="testimonial-slider relative">
          {testimonialData.map((testimonial, index) => (
            /* px-3 so we get gap between slides (3 + 3 = 6px total gap) */
            <div key={index} className="px-3">
              {/* Card with fixed width and height */}
              <div 
                className="
                  w-[300px]
                  h-[300px]
                  mx-auto 
                  bg-primaryBlack 
                  rounded-lg 
                  shadow 
                  p-6 
                  flex 
                  flex-col 
                  items-center 
                  justify-center
                "
              >
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-20 h-20 rounded-full object-cover mb-4"
                />
                <h4 className="text-lg font-semibold text-yellow-500 mb-2">
                  {testimonial.name}
                </h4>
                <div className="mb-2 text-yellow-500">
                  {'⭐'.repeat(testimonial.rating)}
                </div>
                <p className="italic  text-white  text-sm text-center">
                  “{testimonial.comment}”
                </p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Testimonial;
