import React from "react";

function Landing() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Hero Section */}
      <section className="bg-blue-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">
            Welcome to CareConnect Hospital
          </h2>
          <p className="text-lg mb-6 text-gray-600">
            Book your appointments with ease and receive world-class healthcare
            services.
          </p>
          <a
            href="/register"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Book Appointment
          </a>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-8 text-gray-800">
            About Our Hospital
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-2">Expert Doctors</h4>
              <p className="text-gray-600">
                Our team of highly skilled doctors provides top-notch medical
                care across specialties.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-2">
                Advanced Facilities
              </h4>
              <p className="text-gray-600">
                State-of-the-art equipment and technology to ensure accurate
                diagnoses and treatments.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-2">
                Patient-Centered Care
              </h4>
              <p className="text-gray-600">
                We prioritize your comfort and well-being with personalized
                healthcare services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 CareConnect Hospital. All rights reserved.</p>
          <p className="mt-2">
            Contact us: (123) 456-7890 | info@careconnecthospital.com
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
