"use client";

import { useEffect, useState } from 'react';
import { Toast, ToastProvider, ToastViewport } from '@/components/ui/toast';

export default function FlashToastClient({ title, description }: { title?: string; description?: string }) {
  const [open, setOpen] = useState(Boolean(title || description));

  useEffect(() => {
    if (title || description) {
      setOpen(true);
      try {
        document.cookie = 'flash=; path=/; max-age=0';
      } catch { }
    }
  }, [title, description]);

  if (!title && !description) return null;

  return (
    <ToastProvider>
      <Toast title={title} description={description} open={open} onOpenChange={setOpen} />
      <ToastViewport />
    </ToastProvider>
  );
}


