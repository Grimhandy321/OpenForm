type DataObject = { [key: string]: any };

export class ExpressionEvaluator {
    private aggregatedValues: any[] = [];

    public evaluate(expression: string, data: DataObject): any {
        let value: any = expression ?? "";

        try {
            value = eval(expression);
        } catch (e) {
            console.error(`Evaluation error for expression "${expression}":`, e);
            console.debug("Data context:", data);
        }


        return value;
    }

    public getAggregatedValues(): { key: string; value: any }[] {
        return this.aggregatedValues;
    }

    public clearAggregatedValues(): void {
        this.aggregatedValues = [];
    }
}
