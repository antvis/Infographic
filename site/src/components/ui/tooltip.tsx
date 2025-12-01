import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import cn from 'classnames';
import type {ComponentPropsWithoutRef, ElementRef} from 'react';
import {forwardRef} from 'react';

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export const TooltipContent = forwardRef<
  ElementRef<typeof TooltipPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(function TooltipContent({className, sideOffset = 6, ...props}, ref) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          'z-[2000] overflow-hidden rounded-lg bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 px-3 py-2 text-xs shadow-lg',
          'transition-all duration-150 data-[state=closed]:opacity-0 data-[state=open]:opacity-100',
          'max-w-[300px]',
          'data-[side=top]:translate-y-[-2px] data-[side=bottom]:translate-y-[2px]',
          className
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
});
