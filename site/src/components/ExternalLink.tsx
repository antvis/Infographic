import type {AnchorHTMLAttributes, DetailedHTMLProps} from 'react';

export function ExternalLink({
  href,
  target,
  children,
  ...props
}: DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>) {
  return (
    <a href={href} target={target ?? '_blank'} rel="noopener" {...props}>
      {children}
    </a>
  );
}
