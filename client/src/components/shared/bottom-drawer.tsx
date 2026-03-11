import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface BottomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

const BottomDrawer = ({
  isOpen,
  onClose,
  children,
  title,
}: BottomDrawerProps) => {
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
      const timer = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!visible) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-shades-black/40 transition-opacity duration-300"
        style={{ opacity: animating ? 1 : 0 }}
        onClick={onClose}
      />
      <div
        className="absolute bottom-0 left-0 right-0 bg-shades-white rounded-t-[24px] transition-transform duration-300 ease-out max-h-[85vh] overflow-y-auto"
        style={{
          transform: animating ? 'translateY(0)' : 'translateY(100%)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-1/5 h-1 rounded-full bg-neutral-4" />
        </div>
        {title && (
          <div className="px-5 py-3">
            <h3 className="typo-body-lg font-semibold! text-neutral-2">
              {title}
            </h3>
          </div>
        )}
        <div className="px-5 pb-6">{children}</div>
      </div>
    </div>,
    document.body,
  );
};

export default BottomDrawer;
