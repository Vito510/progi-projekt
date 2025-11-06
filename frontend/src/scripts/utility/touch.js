import * as Vector from "./vector.js";

// TODO rewrite
export function addTouchListener(element, callback) {
    let previous_a = Vector.vec(0.0);
    let previous_b = Vector.vec(0.0);
    let previous_distance;

    element.addEventListener("touchstart", (event) => {
        event.preventDefault();
        if (event.touches.length == 1) {
            const touch_a = event.touches.item(0);
            previous_a = Vector.vec(touch_a.clientX, touch_a.clientY, 0.0);
        } else {
            const touch_b = event.touches.item(1);
            previous_b = Vector.vec(touch_b.clientX, touch_b.clientY, 0.0);
            previous_distance = Vector.len(Vector.sub(previous_a, previous_b));
        }
    });

    element.addEventListener("touchmove", (event) => {
        const touch_a = event.touches.item(0);
        let delta = Vector.sub(Vector.vec(touch_a.clientX, touch_a.clientY, 0.0), previous_a);
        // let pan = Vector.vec(0.0);
        previous_a = Vector.vec(touch_a.clientX, touch_a.clientY, 0.0);

        if (event.touches.length > 1) {
            const touch_b = event.touches.item(1);
            previous_b = Vector.vec(touch_b.clientX, touch_b.clientY, 0.0);
            const distance = Vector.len(Vector.sub(previous_a, previous_b));
            // pan = Vector.vec(delta.x, delta.y, 0.0);
            delta = Vector.vec(0.0, 0.0, distance - previous_distance);
            previous_distance = distance;
        }

        callback({
            drag_x: delta.x * 2.0,
            drag_y: delta.y * 2.0,
            zoom: delta.z,
            // pan_x: pan.x,
            // pan_y: pan.y,
        });
    });
}

// export function addTouchListener(element, callback) {
//     let id_a = null;
//     let id_b = null;
//     let previous_a = Vector.vec(0.0);
//     let previous_b = Vector.vec(0.0);
//     let previous_distance;

//     element.addEventListener("pointerdown", function(event) {
//         // console.log(event);
//         // element.setPointerCapture(event.pointerId);
//         event.preventDefault();
//         if (id_a === null) {
//             id_a = event.pointerId;
//             previous_a.x = event.screenX;
//             previous_a.y = event.screenY;
//         } else if (id_b === null) {
//             id_b = event.pointerId;
//             previous_b.x = event.screenX;
//             previous_b.y = event.screenY;
//             previous_distance = Vector.len(Vector.sub(previous_a, previous_b));
//         }
//     });

//     element.addEventListener("pointermove", function(event) {
//         if (id_a === null) return;
//         // console.log(event.pointerId);
//         let drag = Vector.vec(0.0);
//         let pan = Vector.vec(0.0);
//         let zoom = 0.0;
//         let current_a = Vector.vec(previous_a.x, previous_a.y, 0.0);
//         let current_b = Vector.vec(previous_b.x, previous_b.y, 0.0);
//         let current_distance = previous_distance;

//         if (event.pointerId == id_a) {
//             current_a.x = event.screenX;
//             current_a.y = event.screenY;
//         } 
//         else if (event.pointerId == id_b) {
//             current_b.x = event.screenX;
//             current_b.y = event.screenY;
//             current_distance = Vector.len(Vector.sub(current_a, current_b));
//         }

//         // console.log({
//         //     vec: Vector.vec(event.screenX, event.screenY, 0.0),
//         //     current_a: current_a,
//         //     current_b: current_b,
//         //     previous_a: previous_a,
//         //     previous_b: previous_b,
//         // });

//         if (id_b === null) {
//             drag = Vector.sub(current_a, previous_a);
//             // previous_a.x = current_a.x;
//             // previous_a.y = current_a.y;
//             previous_a.x = event.screenX;
//             previous_a.y = event.screenY;
//         } 
//         else {
//             pan = Vector.sub(current_a, previous_a);
//             zoom = current_distance - previous_distance;
//             previous_distance = Vector.len(Vector.sub(previous_a, previous_b));
//             // previous_b.x = current_b.x;
//             // previoous_b.y = current_b.y;
//             previous_b.x = event.screenX;
//             previous_b.y = event.screenY;
//             previous_distance = current_distance;
//         }

//         console.log({
//             drag_x: drag.x * 2.0,
//             drag_y: drag.y * 2.0,
//             pan_x: pan.x,
//             pan_y: pan.y,
//             zoom: zoom,
//         });

//         callback({
//             drag_x: drag.x * 2.0,
//             drag_y: drag.y * 2.0,
//             pan_x: pan.x,
//             pan_y: pan.y,
//             zoom: zoom,
//         });
//     });

//     ["pointerup", "pointercancel"].forEach((type) => {
//         element.addEventListener(type, function(event) {
//             if (event.pointerId == id_a)
//                 id_a = null;
//             else if (event.pointerId == id_b)
//                 id_b = null;
//         });
//     });
// }
