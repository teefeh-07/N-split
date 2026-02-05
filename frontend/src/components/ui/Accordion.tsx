// Accordion UI Component

'use client';

import { ReactNode, useState } from 'react';

interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

