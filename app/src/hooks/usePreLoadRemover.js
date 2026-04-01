import { useEffect, useState } from "react";
import removePreloader from "actions/UI/removePreloader";

const usePreLoadRemover = () => {
  const [isPreLoaderRemoved, setIsPreLoaderRemoved] = useState(false);

  useEffect(() => {
    removePreloader();
    setIsPreLoaderRemoved(true);
  }, []);

  return {
    isPreLoaderRemoved,
  };
};

export default usePreLoadRemover;
