import style from './style.module.scss';

interface LoadingProps {
  message?: string;
}

export default function Loading({
  message='Carregando..'
}: LoadingProps) {
  return (
    <div id={style.Container}>
      {message}
    </div>
  );
}