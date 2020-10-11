import { PropsWithChildren } from 'react';

type ExternalLinkProps = PropsWithChildren<
  Omit<JSX.IntrinsicElements['a'], 'target' | 'rel'>
>;

export function ExternalLink(props: ExternalLinkProps) {
  return <a target="_blank" rel="noreferrer noopener" {...props}></a>;
}
