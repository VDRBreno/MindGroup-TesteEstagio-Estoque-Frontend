import { HTMLAttributes, InputHTMLAttributes } from 'react';

import styles from './styles.module.scss';

interface CustomInputProps {
  value: string | number;
  onChange: (value: string) => void;

  props?: InputHTMLAttributes<HTMLInputElement>;

  containerStyle?: HTMLAttributes<HTMLDivElement>['style'];
}

export default function Input({
  value,
  onChange,
  props,
  containerStyle
}: CustomInputProps) {
  return (
    <div id={styles.Container} style={containerStyle}>
      <input
        {...props}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}