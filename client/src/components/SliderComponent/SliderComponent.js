import React from "react";
import Slider from "react-slick";

// Import Slick Carousel default styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const sliderItems = [
  {
    name: "Airpods",
    img: "airpod.png",
  },
  {
    name: "Smartwatches",
    img: "smartwatch.png",
  },
  {
    name: "Headphones",
    img: "headphones.png",
  },
  {
    name: "Combos",
    img: "combos.png",
  },
  {
    name: "Shoes",
    img: "shoes.png",
  },
  {
    name: "Covers & Straps",
    img: "cs.png",
  },
  {
    name: "Analog Watches",
    img: "analog.png",
  },
];

// Custom arrow components (optional)
const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      className="absolute right-0 z-10 flex items-center justify-center w-8 h-8 -mr-4 text-white bg-gray-800 rounded-full cursor-pointer top-1/2 transform -translate-y-1/2 hover:bg-gray-700"
      onClick={onClick}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
};

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      className="absolute left-0 z-10 flex items-center justify-center w-8 h-8 -ml-4 text-white bg-gray-800 rounded-full cursor-pointer top-1/2 transform -translate-y-1/2 hover:bg-gray-700"
      onClick={onClick}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </div>
  );
};

const SliderComponent = () => {
  // Slider settings for react-slick
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6, // show 6 items at once on large screens
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024, // screen < 1024px
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768, // screen < 768px
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 640, // screen < 640px
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480, // screen < 480px
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="bg-white">
      {/* Title */}
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-800">
          What Tech Are You Exploring Today?
        </h2>
      </div>

      {/* Slider Container */}
      <div className="relative px-8 md:px-16 lg:px-24 xl:px-32 pb-8">
        <Slider {...settings}>
          {sliderItems.map((item) => (
            <div key={item.name} className="px-2">
              <div className="flex flex-col items-center">
                {/* Circle background */}
                <div className="rounded-full w-32 h-32 overflow-hidden bg-blue-100">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Item name */}
                <p className="text-sm font-medium text-gray-700 text-center">
                  {item.name}
                </p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default SliderComponent;
