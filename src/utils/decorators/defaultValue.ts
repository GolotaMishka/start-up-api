import { Transform, Expose } from 'class-transformer';

const defaultValue = (value: any) => {
  const expose = Expose();
  const transform = Transform((target: any) => target || (typeof value === 'function' ? value() : value));

  return (target: any, key: string) => {
    expose(target, key);
    transform(target, key);
  };
};

export default defaultValue;
