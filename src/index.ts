const MSSanSerif: string = 'MS San Serif';
const Verdana: string = 'Verdana';
const Tahoma: string = 'Tahoma';

interface Point {
    x: number,
    y: number,
}


interface Rect {
    content: string,
    position: Point,
    velocity: number,
    color?: number,
};

interface Oneline {
    fontSize: number, // 12 ~ 24 ?
    x: number,
    color?: RGB,
    delay: number, // ~ 1000?
    v: number, // 100 ~ 1000
}

interface HSV {
    h: number,
    s: number,
    v: number,
}

interface RGB {
    r: number,
    g: number,
    b: number,
}

const defaultState = {
    color: { r: 30, g: 100, b: 0 } as RGB,
    font: "12px " + Verdana,
}


const main = () => {
    const ctx = init('canvas');
    const lines = genParams();

    let lastTime: number = null;
    const step = (timestamp: DOMHighResTimeStamp) => {
        if (lastTime === null) lastTime = timestamp;
        if (timestamp - lastTime > 30) {
            lastTime = timestamp;
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

            lines.forEach(x => {
                const height = (timestamp - x.delay) / x.v * x.fontSize;
                drawOneLine(ctx, x.x, height > window.innerHeight ? window.innerHeight + x.fontSize : height, x.fontSize, x.color);
            })

        }

        window.requestAnimationFrame(step)
    }
    window.requestAnimationFrame(step);
};

const init = (id: string) => {
    const canvas = document.getElementById(id) as HTMLCanvasElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    return canvas.getContext('2d');
};

const genColor = (): RGB => {
    let hsv: HSV = {
        h: 102,
        s: 1,
        v: (Math.floor(Math.random() * Math.floor(30)) + 40) / 100, // 0.2 ~ 0.55 の乱数を生成
    }
    return conversionHSV2RGB(hsv);
}

const genParams = (): Oneline[] => {
    return [...Array(100)].map(() => {
        return {
            fontSize: Math.floor(Math.random() * 12) + 12,
            x: Math.floor(Math.random() * window.innerWidth),
            v: Math.floor(Math.random() * 100),
            delay: Math.floor(Math.random() * 1000),
            color: genColor(),
        } as Oneline;
    });
}

const randChar = () => {
    const mat = 'abcdefghijklmopqrtsuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789   ';
    return mat[Math.floor(Math.random() * mat.length)];
};

const drawOneLine = (ctx: CanvasRenderingContext2D, x: number, height: number, fontSize: number, color: RGB = null) => {
    ctx.font = String(fontSize) + 'px ' + Verdana;
    if (color !== null) {
        ctx.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
    }

    for (let h = 0; h < height; h += fontSize) {
        ctx.fillText(randChar(), x, h);
    }

    ctx.fillStyle = `rgb(${defaultState.color.r}, ${defaultState.color.g}, ${defaultState.color.b})`
};

const conversionHSV2RGB = (hsv: HSV): RGB => {
    let rgb: RGB = { r: hsv.v, g: hsv.v, b: hsv.v };
    if (hsv.s > 0) {
        const h = hsv.h / 360 * 6;
        const inth = Math.floor(h);
        const decimal = h - inth;

        switch (inth) {
            case 0:
                rgb.g *= 1 - hsv.s * (1 - decimal);
                rgb.b *= 1 - hsv.s;
                break;
            case 1:
                rgb.r *= 1 - hsv.s * decimal;
                rgb.b *= 1 - hsv.s;
                break;
            case 2:
                rgb.r *= 1 - hsv.s;
                rgb.b *= 1 - hsv.s * (1 - decimal);
                break;
            case 3:
                rgb.r *= 1 - hsv.s;
                rgb.g *= 1 - hsv.s * decimal;
                break;
            case 4:
                rgb.r *= 1 - hsv.s * (1 - decimal);
                rgb.g *= 1 - hsv.s;
                break;
            case 5:
                rgb.g *= 1 - hsv.s;
                rgb.b *= 1 - hsv.s * decimal;
                break;
            default:
                break;
        }
    }
    rgb.r *= 255;
    rgb.g *= 255;
    rgb.b *= 255;

    return rgb;
}


main();
