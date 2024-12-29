import React from "react";
import {
  HomeIcon,
  InformationCircleIcon,
  ChartBarSquareIcon,
  ClipboardIcon,
  ArrowPathIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  PhoneIcon,
      // Added for Register
} from "@heroicons/react/24/solid";

import img1 from '../images/1.png'
import img2 from '../images/i2.png'
import img3 from '../images/i3.png'
import img4 from '../images/i4.png'

const Header = () => {
  return (
    <header className="w-full bg-white dark:bg-gray-900 fixed z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
      {/* Top Section */}
      <div className="flex justify-between items-center bg-green-200 py-2 h-32">
        <img
          src={img1}
          alt="Logo 1"
          className="h-28 ml-20 mr-10"
        />
        <img
          src={img2}
          alt="Logo 1"
          className="h-28 ml-10 mr-10"
        />
        <div className="text-center flex-grow">
          <h1 className="text-5xl font-bold text-blue-800">JalDrishti Portal</h1>
          <p className="text-black text-xl">जल से सशक्त, समृद्धि की ओर</p>
        </div>
        <img
          src={img3}
          alt="Logo 2"
          className="h-28 ml-12 mr-8"
        />
        <img
          src={img4}
          alt="Logo 1"
          className="h-28 ml-10 mr-10"
        />
      </div>

      {/* Navigation Section */}
      <div className="bg-black text-white">
        <div className="flex justify-center items-center py-2 px-4">
          <nav className="flex space-x-8">
            <a href="/home" className="flex items-center hover:text-blue-400">
              <HomeIcon className="h-5 w-5 mr-1" />
              HOME
            </a>
            <a href="#" className="flex items-center hover:text-blue-400">
              <InformationCircleIcon className="h-5 w-5 mr-1" />
              ABOUT
            </a>
            <a href="#" className="flex items-center hover:text-blue-400">
              <ChartBarSquareIcon className="h-5 w-5 mr-1" />
              REPORTS
            </a>
            <a href="/" className="flex items-center hover:text-blue-400">
              <ClipboardIcon className="h-5 w-5 mr-1" />
              DASHBOARD
            </a>
            <a href="#" className="flex items-center hover:text-blue-400">
              <ArrowPathIcon className="h-5 w-5 mr-1" />
              DEMANDS
            </a>
            <a href="/feedback" className="flex items-center hover:text-blue-400">
              <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5 mr-1" />
              FEEDBACK
            </a>
            <a href="#" className="flex items-center hover:text-blue-400">
              <PhoneIcon className="h-5 w-5 mr-1" />
              CONTACT US
            </a>

            <div className="flex justify-end gap-4">
              <a href="#" className="flex items-center bg-blue-700 px-6 py-3 rounded-md hover:bg-blue-800">
                Login
              </a>
              <a href="#" className="flex items-center bg-blue-700 px-6 py-3 rounded-md hover:bg-blue-800">
                Register
              </a>
            </div>


          </nav>
        </div>

      </div>
    </header>
  );
};

export default Header;
