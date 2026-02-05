// Dropdown UI Component

'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
}

