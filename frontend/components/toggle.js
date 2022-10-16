// @ts-check

// HTMLと合わせること
const START = "Start";
const STOP = "Stop";

const primary = "btn-primary";
const danger = "btn-danger";

function getStart() {
    const div = document.createElement('div');
    // https://icons.getbootstrap.com/icons/play/
    div.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play" viewBox="0 0 16 16">
        <path stroke="currentColor" stroke-width="0.8" d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/>
    </svg> ${START}`;
    return div;
}

const start = getStart();

function getStop() {
    const div = document.createElement('div');
    // https://icons.getbootstrap.com/icons/stop/
    div.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-stop" viewBox="0 0 16 16">
        <path stroke="currentColor" stroke-width="0.8" d="M3.5 5A1.5 1.5 0 0 1 5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5zM5 4.5a.5.5 0 0 0-.5.5v6a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 .5-.5V5a.5.5 0 0 0-.5-.5H5z"/>
    </svg> ${STOP}`;
    return div;
}

const stop = getStop();

/**
 *
 * @param {HTMLButtonElement} $toggle
 */
export function startButton($toggle) {
    $toggle.disabled = false;

    while ($toggle.hasChildNodes()) {
        $toggle.firstChild?.remove();
    }

    $toggle.append(start);
    $toggle.classList.add(primary);
    $toggle.classList.remove(danger);
}

/**
 *
 * @param {HTMLButtonElement} $toggle
 */
export function stopButton($toggle) {
    $toggle.disabled = false;
    while ($toggle.hasChildNodes()) {
        $toggle.firstChild?.remove();
    }
    $toggle.append(stop);
    $toggle.classList.remove(primary);
    $toggle.classList.add(danger);
}
