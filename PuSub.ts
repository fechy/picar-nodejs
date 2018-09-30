/*tslint:disable no-any*/
/*tslint:disable no-magic-numbers*/
/*tslint:disable no-bitwise*/
export interface Subscription
{
	event: string;
	subscriber: PubSub;
	callback (...args: any[]): any;
}

export abstract class PubSub
{
	public readonly uuid: string;
	public subscriptions: Subscription[] = [];

	public static generateUuid (): string
	{
		let uuid = '';

		for (let i = 0; i < 32; i++) {
			const random = Math.random() * 16 | 0;

			switch (i)
			{
				case 8:
				case 12:
				case 16:
				case 20:
					uuid += '-';
			}

			uuid += (i === 12 ? 7 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
		}

		return uuid;
	}

	public constructor ()
	{
		this.uuid = PubSub.generateUuid();
	}

	public subscribe (subscribeRequest: Subscription): void
	{
		this.subscriptions.push(subscribeRequest);
	}

	public publish (eventName: string, ...args: any[]): void
	{
		const subscriptions: Subscription[] = this.subscriptions.filter(
			(subscription: Subscription) => subscription.event === eventName,
		);

		for (const subscription of subscriptions) {
			subscription.callback(...args);
		}
	}

	public unSubscribe (subscriber: PubSub, eventName: string)
	{
		this.subscriptions = this.subscriptions.filter(
			(subscription) => {
				return subscription.subscriber.getUId() !== subscriber.getUId() ||
					subscription.event !== eventName;
			});
	}

	public unSubscribeAll (subscriber: PubSub)
	{
		this.subscriptions = this.subscriptions.filter(
			(subscription) => subscription.subscriber.getUId() !== subscriber.getUId(),
		);
	}

	public getUId (): string
	{
		return this.uuid;
	}
}
