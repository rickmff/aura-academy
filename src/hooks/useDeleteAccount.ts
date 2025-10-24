"use client";

import { useTransition, useCallback, useState } from 'react';

export function useDeleteAccount() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = useCallback((action: () => Promise<void>) => {
    setError(null);
    startTransition(async () => {
      try {
        await action();
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Erro ao excluir a conta';
        setError(message);
      }
    });
  }, []);

  return {
    open,
    setOpen,
    isPending,
    error,
    handleDelete,
  } as const;
}


