import * as SelectPrimitive from '@radix-ui/react-select';
import cn from 'classnames';
import type {ComponentPropsWithoutRef, ElementRef} from 'react';
import {forwardRef} from 'react';

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;
export const SelectGroup = SelectPrimitive.Group;
export const SelectLabel = SelectPrimitive.Label;
export const SelectTrigger = forwardRef<
  ElementRef<typeof SelectPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(function SelectTrigger({className, children, ...props}, ref) {
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex w-full items-center justify-between rounded-xl border border-border dark:border-border-dark bg-wash dark:bg-wash-dark px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-link/40 dark:focus-visible:ring-link-dark/40',
        className
      )}
      {...props}>
      {children}
    </SelectPrimitive.Trigger>
  );
});

export const SelectContent = forwardRef<
  ElementRef<typeof SelectPrimitive.Content>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(function SelectContent(
  {className, children, position = 'popper', ...props},
  ref
) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        position={position}
        className={cn(
          'z-50 min-w-[8rem] overflow-hidden rounded-xl border border-border dark:border-border-dark bg-white dark:bg-gray-800 text-sm shadow-xl',
          'data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:fade-out',
          className
        )}
        {...props}>
        <SelectPrimitive.Viewport className="p-1">
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
});

export const SelectItem = forwardRef<
  ElementRef<typeof SelectPrimitive.Item>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(function SelectItem({className, children, ...props}, ref) {
  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        'flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm text-primary dark:text-primary-dark outline-none data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary',
        className
      )}
      {...props}>
      <SelectPrimitive.ItemIndicator className="mr-2 h-3 w-3" />
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
});
