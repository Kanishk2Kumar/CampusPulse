import { HoverEffect } from "./ui/card-hover-effect";

export function Features() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-5xl font-bold leading-tight font-ibm-plex-sans">
        Our{" "}
        <span className="border-b-4 border-dashed border-blue-500">
          Features
        </span>
      </h1>

      <div className="max-w-6xl mx-auto px-8 max-h-[80vh]">
        <HoverEffect items={projects} />
      </div>
    </div>
  );
}
export const projects = [
  {
    title: " Hackathons & Collaboration",
    description:
      "Find like-minded peers to brainstorm, innovate, and build something extraordinary.",
    link: "/teamates/hackathon-groups",
  },
  {
    title: "Find Flatmates & Housing Solutions",
    description:
      "Looking for a place to stay or someone to share your apartment? Use our flatmate matching system to find the perfect fit based on lifestyle preferences, budgets, and more.",
    link: "/teamates/find-flatmates",
  },
  {
    title: " Seamless Communication",
    description:
      "Engage in real-time discussions with your peers, share ideas, and collaborate on projects.",
    link: "/predictions",
  },
  {
    title: "Help & Earn Rewards",
    description:
      " Stuck on a problem? Ask for help from the Campus Pulse community and get solutions from fellow students.",
    link: "/self-diagnosis",
  },
  {
    title: "College Events & Activities",
    description:
      " Stay updated on all the latest college events, from workshops and seminars to cultural fests and networking meetups.",
    link: "/clubs/all-events",
  },
  {
    title: "  Lost & Found",
    description:
      "Misplaced your keys, laptop, or wallet? Report it on Campus Pulse and let the community help you find it.",
    link: "/lostFound/All-Campaigns",
  },
];
