import cn from 'classnames';
import {AnimatePresence, motion} from 'framer-motion';
import {useCallback, useEffect, useRef, useState} from 'react';

export function useCopyToast(timeout = 1500) {
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setMessage(null);
  }, []);

  const show = useCallback(
    (msg: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setMessage(msg);
      timerRef.current = setTimeout(() => setMessage(null), timeout);
    },
    [timeout]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {message, show, clear};
}

export function CopyToast({
  message,
  className,
}: {
  message: string | null;
  className?: string;
}) {
  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          initial={{opacity: 0, y: 12}}
          animate={{opacity: 1, y: 0}}
          exit={{opacity: 0, y: 12}}
          transition={{duration: 0.25}}
          className={cn(
            'fixed bottom-8 right-8 z-[2000] rounded-full bg-link dark:bg-link-dark text-white px-5 py-2.5 shadow-lg font-medium text-sm',
            className
          )}>
          ✓ {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
