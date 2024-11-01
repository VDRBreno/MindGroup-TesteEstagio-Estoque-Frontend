import { ReactNode } from 'react';

import { Link as LinkDOM } from 'react-router-dom';

import styles from './styles.module.scss';

interface LinkProps {
  url: string;
  children: ReactNode;
}

export default function Link({
  url,
  children
}: LinkProps) {
  return (
    <LinkDOM id={styles.Container} to={url}>
      {children}
    </LinkDOM>
  );
}