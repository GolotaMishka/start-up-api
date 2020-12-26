import { Request } from 'express';

type IRequirement = (request: Request) => void;

export default IRequirement;
