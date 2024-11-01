import { HTMLAttributes, InputHTMLAttributes } from 'react';

import styles from './styles.module.scss';

interface CustomInputProps {
  value: string;
  onChange: (value: string) => void;

  containerStyle?: HTMLAttributes<HTMLDivElement>['style'];
}

type InputProps =
  Omit<InputHTMLAttributes<HTMLInputElement>, keyof CustomInputProps>
  & CustomInputProps;

export default function Input(props: InputProps) {
  return (
    <div id={styles.Container} style={props.containerStyle}>
      <input
        {...props}
        onChange={e => props.onChange(e.target.value)}
      />
    </div>
  );
}