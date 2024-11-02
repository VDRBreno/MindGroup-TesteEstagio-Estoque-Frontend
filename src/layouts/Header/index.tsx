import { FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import mindEstoqueLogoDark from '@/assets/svg/mindestoque-logo-dark.svg';
import useAuth from '@/hooks/useAuth';
import Button from '@/components/Button';

import styles from './styles.module.scss';

export default function Header() {
  
  const { removeFullAuthentication } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    removeFullAuthentication();
    navigate('/');
  }

  return (
    <div id={styles.Container}>
      <div className={styles.LogoContainer}>
        <img className={styles.Logo} src={mindEstoqueLogoDark} alt='logo-dark' />
      </div>
      <Button style={{ backgroundColor: '#D35757' }} onClick={handleLogout}>
        <span>Sair</span>
        <FiLogOut size={18} color='#FDFDFD' />
      </Button>
    </div>
  );
}