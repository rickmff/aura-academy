'use client';

import { useState } from 'react';

interface ToastState {
  open: boolean;
  title?: string;
  description?: string;
  type?: 'success' | 'error' | 'info';
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({ open: false });

  const showToast = (title: string, description?: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({
      open: true,
      title,
      description,
      type,
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, open: false }));
  };

  return {
    toast,
    showToast,
    hideToast,
  };
}
