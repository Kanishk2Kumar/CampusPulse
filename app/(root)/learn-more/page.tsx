"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const LearnMore: React.FC = () => {
  return (
    <div className="p-8 lg:pl-24 lg:pr-24 text-left">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-blue-500 mb-4">
          Welcome to Campus Pulse
        </h1>
        <p className="  text-xl max-w-4xl">
          Campus Pulse is a dynamic platform designed to streamline and enhance the college experience. It serves as a hub where students can engage with their peers, collaborate on projects, stay informed about campus events, and build meaningful networks. Whether you're seeking team members for a hackathon, searching for a study group, or exploring exciting college activities, Campus Pulse ensures you stay connected and informed.
        </p>
      </div>

      {/* Technologies Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-blue-500 mb-6">Technologies We Use</h2>
        <p className="  text-lg max-w-4xl">
          Campus Pulse is built using modern, scalable technologies to provide a seamless user experience.
        </p>
        <ul className="list-disc list-inside   text-lg max-w-4xl mt-4">
          <li>
            <strong>Frontend:</strong> Built with <strong>Next.js</strong> for its performance and server-side rendering capabilities, ensuring fast page loads and a responsive experience. Styled with <strong>Tailwind CSS</strong> to maintain a sleek and consistent design.
          </li>
          <li>
            <strong>Backend:</strong> Powered by <strong>Node.js</strong> with <strong>Express.js</strong> to manage API requests efficiently. We use <strong>PostgreSQL</strong> with <strong>Prisma ORM</strong> for structured, secure, and optimized data handling.
          </li>
          <li>
            <strong>Authentication & Security:</strong> Integrated with <strong>Clerk</strong> for authentication and user management, ensuring secure and seamless logins.
          </li>
          <li>
            <strong>Real-Time Updates:</strong> Implemented using <strong>Socket.io</strong> to enable live updates for event notifications, chat features, and group collaborations.
          </li>
          <li>
            <strong>Mobile Experience:</strong> A responsive PWA (Progressive Web App) for mobile users, offering an app-like experience without requiring a download.
          </li>
          <li>
            <strong>Cloud & Deployment:</strong> Hosted on <strong>Vercel</strong> for the frontend and <strong>Railway</strong> for the backend, ensuring fast and reliable service uptime.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LearnMore;
