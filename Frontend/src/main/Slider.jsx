import React from 'react'
import Marquee from 'react-fast-marquee'
import img1 from "../components/images/re1.jpg";
import img2 from "../components/images/re2.jpg";
import img3 from "../components/images/re3.jpg";
import img4 from "../components/images/re4.jpg";
import img5 from "../components/images/re5.webp";
import img6 from "../components/images/re6.jpeg";

const Slider = () => {
  return (
    <section className="flex h[600px]-screen justify-center items-center w-full bg-white">
      <div className="h-[200px] shadow-lg shadow-slate-400 rounded-2xl w-full my-8  bg-green-200">
        <Marquee gradient pauseOnHover="true" className="border-t rounded-2xl border-b py-8 overflow-hidden">
          <div className="flex pr-10 flex-col justify-center items-center mx-5">
            <img
              src={img1}
              className="w-40 h-32 object-cover"
              alt="Image 1"
            />
          </div>
          <div className="flex pr-10 flex-col justify-center items-center mx-5">
            <img
              src={img2}
              className="w-40 h-32 object-cover"
              alt="Image 2"
            />
          </div>
          <div className="flex pr-10 flex-col justify-center items-center mx-5">
            <img
              src={img3}
              className="w-40 h-32 object-cover"
              alt="Image 3"
            />
          </div>
          <div className="flex pr-10 flex-col justify-center items-center mx-5">
            <img
              src={img4}
              className="w-40 h-32 object-cover"
              alt="Image 4"
            />
          </div>
          <div className="flex pr-10 flex-col justify-center items-center mx-5">
            <img
              src={img5}
              className="w-40 h-32 object-cover"
              alt="Image 5"
            />
          </div>
          <div className="flex pr-10 flex-col justify-center items-center mx-5">
            <img
              src={img6}
              className="w-40 h-32 object-cover"
              alt="Image 6"
            />
          </div>
        </Marquee>
      </div>
    </section>
  )
}

export default Slider;
