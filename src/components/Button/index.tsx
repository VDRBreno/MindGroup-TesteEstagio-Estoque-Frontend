import { ButtonHTMLAttributes } from 'react';

import styles from './styles.module.scss';

interface CustomButtonProps {
  onClick?: () => void;
}

type ButtonProps =
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CustomButtonProps>
  & CustomButtonProps;

export default function Button(props: ButtonProps) {
  return (
    <button
      {...props}
      id={styles.Container}
      className={`${props.disabled ?styles.ContainerDisabled :''}`}
    >
      {props.children}
    </button>
  );
}