let handleSelectLocation = null;

export const setHandleSelectLocation = (fn) => {
  handleSelectLocation = fn;
};

export const getHandleSelectLocation = () => handleSelectLocation;
