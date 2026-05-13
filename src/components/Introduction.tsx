import React from "react";

interface IntroductionProps {
  content: string;
}

export default function Introduction({ content }: IntroductionProps) {
  if (!content) return null;

  // Split by double newline to handle paragraphs
  const paragraphs = content.split("\n\n");

  return (
    <section className="py-24 px-6 max-w-4xl mx-auto">
      <div className="text-center space-y-12">
        <div className="flex flex-col items-center">
          <img 
            src="/images/logo-horizontal.png" 
            alt="NTUST Mountaineering Club Logo" 
            className="h-40 md:h-64 w-auto object-contain mb-8 opacity-90"
          />
        </div>
        
        <div className="space-y-8">
          {paragraphs.map((para, idx) => (
            <p 
              key={idx} 
              className="text-lg md:text-xl font-serif text-muted leading-relaxed whitespace-pre-wrap"
            >
              {para}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
