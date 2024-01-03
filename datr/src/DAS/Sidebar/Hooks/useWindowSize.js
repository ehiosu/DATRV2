import { useState, useEffect } from 'react';

export default function useWindowSize() {
  const [width, setWidth] = useState(window.innerWidth);
  const [screenSize, setScreenSize] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (width < 576) {
      setScreenSize("small");
    } else if (width >= 576 && width < 768) {
      setScreenSize("medium");
    } else if (width >= 768 && width < 992) {
      setScreenSize("large");
    } else {
      setScreenSize("extra large");
    }
  }, [width]);

  return { screenSize };
}