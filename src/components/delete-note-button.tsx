'use client';

import { Loader2, Trash } from 'lucide-react';
import { Button } from './ui/button';
import { useFormStatus } from 'react-dom';

export function TrashDelete() {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button variant={'destructive'} size='icon' disabled>
          <Loader2 className='h-4 w-4 animate-spin' />
        </Button>
      ) : (
        <Button variant={'destructive'} size='icon' type='submit'>
          <Trash className='h-4 w-4' />
        </Button>
      )}
    </>
  );
}
