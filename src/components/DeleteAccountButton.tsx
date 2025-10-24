"use client";

import { Button } from '@/components/ui/button';
import { deleteMyAccountAction } from '@/server/actions/auth';
import { useDeleteAccount } from '@/hooks/useDeleteAccount';

export function DeleteAccountButton() {
  const { open, setOpen } = useDeleteAccount();

  return (
    <>
      <Button variant="outline" className="border-red-600 text-red-600" onClick={() => setOpen(true)}>
        Excluir minha conta
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative z-10 w-full max-w-sm rounded-md bg-white p-4 shadow-md">
            <h2 className="text-lg font-semibold">Confirmar exclusão</h2>
            <p className="mt-2 text-sm text-gray-600">
              Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.
            </p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <form action={deleteMyAccountAction}>
                <Button variant="outline" className="border-red-600 text-red-600">Excluir</Button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}


