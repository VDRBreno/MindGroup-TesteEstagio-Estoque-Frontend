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

export default function SignUp() {

  const { removeFullAuthentication, authenticateUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if(isLoading) return;

    const serializedFields = {
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      passwordRepeat: passwordRepeat.trim()
    }

    if(serializedFields.name==='' || serializedFields.email==='' || serializedFields.password==='' || serializedFields.passwordRepeat==='') {
      toast.error('Preencha os campos corretamente!', toastStyle.error);
      return;
    }

    if(!new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g).test(serializedFields.email)) {
      toast.error('Digite um e-mail válido!', toastStyle.error);
      return;
    }

    if(serializedFields.password!==serializedFields.passwordRepeat) {
      toast.error('As senhas não coincidem', toastStyle.error);
      return;
    }

    try {

      setIsLoading(true);

      const { data } = await api.post('/user/create', {
        name: serializedFields.name,
        email: serializedFields.email,
        password: serializedFields.password
      });

      setIsLoading(false);

      if(data.userId && data.sessionId) {
        toast.success('Usuário cadastrado!', toastStyle.success);
        authenticateUser(data.userId, data.sessionId);
        navigate('/home');
      } else {
        throw new FormattedError({
          error: `Unable to signup, response from server: ${data}`,
          error_code: 'SIGNUP_FAILED',
          description: 'Não foi possível fazer o cadastro'
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

  function shouldShowPasswordNotEqualAlert() {
    if((password!=='' && passwordRepeat==='') ||
      (password==='' && passwordRepeat!=='')
    ) {
      return false;
    }

    return password!==passwordRepeat;
  }

  return (
    <div id={styles.Container}>
      <div className={styles.LogoContainer}>
        <img className={styles.Logo} src={mindEstoqueLogoDark} alt='logo-dark' />
      </div>
      <div style={{ height: '50px' }} />
      <form className={styles.FormContainer} onSubmit={handleSubmit}>
        <span className={styles.FormTitle}>Faça seu cadastro</span>
        <Input
          value={name}
          onChange={setName}
          placeholder='Nome'
          required
        />
        <Input
          value={email}
          onChange={value => setEmail(value.trim())}
          placeholder='E-mail'
          required
        />
        <Input
          type='password'
          value={password}
          onChange={value => setPassword(value.trim())}
          placeholder='Senha'
          required
        />
        <Input
          type='password'
          value={passwordRepeat}
          onChange={value => setPasswordRepeat(value.trim())}
          placeholder='Repita a senha'
          required
        />
        <div className={styles.PasswordNotEqualContainer}>
          {shouldShowPasswordNotEqualAlert() ?<span className={styles.PasswordNotEqual}>Senhas não coincidem</span> :null}
        </div>
        <Button disabled={isLoading} type='submit' style={{ width: '100%' }}>Criar conta</Button>
        <span>ou</span>
        <Link url='/'>Fazer login</Link>
      </form>
    </div>
  );
}