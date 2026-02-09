// @ts-check

/**
 * Clears the given canvas context.
 * @param {CanvasRenderingContext2D} ctx
 */
export function clearCanvas(ctx) {
    if (ctx.reset) {
        ctx.reset();
    } else {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.resetTransform();
        ctx.beginPath();
    }
}
