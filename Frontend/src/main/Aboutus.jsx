import React from 'react';

const AboutUs = () => {
  return (
    <section className="bg-gray-50 py-12"> {/* Changed bg-blue-50 to bg-gray-50 */}
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-800 mb-8">
          About <span className="text-blue-600  decoration-wavy">Us</span>
        </h2>
        <div className="bg-white shadow-lg rounded-lg p-8 md:p-12">
          <h3 className="text-2xl font-bold text-blue-800 mb-4">
            JalDrishti: Vision for Sustainable Water Management
          </h3>
          <p className="text-gray-700 mb-6">
            Welcome to JalDrishti, your comprehensive portal for insights and strategies in sustainable water resource
            management; it's the key to unlocking economic empowerment and sustainable livelihoods. Our name "JalDrishti"
            symbolizes our focus on foresight, innovation, and collaborative efforts to ensure sustainable water
            stewardship for generations to come.
          </p>
          <div>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">
              Vision: Informed Action Through Data and Innovation
            </h4>
            <p className="text-gray-600 mb-6">
              JalDrishti serves as a hub for data-driven decision-making and strategic planning in water resource
              management. By combining cutting-edge technologies with rich data sources, we empower stakeholders to make
              informed choices that balance current demands and future needs, fostering water security and
              sustainability.
            </p>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">Water Resources Assessment</h4>
            <p className="text-gray-600 mb-6">
              JalDrishti provides detailed analysis and evaluation of water storage capacities, identifying gaps in
              existing infrastructure and proposing solutions to enhance resilience against growing demands. Leveraging
              advanced predictive models, the portal offers insights into future water requirements by integrating
              climate projections, population trends, and land-use changes. Policymakers and planners can rely on
              JalDrishti to anticipate challenges and design adaptive strategies.
            </p>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">
              Transforming Challenges into Opportunities
            </h4>
            <p className="text-gray-600">
              JalDrishti isn’t just a portal—it’s a vision. With features like scenario analysis for extreme weather
              events and customized reports for policy guidance, JalDrishti transforms water resource challenges into
              opportunities for sustainable growth. At JalDrishti, we are shaping a future where water management aligns
              with ecological balance, economic development, and community well-being.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
