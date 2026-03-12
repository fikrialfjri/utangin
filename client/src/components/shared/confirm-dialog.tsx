import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import Button from './button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi',
  message = 'Apakah kamu yakin?',
  confirmLabel = 'Ya, Hapus',
  cancelLabel = 'Batal',
  loading = false,
}: ConfirmDialogProps) => {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimating(true);
        });
      });
    } else {
      setAnimating(false);
      const timer = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!visible) return null;

  return createPortal(
    <div className="fixed inset-0 z-60 flex items-center justify-center px-6">
      <div
        className="absolute inset-0 bg-shades-black/40 transition-opacity duration-200"
        style={{ opacity: animating ? 1 : 0 }}
        onClick={onClose}
      />
      <div
        className="relative bg-shades-white rounded-3xl p-6 w-full max-w-sm shadow-lg transition-all duration-200"
        style={{
          opacity: animating ? 1 : 0,
          transform: animating ? 'scale(1)' : 'scale(0.95)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-col">
            <h3 className="typo-headline-md font-semibold! text-neutral-2 text-center">
              {title}
            </h3>
            <p className="typo-caption-md text-neutral-2 text-center mt-2">
              {message}
            </p>
          </div>
          <footer className="flex gap-3">
            <Button
              variant="secondary"
              size="sm"
              block
              onClick={onClose}
              disabled={loading}
            >
              {cancelLabel}
            </Button>
            <Button
              variant="danger"
              size="sm"
              block
              onClick={onConfirm}
              loading={loading}
            >
              {confirmLabel}
            </Button>
          </footer>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ConfirmDialog;
