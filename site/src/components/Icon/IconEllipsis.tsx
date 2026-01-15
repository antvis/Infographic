import type {SVGProps} from 'react';
import {memo} from 'react';

export const IconEllipsis = memo<SVGProps<SVGSVGElement>>(
  function IconEllipsis(props) {
    return (
      <svg width="1em" height="1em" viewBox="0 0 64 64" fill="none" {...props}>
        <circle cx="16" cy="32" r="6" fill="currentColor">
          <animate
            attributeName="opacity"
            values="0.3;1;0.3"
            dur="1.2s"
            begin="0s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="32" cy="32" r="6" fill="currentColor">
          <animate
            attributeName="opacity"
            values="0.3;1;0.3"
            dur="1.2s"
            begin="0.2s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="48" cy="32" r="6" fill="currentColor">
          <animate
            attributeName="opacity"
            values="0.3;1;0.3"
            dur="1.2s"
            begin="0.4s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    );
  }
);
