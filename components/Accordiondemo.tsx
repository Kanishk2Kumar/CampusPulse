import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  
  export function AccordionDemo() {
    return (
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-xl font-ibm-plex-sans">What is this platform about?</AccordionTrigger>
          <AccordionContent className="text-lg font-ibm-plex-sans">
          This platform is designed for college students to connect, collaborate, and engage in activities like hackathons, finding flatmates, and organizing or joining college events.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-xl font-ibm-plex-sans">Who can use this platform?</AccordionTrigger>
          <AccordionContent className="text-lg font-ibm-plex-sans">
          Any college student can sign up and explore the platform. Some features may require verification with a college email ID.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-xl font-ibm-plex-sans"> Is the platform free to use?</AccordionTrigger>
          <AccordionContent className="text-lg font-ibm-plex-sans">
          Yes, the core features of the platform are free. Some premium or additional services may be introduced in the future.
          </AccordionContent>
          
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger className="text-xl font-ibm-plex-sans">How can I create or join a group?</AccordionTrigger>
          <AccordionContent className="text-lg font-ibm-plex-sans">
          Navigate to the "Groups" section, search for an existing group, or click “Create Group” to start a new one. Invite friends or accept requests to build your team.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    )
  }
  