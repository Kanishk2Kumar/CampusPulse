import React from "react";
import Link from "next/link";

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[90vh]">
      <div className="container mx-auto px-6 md:flex md:items-center md:justify-between mt-16">
        {/* Left Section */}
        <div className="md:w-1/2 pl-10">
          <h1 className="text-4xl font-bold leading-tight font-ibm-plex-sans">
            Campus Pulse <br />
            <span className="text-blue-600"> Connect. Collaborate. Celebrate.</span>
          </h1>
          <p className="mt-6 mr-20 text-gray-500 text-lg font-serif">
            Welcome to Campus Pulse, the one-stop platform 
            designed exclusively for college students like 
            you to connect, collaborate, and thrive. Whether 
            you're looking to join a hackathon team, find 
            the perfect flatmate, dive into exciting college 
            events, or simply build a network of like-minded 
            peers, Campus Pulse is here to make your college 
            experience unforgettable.
          </p>

          <button className="mt-10 px-6 py-3 text-blue-500 rounded-md transition-transform transform hover:scale-105 hover:bg-blue-500 hover:text-white">
            <Link href="/learn-more" className="transition-colors">
              Learn More
            </Link>
          </button>
        </div>

        <div className="mt-10 md:mt-0 md:w-1/2 relative pl-10">
          <img
            src="/images/home main.png"
            alt="Hero Image"
            className="hidden md:block animate-slide-in-right"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
