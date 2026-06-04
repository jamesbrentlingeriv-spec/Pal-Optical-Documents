import React, { useEffect, useRef } from 'react';

interface FormWrapperProps {
  FormClass: any;
  initialState: any;
  onStateChange: (state: any) => void;
  resetTrigger?: number;
}

export const FormWrapper: React.FC<FormWrapperProps> = ({
  FormClass,
  initialState,
  onStateChange,
  resetTrigger = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<any>(null);
  const lastClassRef = useRef<any>(null);
  const resetTriggerRef = useRef<number>(resetTrigger);

  useEffect(() => {
    if (!containerRef.current) return;

    // Instantiate only if FormClass changes
    if (lastClassRef.current !== FormClass) {
      // Cleanup previous instance
      if (instanceRef.current && typeof instanceRef.current.destroy === 'function') {
        instanceRef.current.destroy();
      }

      containerRef.current.innerHTML = '';
      
      // Instantiate new form
      instanceRef.current = new FormClass(
        containerRef.current,
        { ...initialState },
        onStateChange
      );
      lastClassRef.current = FormClass;
      resetTriggerRef.current = resetTrigger;
    }
  }, [FormClass]);

  // Handle reset triggers
  useEffect(() => {
    if (resetTrigger !== resetTriggerRef.current) {
      resetTriggerRef.current = resetTrigger;
      if (instanceRef.current && typeof instanceRef.current.reset === 'function') {
        instanceRef.current.reset();
      }
    }
  }, [resetTrigger]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (instanceRef.current && typeof instanceRef.current.destroy === 'function') {
        instanceRef.current.destroy();
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
};
export default FormWrapper;
