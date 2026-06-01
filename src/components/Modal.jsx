import React from 'react';
import { useModal } from '../context/ModalContext';

export default function Modal() {
  const { modalConfig, hideModal } = useModal();

  if (!modalConfig) return null;

  const { type, message, onConfirm, onCancel, confirmText = 'OK', cancelText = 'Cancel' } = modalConfig;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    hideModal();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    hideModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="retro-card responsive-modal-panel p-5 sm:p-8 animate-in zoom-in-95 duration-200">
        <div className="mb-6">
          <h3 className="text-xl font-black uppercase tracking-widest text-white mb-2">
            {type === 'confirm' ? 'Confirm Action' : 'Alert'}
          </h3>
          <p className="text-gray-300 leading-relaxed">
            {message}
          </p>
        </div>
        
        <div className="responsive-actions sm:justify-end mt-8">
          {type === 'confirm' && (
            <button
              onClick={handleCancel}
              className="responsive-control px-6 py-3 border border-[#1F1F1F] text-gray-400 hover:text-white hover:border-gray-500 font-bold uppercase tracking-wider transition-colors"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className="retro-btn"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
