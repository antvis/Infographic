import * as DialogPrimitive from '@radix-ui/react-dialog';
import cn from 'classnames';
import type {ComponentPropsWithoutRef, ElementRef} from 'react';
import {forwardRef} from 'react';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;

export const DialogOverlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(function DialogOverlay({className, ...props}, ref) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        'fixed inset-0 z-50 bg-black/45 backdrop-blur-sm transition-opacity data-[state=open]:opacity-100 data-[state=closed]:opacity-0',
        className
      )}
      {...props}
    />
  );
});

export const DialogContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    containerClassName?: string;
  }
>(function DialogContent({className, containerClassName, ...props}, ref) {
  return (
    <DialogPortal>
      <div
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center p-6',
          containerClassName
        )}>
        <DialogOverlay />
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            'relative z-50 w-full max-w-xl rounded-2xl border border-border dark:border-border-dark bg-white dark:bg-gray-900 shadow-2xl',
            'transition-transform transition-opacity duration-200 data-[state=closed]:opacity-0 data-[state=open]:opacity-100',
            className
          )}
          {...props}
        />
      </div>
    </DialogPortal>
  );
});
