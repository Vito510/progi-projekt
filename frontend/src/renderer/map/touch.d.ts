
export function addTouchListener(element: HTMLElement, callback: ({drag_x: number, drag_y: number, zoom: number}) => void): () => void;

export function addDoubleTapListener(element: HTMLElement, callback: (clientX: number, clientY: number) => void): () => void;