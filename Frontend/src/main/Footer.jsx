import React from 'react';

const Footer = () => {
    return (
        <>
            <div className="bg-gray-900 text-gray-300 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-between space-x-8">
                        {/* First Section */}
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-white mb-4">
                                <span className="text-blue-500">JalDrishti</span>
                            </h3>
                            <p className="mb-4">
                               Empowering sustainable water management for a better future on JalDrishti Portal.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-300 hover:text-blue-500">
                                    <i className="fa-brands fa-facebook"></i>
                                </a>
                                <a href="#" className="text-gray-300 hover:text-blue-500">
                                    <i className="fa-brands fa-twitter"></i>
                                </a>
                                <a href="#" className="text-gray-300 hover:text-pink-500">
                                    <i className="fa-brands fa-instagram"></i>
                                </a>
                                <a href="#" className="text-gray-300 hover:text-blue-700">
                                    <i className="fa-brands fa-linkedin-in"></i>
                                </a>
                            </div>
                        </div>

                        {/* Second Section (Quick Links 1) */}
                        <div className="flex-1">
                            <h5 className="text-xl font-semibold text-white mb-4">Quick Links</h5>
                            <ul className="space-y-2">
                                <li>
                                    <a href="/" className="hover:text-blue-500">Home</a>
                                </li>
                                <li>
                                    <a href="/" className="hover:text-blue-500">About Us</a>
                                </li>
                                <li>
                                    <a href="/" className="hover:text-blue-500">Contact Us</a>
                                </li>
                            </ul>
                        </div>

                        {/* Third Section (Quick Links 2) */}
                        <div className="flex-1">
                            <h5 className="text-xl font-semibold text-white mb-4">Quick Links</h5>
                            <ul className="space-y-2">
                                <li>
                                    <a href="/" className="hover:text-blue-500">Water Harvesting Schemes</a>
                                </li>
                                <li>
                                    <a href="/" className="hover:text-blue-500">Reports</a>
                                </li>
                                <li>
                                    <a href="/" className="hover:text-blue-500">Dashboard</a>
                                </li>
                            </ul>
                        </div>

                        {/* Fourth Section (Contact Info) */}
                        <div className="flex-1">
                            <h5 className="text-xl font-semibold text-white mb-4">Contact Info</h5>
                            <ul className="space-y-2">
                                <p className="flex items-center mb-2"><i className="fa-solid fa-phone-volume mr-2 text-blue-500"></i> +1 234 567 890</p>
                                <p className="flex items-center mb-2"><i className="fa-solid fa-envelope mr-2 text-blue-500"></i> info@JalDrishti.gov</p>
                                <p className="flex items-center"><i className="fa-solid fa-paper-plane mr-2 text-blue-500"></i> India</p>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="bg-gray-800 text-gray-400 text-center py-4">
                <p> © 2024 JalDrishti Portal. All rights reserved. | Privacy Policy</p>
            </div>
        </>
    );
};

export default Footer;
