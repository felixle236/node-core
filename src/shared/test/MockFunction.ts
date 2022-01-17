export const mockFunction = (paramReturned?: any): any => {
  return () => {
    return paramReturned;
  };
};
