class LinearRegression {

    constructor(intercept = 0.0, slope = 0.0) {
        this.intercept = intercept;
        this.slope = slope;
    }

    fit(y, x) {
        if (x.length !== y.length) {
            throw "Different length of inputs";
        }
    
        const x_avg = avg(x);
        const y_avg = avg(y);
    
        const sxy = sum(zip(x, y).map(v => (v[0] - x_avg) * (v[1] - y_avg)));
        const sx2 = sum(x.map(xv => Math.pow(xv - x_avg, 2)));
    
        this.slope = sx2 !== 0 ? sxy/sx2 : 0.0;
        this.intercept = y_avg - this.slope*x_avg;
    
        return this;
    }

    predict(x) {
        return x.map(v => this.intercept + this.slope*v);
    }

};

const sum = arr => arr.reduce((p, c) => p + c, 0);
const avg = arr => sum(arr) / arr.length;
const zip = (a, b) => a.map((k, i) => [k, b[i]]);

export default LinearRegression;