import type React from 'react';

import styles from './modal-overlay.module.css';

type ModalOverlayProps = {
  onClick: () => void;
};

const ModalOverlay: React.FC<ModalOverlayProps> = ({ onClick }) => {
  return (
    <div className={styles.overlay} onClick={onClick} data-testid="modal-overlay" />
  );
};

export default ModalOverlay;
