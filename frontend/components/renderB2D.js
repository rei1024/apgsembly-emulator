// @ts-check

import { B2D } from "../../src/components/B2D.js";
import { internalError } from "../../src/internalError.js";
import { clearCanvas } from "../util/clear-canvas.js";

/**
 * B2Dをcanvasに描画する
 * render B2D to canvas
 * @param {CanvasRenderingContext2D} context
 * @param {B2D} b2d
 * @param {boolean} hidePointer ポインタを非表示にする
 * @param {boolean} flipUpsideDown 上下逆にする
 * @param {boolean} displayGrid 格子を表示
 */
export const renderB2D = (
    context,
    b2d,
    hidePointer,
    flipUpsideDown,
    displayGrid,
) => {
    const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 4);
    const SIZE = 300 * devicePixelRatio;

    if (context.canvas.width !== SIZE || context.canvas.height !== SIZE) {
        // make square
        context.canvas.width = SIZE;
        context.canvas.height = SIZE;
        context.canvas.style.width = `${
            (SIZE / devicePixelRatio).toFixed(0)
        }px`;
        context.canvas.style.height = `${
            (SIZE / devicePixelRatio).toFixed(0)
        }px`;
    }

    // reset canvas
    clearCanvas(context);

    const maxX = b2d.getMaxX();
    const maxY = b2d.getMaxY();

    const n = Math.max(maxX, maxY) + 1;
    const cellSize = SIZE / n;

    // default is math coordinates
    if (!flipUpsideDown) {
        context.scale(1, -1);
        context.translate(0, -SIZE);
    }

    const array = b2d.getArray();
    // context.rotate(Math.PI / 4);
    context.fillStyle = "#212529";
    for (let j = 0; j <= maxY; j++) {
        const row = array[j] ?? internalError();
        const jMultCell = j * cellSize;
        for (let i = 0; i <= maxX; i++) {
            if (row[i] === 1) {
                context.rect(i * cellSize, jMultCell, cellSize, cellSize);
            }
        }
    }

    context.fill();

    if (displayGrid) {
        context.beginPath();
        // Use a subtle, light color for the grid lines
        context.strokeStyle = "rgba(0, 0, 0, 0.1)";
        context.lineWidth = Math.max(2, 4 * (1 / devicePixelRatio));

        for (let i = 0; i <= n; i++) {
            const pos = i * cellSize;

            // Vertical lines
            context.moveTo(pos, 0);
            context.lineTo(pos, SIZE);

            // Horizontal lines
            context.moveTo(0, pos);
            context.lineTo(SIZE, pos);
        }
        context.stroke();
    }

    // draw pointer
    if (!hidePointer) {
        context.strokeStyle = "#03A9F4";
        context.lineWidth = 4;
        context.strokeRect(
            b2d.x * cellSize,
            b2d.y * cellSize,
            cellSize,
            cellSize,
        );
    }
};
