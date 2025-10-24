"use client";

import * as React from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cn } from '@/lib/utils';

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return <ToastPrimitives.Provider swipeDirection="right">{children}</ToastPrimitives.Provider>;
}

export function ToastViewport() {
  return (
    <ToastPrimitives.Viewport
      className={cn(
        'fixed bottom-0 right-0 z-50 m-4 flex w-96 max-w-screen flex-col gap-2'
      )}
    />
  );
}

export function Toast({
  title,
  description,
  open,
  onOpenChange,
}: {
  title?: string;
  description?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <ToastPrimitives.Root open={open} onOpenChange={onOpenChange} className={cn('rounded-md border bg-background p-3 shadow-md')}>
      {title ? <ToastPrimitives.Title className="text-sm font-medium">{title}</ToastPrimitives.Title> : null}
      {description ? <ToastPrimitives.Description className="text-sm text-foreground/70">{description}</ToastPrimitives.Description> : null}
    </ToastPrimitives.Root>
  );
}


