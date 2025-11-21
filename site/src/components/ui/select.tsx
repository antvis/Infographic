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
        'flex w-full items-center justify-between rounded-xl border border-border dark:border-border-dark bg-wash dark:bg-wash-dark px-4 py-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-link/40 dark:focus-visible:ring-link-dark/40',
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
        'relative cursor-pointer select-none items-center rounded-lg px-3 py-2 text-base text-primary dark:text-primary-dark outline-none data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary pl-7',
        className
      )}
      {...props}>
      <SelectPrimitive.ItemIndicator className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3">
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="text-link dark:text-link-dark">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-7.071 7.07a1 1 0 01-1.414 0L3.292 9.85a1 1 0 011.415-1.415l3.101 3.102 6.364-6.364a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </SelectPrimitive.ItemIndicator>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
});
