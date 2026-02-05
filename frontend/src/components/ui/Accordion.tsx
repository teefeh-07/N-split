// Accordion UI Component

'use client';

import { ReactNode, useState } from 'react';

interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
}

export function Accordion({ items, allowMultiple = false }: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenItems((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    } else {
      setOpenItems((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg divide-y">
      {items.map((item) => (
        <div key={item.id}>
          <button
            onClick={() => toggleItem(item.id)}
            className="w-full px-4 py-3 text-left font-medium flex justify-between items-center hover:bg-gray-50"
          >
            {item.title}
            <span>{openItems.includes(item.id) ? '−' : '+'}</span>
          </button>
          {openItems.includes(item.id) && (
            <div className="px-4 py-3 bg-gray-50">{item.content}</div>
          )}
        </div>
      ))}
    </div>
  );
}
