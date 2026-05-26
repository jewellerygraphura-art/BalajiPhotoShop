import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // window scroll
    window.scrollTo(0, 0);

    // 👇 extra fix (for div scroll)
    const scrollContainer = document.querySelector("body");
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;