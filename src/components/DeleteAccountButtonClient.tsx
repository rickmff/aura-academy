"use client";

import { Button } from '@/components/ui/button';
import { deleteMyAccountAction } from '@/server/actions/auth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type Props = {
  buttonLabel: string;
  title: string;
  description: string;
  cancelLabel: string;
  deleteLabel: string;
};

export function DeleteAccountButtonClient({ buttonLabel, title, description, cancelLabel, deleteLabel }: Props) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="border-red-600 text-red-600">
          {buttonLabel}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>
          {description}
        </AlertDialogDescription>
        <AlertDialogFooter className="mt-4 flex items-center justify-end gap-2">
          <AlertDialogCancel asChild>
            <Button variant="outline">{cancelLabel}</Button>
          </AlertDialogCancel>
          <form action={deleteMyAccountAction}>
            <AlertDialogAction asChild>
              <Button variant="outline" className="border-red-600 text-red-600">{deleteLabel}</Button>
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


