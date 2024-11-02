import styles from './styles.module.scss';

interface LoadingProps {
  message?: string;
}

export default function Loading({
  message='Carregando..'
}: LoadingProps) {
  return (
    <div id={styles.Container}>
      <span className={styles.Message}>{message}</span>
    </div>
  );
}