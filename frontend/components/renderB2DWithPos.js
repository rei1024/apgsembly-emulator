// @ts-check

import { B2D } from "../../src/components/B2D";
import { $b2dFlipUpsideDown, $b2dHidePointer } from "../bind";
import { clearCanvas } from "../util/clear-canvas";
import { renderB2D } from "./renderB2D";

/**
 * @param {B2D | undefined} b2d
 * @param {{ x: HTMLElement, y: HTMLElement }} pos
 * @param {CanvasRenderingContext2D} ctx
 */
export function renderB2DWithPos(b2d, pos, ctx) {
    if (b2d === undefined) {
        pos.x.textContent = "0";
        pos.y.textContent = "0";
        clearCanvas(ctx);
        return;
    }

    pos.x.textContent = b2d.x.toString();
    pos.y.textContent = b2d.y.toString();

    renderB2D(
        ctx,
        b2d,
        $b2dHidePointer.checked,
        $b2dFlipUpsideDown.checked,
    );
}
