import { OpenNotificationParams } from '@pankod/refine-core';

export const responseNotification = (
  success: boolean,
  open: ((params: OpenNotificationParams) => void) | undefined,
  onClose: () => void
) => {
  if (success) {
    open?.(successNotification());
    onClose();
  } else {
    open?.(errorNotification());
  }
};

const successNotification = (): OpenNotificationParams => ({
  message: `Successfully configured integration`,
  type: 'success',
});

export const errorNotification = (): OpenNotificationParams => ({
  message: `Failed to configure integration`,
  type: 'error',
});
