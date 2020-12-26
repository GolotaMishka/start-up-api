const getAbsoluteIdFromString = (id: string) => {
  return (id || '').toString().trim().toLowerCase();
};

export default getAbsoluteIdFromString;
