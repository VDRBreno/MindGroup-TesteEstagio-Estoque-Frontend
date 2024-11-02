import { FiX } from 'react-icons/fi';

import Button from '@/components/Button';

import styles from './styles.module.scss';

interface ModalProps {
  content: JSX.Element;
  closeModal: () => void;
}

export default function Modal({
  content,
  closeModal
}: ModalProps) {
  return (
    <div id={styles.Container}>
      <div className={styles.ModalContent}>
        <div className={styles.Header}>
          <Button onClick={closeModal} style={{ backgroundColor: '#D35757' }}>
            <FiX size={20} color='#FFFFFF' />
          </Button>
        </div>
        <div className={styles.Content}>
          {content}
        </div>
      </div>
    </div>
  );
}