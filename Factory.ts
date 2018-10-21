import { CarFactory } from './Car/';

export class Factory
{
	public createCarFactory(): CarFactory
	{
		return new CarFactory();
	}
}
