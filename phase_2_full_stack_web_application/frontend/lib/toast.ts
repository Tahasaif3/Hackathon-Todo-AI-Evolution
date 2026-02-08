import { toast } from 'sonner';

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      style: {
        background: 'rgba(24, 24, 27, 0.8)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#f4f4f5',
      },
      className: 'glass'
    });
  },

  error: (message: string) => {
    toast.error(message, {
      style: {
        background: 'rgba(24, 24, 27, 0.8)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#f4f4f5',
      },
      className: 'glass'
    });
  },

  info: (message: string) => {
    toast(message, {
      style: {
        background: 'rgba(24, 24, 27, 0.8)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#f4f4f5',
      },
      className: 'glass'
    });
  },

  warning: (message: string) => {
    toast.warning(message, {
      style: {
        background: 'rgba(24, 24, 27, 0.8)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#f4f4f5',
      },
      className: 'glass'
    });
  }
};