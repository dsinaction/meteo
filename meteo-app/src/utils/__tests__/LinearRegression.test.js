import LinearRegression from '../LinearRegression';

describe('Fit Linear Regression', () => {

    test('raises error when different lengths', () => {
        const y = [10, 5, 3];
        const x = [1, 2];

        const lr = new LinearRegression();

        expect(() => {
            lr.fitLinearRegression(y, x);
        }).toThrow();
    });

    test('calculates simple average', () => {
        const y = [10, 5, 3];
        const x = [0, 0, 0];

        const lr = new LinearRegression();
        lr.fit(y, x);

        expect(lr.intercept).toEqual(6);
        expect(lr.slope).toEqual(0);
    });

    test('fits regression to real data', () => {
        const sales = [651, 762, 856, 1063, 1190, 1298, 1421, 1440, 1518];
        const advertising = [23, 26, 30, 34, 43, 48, 52, 57, 58];

        const lr = new LinearRegression();
        lr.fit(sales, advertising);

        expect(lr.intercept).toBeCloseTo(167.68, 2);
        expect(lr.slope).toBeCloseTo(23.42, 2);

    });

});

describe('Predict With Linear Regression', () => {

    test('raises error when different lengths', () => {
        const lr = new LinearRegression(3.0, 1.5);

        const x = [1, 2, 4];
        const yhat = lr.predict(x);

        expect(yhat).toEqual([4.5, 6.0, 9.0]);
    });

});