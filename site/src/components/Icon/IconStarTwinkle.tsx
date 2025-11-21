import {memo} from 'react';

export const IconStarTwinkle = memo<JSX.IntrinsicElements['svg']>(
  function IconStarTwinkle({className}) {
    return (
      <svg
        className={className}
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="0.6"
              result="blur"
            />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <style>
          {`
          @keyframes stable-twinkle {
            0%   { opacity: 1; filter: brightness(1); }
            10%  { opacity: 0.85; filter: brightness(1.4); }
            14%  { opacity: 1; filter: brightness(1); }
            55%  { opacity: 0.9; filter: brightness(1.25); }
            100% { opacity: 1; filter: brightness(1); }
          }
        `}
        </style>
        <g fill="none" fillRule="evenodd">
          <g style={{animation: 'stable-twinkle 5s infinite'}}>
            <path
              d="M5.24 6.322a.147.147 0 0 1 .099.1l.13.438c.17.57.615 1.015 1.185 1.185l.439.13a.147.147 0 0 1 0 .282l-.44.13c-.569.17-1.014.615-1.184 1.185l-.13.439a.147.147 0 0 1-.282 0l-.13-.44a1.758 1.758 0 0 0-1.185-1.184l-.439-.13a.147.147 0 0 1 0-.282l.44-.13A1.758 1.758 0 0 0 4.926 6.86l.13-.439a.147.147 0 0 1 .183-.099Z"
              fill="#E746A4"
              fillRule="nonzero"
            />
          </g>
          <g style={{animation: 'stable-twinkle 6s infinite'}}>
            <path
              d="M9.35 12.071c.623-2.862 1.078-4.293 1.365-4.293.432 0 1.17 2.682 1.366 4.293 3.167.797 4.75 1.366 4.75 1.707 0 .672-4.581.91-4.75 1.515-.323 1.163-.641 4.485-1.366 4.485-.724 0-1.365-3.524-1.365-4.485 0-.367-4.743-.66-4.743-1.515 0-.316 1.58-.885 4.743-1.707Z"
              fill="#9A6EED"
            />
          </g>
          <g style={{animation: 'stable-twinkle 4s infinite'}}>
            <path
              d="M17.888 6.716c.354-1.625.613-2.438.776-2.438.245 0 .664 1.523.776 2.438 1.798.453 2.697.776 2.697.97 0 .38-2.602.516-2.697.86-.184.66-.365 2.547-.776 2.547-.411 0-.776-2.001-.776-2.547 0-.209-2.693-.375-2.693-.86 0-.18.898-.503 2.693-.97Z"
              fill="#F3C52F"
            />
          </g>
        </g>
      </svg>
    );
  }
);
