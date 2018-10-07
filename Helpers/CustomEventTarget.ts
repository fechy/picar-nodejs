export abstract class CustomEventTarget implements EventTarget
{
	private listeners: any = [];

	public addEventListener (type: string, callback: () => any): void {
		if (!(type in this.listeners)) {
			this.listeners[type] = [];
		}
		this.listeners[type].push(callback);
	}

	public removeEventListener (type: string, callback: () => any): void {
		if (!(type in this.listeners)) {
			return;
		}
		const stack = this.listeners[type];
		for (let i = 0, l = stack.length; i < l; i++) {
			if (stack[i] === callback){
				stack.splice(i, 1);
				return;
			}
		}
	}

	public dispatchEvent (event: Event, data?: any): boolean {
		if (!(event.type in this.listeners)) {
			return true;
		}
		const stack = this.listeners[event.type].slice();

		for (let i = 0, l = stack.length; i < l; i++) {
			stack[i].call(this, event, data);
		}
		return !event.defaultPrevented;
	}

}
