import { runIfFunction, isObject } from './Helpers';

export { };

declare global {
    interface Array<T> {
        first(): T;
        last(): T;
        isNotEmpty(): boolean;
        isEmpty(): boolean;
        remove(elem: T): Array<T>;
        init(length: number): Array<T>;
        pluck(key: string): Array<T>;
        toObject(key: string): Array<T>;
        fillWith(
            value: Function | string | number | Record<string, any> | Array<any>,
        ): Array<T>;
    }
}

if (!Array.prototype.remove) {
    const func = function <T>(this: any, elem: T): T[] {
        return this.filter((e: T) => e !== elem);
    };

    Object.defineProperty(Array.prototype, 'remove', {
        value: func,
        enumerable: false,
    });
}


if (!Array.prototype.fillWith) {
    const func = function <T>(this: any,
        value: Function | string | number | Record<string, any> | Array<any>,
    ): T[] {
        const length = this.length;
        for (let i = 0; i < length; i++) {
            this[i] = runIfFunction(value, value);
        }
        return this;
    };

    Object.defineProperty(Array.prototype, 'fillWith', {
        value: func,
        enumerable: false,
    });
}

if (!Array.prototype.init) {
    const func = function <T>(this: any, length: number): T[] {
        for (let i = 0; i < +length; i++) this.push(undefined);
        return this;
    };

    Object.defineProperty(Array.prototype, 'init', {
        value: func,
        enumerable: false,
    });
}

if (!Array.prototype.first) {
    const func = function <T>(this: any): T {
        return this[0];
    };

    Object.defineProperty(Array.prototype, 'first', {
        value: func,
        enumerable: false,
    });
}

if (!Array.prototype.last) {
    const func = function <T>(this: any): T {
        return this[this.length - 1];
    };

    Object.defineProperty(Array.prototype, 'last', {
        value: func,
        enumerable: false,
    });
}

if (!Array.prototype.pluck) {
    const func = function <T>(this: any, key: string): T[] {
        const values: any[] = [];
        if (isObject(this[0])) {
            this.forEach((element: { [x: string]: any; }) => {
                values.push(element[key]);
            });
        }

        return values;
    };

    Object.defineProperty(Array.prototype, 'pluck', {
        value: func,
        enumerable: false,
    });
}

if (!Array.prototype.isNotEmpty) {
    const func = function <T>(this: any): boolean {
        return this.length > 0;
    };

    Object.defineProperty(Array.prototype, 'isNotEmpty', {
        value: func,
        enumerable: false,
    });
}

if (!Array.prototype.isEmpty) {
    const func = function <T>(this: any): boolean {
        return this.length == 0;
    };

    Object.defineProperty(Array.prototype, 'isEmpty', {
        value: func,
        enumerable: false,
    });
}

if (!Array.prototype.toObject) {
    const func = function <T>(this: any, key: string): Record<string, any> {
        const obj: {[index: string]:any} = {}
        if (isObject(this[0])) {
            for (const k of this) {
                obj[k[key]] = k;
            }
            return obj;
        }

        this.array.forEach((element:any, i:number) => {
            obj[i] = element;
        });

        return obj;
    };

    Object.defineProperty(Array.prototype, 'toObject', {
        value: func,
        enumerable: false,
    });
}
