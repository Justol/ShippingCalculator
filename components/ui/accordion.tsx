'use client';

import { useState } from "react";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

export function Accordion({ title, children }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left py-2 font-semibold bg-gray-100 hover:bg-gray-200"
      >
        {title}
      </button>
      {isOpen && <div className="p-4 bg-white">{children}</div>}
    </div>
  );
}

export function AccordionItem({ children }: { children: React.ReactNode }) {
  return <div className="mb-2">{children}</div>;
}

export function AccordionTrigger({ children }: { children: React.ReactNode }) {
  return <div className="cursor-pointer">{children}</div>;
}

export function AccordionContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
