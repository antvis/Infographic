import {useEffect} from 'react';

export interface SearchProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export function Search({isOpen, onClose}: SearchProps) {
  useEffect(() => {
    if (isOpen) {
      // Keep the component signature intact but immediately close until a new
      // search provider is wired up.
      onClose();
    }
  }, [isOpen, onClose]);

  return null;
}
