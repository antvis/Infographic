import cn from 'classnames';
import * as React from 'react';
import {IconNote} from '../Icon/IconNote';
import {IconPitfall} from '../Icon/IconPitfall';

interface ExpandableCalloutProps {
  children: React.ReactNode;
  type: 'note' | 'warning';
}

const variantMap = {
  note: {
    title: 'Note',
    Icon: IconNote,
    containerClasses:
      'bg-green-5 dark:bg-green-60 dark:bg-opacity-20 text-primary dark:text-primary-dark',
    textColor: 'text-green-60 dark:text-green-40',
    overlayGradient:
      'linear-gradient(rgba(245, 249, 248, 0), rgba(245, 249, 248, 1)',
  },
  warning: {
    title: 'Warning',
    Icon: IconPitfall,
    containerClasses: 'bg-yellow-5 dark:bg-yellow-60 dark:bg-opacity-20',
    textColor: 'text-yellow-50 dark:text-yellow-40',
    overlayGradient:
      'linear-gradient(rgba(249, 247, 243, 0), rgba(249, 247, 243, 1)',
  },
};

function ExpandableCallout({children, type = 'note'}: ExpandableCalloutProps) {
  const variant = variantMap[type] || variantMap['note'];

  return (
    <div
      className={cn(
        'expandable-callout',
        'pt-4 pb-2.5 px-3 sm:px-5 my-4 relative rounded-none shadow-inner-border -mx-4 sm:mx-auto sm:rounded-2xl',
        variant.containerClasses
      )}>
      <h3
        className={cn(
          'text-xl leading-7 font-display font-bold',
          variant.textColor
        )}>
        {variant.Icon && (
          <variant.Icon
            className={cn('inline me-2 mb-0.5 text-base', variant.textColor)}
          />
        )}
        {variant.title}
      </h3>
      <div className="relative">{children}</div>
    </div>
  );
}

export default ExpandableCallout;
