import {useEffect, useState} from 'react';

export enum Renderer { CLIENT, SERVER}

/**
 * A hook that updates when the client is in control of rendering.
 */
const useRenderer = () => {
  const [renderer, setRenderer] = useState(Renderer.SERVER);
  useEffect(() => {
    setRenderer(Renderer.CLIENT);
  }, []);
  return {renderer};
};

export default useRenderer;
