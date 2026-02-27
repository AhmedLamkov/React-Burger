import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import ReactDOM from 'react-dom';

import ModalOverlay from '../modal-overlay/modal-overlay';

import type React from 'react';
import type { FC } from 'react';

import styles from './modal.module.css';

type ModalProps = {
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal: FC<ModalProps> = ({ title, onClose, children }) => {
  const modalRoot = document.getElementById('react-modals')!;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return (): void => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return ReactDOM.createPortal(
    <>
      <ModalOverlay onClick={onClose} />
      <div
        className={styles.modal}
        onClick={(e): void => e.stopPropagation()}
        data-testid="modal"
      >
        <div className={styles.header}>
          {title && (
            <h2 className={`${styles.title} text text_type_main-large`}>{title}</h2>
          )}
          <div className={styles.closeButtonWrapper}>
            <button
              className={styles.closeButton}
              onClick={onClose}
              data-testid="modal-close-button"
              type="button"
            >
              <CloseIcon type="primary" />
            </button>
          </div>
        </div>
        <div className={styles.content} data-testid="modal-content">
          {children}
        </div>
      </div>
    </>,
    modalRoot
  );
};

export default Modal;
