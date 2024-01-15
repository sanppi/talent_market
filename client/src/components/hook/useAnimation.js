import { useEffect, useState } from 'react';

function useAnimation(condition) {
  const [shouldRender, setShouldRender] = useState(condition);
  const [animationTrigger, setAnimationTrigger] = useState(false);

  useEffect(() => {
    if (condition) {
      setShouldRender(true);
      setAnimationTrigger(true);
    } else if (animationTrigger) {
      const timeoutId = setTimeout(() => {
        setShouldRender(false);
        setAnimationTrigger(false);
      }, 600);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [condition, animationTrigger]);

  const handleTransitionEnd = () => {
    if (!condition) {
      setShouldRender(false);
      setAnimationTrigger(false);
    }
  };

  return [shouldRender, handleTransitionEnd, animationTrigger];
}

export default useAnimation;
