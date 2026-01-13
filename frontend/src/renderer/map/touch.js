
export function addTouchListener(element, callback) {
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;
    let startDistance = 0;
    let lastDistance = 0;
    let activeTouches = 0;
    let isPinching = false;
    let isDragging = false;

    function getTouchDistance(t1, t2) {
        const dx = t2.clientX - t1.clientX;
        const dy = t2.clientY - t1.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function handleTouchStart(event) {
        event.preventDefault();
        const touches = event.touches;
        activeTouches = touches.length;

        if (touches.length === 1) {
            isDragging = true;
            startX = lastX = touches[0].clientX;
            startY = lastY = touches[0].clientY;
        } else if (touches.length === 2) {
            isPinching = true;
            isDragging = false;
            startDistance = getTouchDistance(touches[0], touches[1]);
            lastDistance = startDistance;
        }
    }

    function handleTouchMove(event) {
        event.preventDefault();
        const touches = event.touches;
        activeTouches = touches.length;

        let delta_x = 0;
        let delta_y = 0;
        let delta_zoom = 0;

        if (isDragging && touches.length === 1) {
            const currentX = touches[0].clientX;
            const currentY = touches[0].clientY;

            delta_x = currentX - lastX;
            delta_y = currentY - lastY;

            lastX = currentX;
            lastY = currentY;
        } else if (isPinching && touches.length === 2) {
            const currentDistance = getTouchDistance(touches[0], touches[1]);
            delta_zoom = currentDistance - lastDistance;
            lastDistance = currentDistance;
        }

        if (delta_x !== 0 || delta_y !== 0 || delta_zoom !== 0) {
            callback({
                drag_x: delta_x,
                drag_y: delta_y,
                zoom: delta_zoom
            });
        }
    }

    function handleTouchEnd(event) {
        if (event.touches.length === 0) {
            isDragging = false;
            isPinching = false;
        } else {
            activeTouches = event.touches.length;
            if (activeTouches === 1 && isPinching) {
                isPinching = false;
                isDragging = true;
                startX = lastX = event.touches[0].clientX;
                startY = lastY = event.touches[0].clientY;
            }
        }
    }

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);
    element.addEventListener('touchcancel', handleTouchEnd);

    return function removeTouchListener() {
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchmove', handleTouchMove);
        element.removeEventListener('touchend', handleTouchEnd);
        element.removeEventListener('touchcancel', handleTouchEnd);
    };
}

export function addDoubleTapListener(element, callback) {
    let lastTapTime = 0;
    let tapTimeout = null;
    const DOUBLE_TAP_DELAY = 300;

    function handleTouchEnd(event) {
        const currentTime = Date.now();
        const timeSinceLastTap = currentTime - lastTapTime;

        if (timeSinceLastTap < DOUBLE_TAP_DELAY) {
            clearTimeout(tapTimeout);
            lastTapTime = 0;
            callback(event.clientX, event.clientY);
            event.preventDefault();
        } else {
            lastTapTime = currentTime;
            clearTimeout(tapTimeout);
            tapTimeout = setTimeout(() => {
            lastTapTime = 0;
            }, DOUBLE_TAP_DELAY);
        }
    }

    element.addEventListener('pointerup', handleTouchEnd);

    return function removeDoubleTapListener() {
        element.removeEventListener('pointerup', handleTouchEnd);
        clearTimeout(tapTimeout);
    };
}