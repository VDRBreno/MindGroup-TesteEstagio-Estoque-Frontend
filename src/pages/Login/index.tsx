import { useState } from 'react';

import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import api from '@/services/api';
import getAxiosErrorResponse from '@/utils/getAxiosErrorResponse';
import { toastStyle } from '@/styles/toastify';
import useAuth from '@/hooks/useAuth';
import { FormattedError } from '@/utils/HandleError';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Link from '@/components/Link';
import mindEstoqueLogoDark from '@/assets/svg/mindestoque-logo-dark.svg';

import styles from './styles.module.scss';

export default function Login() {

  const { removeFullAuthentication, authenticateUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if(isLoading) return;

    try {

      setIsLoading(true);

      const { data } = await api.post('/user/auth', {
        email,
        password
      });

      setIsLoading(false);

      if(data.userId && data.sessionId) {
        authenticateUser(data.userId, data.sessionId);
        navigate('/home');
      } else {
        throw new FormattedError({
          error: `Unable to login, response from server: ${data}`,
          error_code: 'LOGIN_FAILED',
          description: 'Não foi possível fazer o login'
        });
      }

    } catch(error) {
      console.error(error);

      const axiosError = getAxiosErrorResponse(error);
      if(axiosError) {
        toast.error(`Erro no servidor: ${axiosError.error_description}`, toastStyle.error);
      } else if(error instanceof FormattedError) {
        toast.error(`Erro: ${error.description}`, toastStyle.error);
      } else {
        toast.error('Não foi possível fazer o cadastro', toastStyle.error);
      }

      removeFullAuthentication();
      setIsLoading(false);
    }
  }

  return (
    <div id={styles.Container}>
      <div className={styles.LogoContainer}>
        <img className={styles.Logo} src={mindEstoqueLogoDark} alt='logo-dark' />
      </div>
      <div style={{ height: '50px' }} />
      <form className={styles.FormContainer} onSubmit={handleSubmit}>
        <span className={styles.FormTitle}>Faça seu login</span>
        <Input
          value={email}
          onChange={setEmail}
          placeholder='E-mail'
        />
        <Input
          type='password'
          value={password}
          onChange={setPassword}
          placeholder='Senha'
        />
        <Button disabled={isLoading} type='submit' style={{ width: '100%' }}>Entrar</Button>
        <span>ou</span>
        <Link url='/sign-up'>Crie uma conta</Link>
      </form>
    </div>
  );
}