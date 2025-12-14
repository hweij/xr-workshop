type TickerTask = (t: number) => void;

export class Ticker {
    tasks: TickerTask[] = [];

    add(t: TickerTask) {
        this.tasks.push(t);
    }

    remove(t: TickerTask) {
        const index = this.tasks.indexOf(t);
        if (index >= 0) {
            this.tasks.splice(index, 1);
        }
    }

    tick(time: number) {
        for (const task of this.tasks) {
            task(time);
        }
    }
}