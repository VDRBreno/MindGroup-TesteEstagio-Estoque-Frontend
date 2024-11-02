import { useState, createContext, ReactNode } from 'react';

import Modal from '@/layouts/Modal';

interface ModalContextOpenModalProps {
  element: JSX.Element;
  onClose?: () => void;
}

interface ModalContextProps {
  openModal: ({ element, onClose }: ModalContextOpenModalProps) => void;
  closeModal: () => void;
}

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalContext = createContext({} as ModalContextProps);

export default function ModalProvider({
  children
}: ModalProviderProps) {
  
  const [content, setContent] = useState<JSX.Element | undefined>();
  const [onClose, setOnClose] = useState<{ f: () => void }>();

  function openModal({ element, onClose }: ModalContextOpenModalProps) {
    if(onClose!==undefined)
      setOnClose({ f: onClose });
    setContent(element);
    toggleBodyOverflow();
  }

  function closeModal() {
    if(onClose!==undefined)
      onClose.f();
    setContent(undefined);
    toggleBodyOverflow();
  }

  function toggleBodyOverflow() {
    document.body.classList.toggle('modal-overflow-hidden');
  }
  
  return (
    <ModalContext.Provider value={{
      openModal,
      closeModal
    }}>
      {content ? <Modal content={content} closeModal={closeModal} /> :null}
      {children}
    </ModalContext.Provider>
  );
}