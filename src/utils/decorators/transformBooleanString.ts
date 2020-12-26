import { Transform } from 'class-transformer';

const transformBooleanString = () => {
  return Transform(target => (target.toString() as string).toLowerCase() === true.toString());
};

export default transformBooleanString;
