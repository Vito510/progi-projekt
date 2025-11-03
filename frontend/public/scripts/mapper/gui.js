import * as Tile from './tile.js';

export default class GUIManager {
    constructor(canvas, gpu, camera) {
        this.canvas = canvas;
        this.setupListeners(gpu, camera);
    }

    setupListeners(gpu, camera) {
        document.addEventListener("keypress", (event) => {
            if (event.key == " ")
                camera.orbit_mode = !camera.orbit_mode;
            if (event.key == "r")
                camera.speed *= 1.25;
            if (event.key == "f")
                camera.speed /= 1.25;
        });

        // document.getElementById("map-select").addEventListener('pointerdown', (event_start) => {
        //     const element_rectangle = document.getElementById("map-rectangle");
        //     const element_select = document.getElementById("map-select");
        //     const map_rect = element_select.getBoundingClientRect();

        //     const setRect = function setRect(element, start_x, start_y, end_x, end_y) {
        //         if (end_x < start_x)
        //             [start_x, end_x] = [end_x, start_x];
        //         if (end_y < start_y)
        //             [start_y, end_y] = [end_y, start_y];

        //         element.style.left = start_x + "px";
        //         element.style.top = start_y + "px";
        //         element.style.width = (end_x - start_x) + "px";
        //         element.style.height = (end_y - start_y) + "px";
        //     }

        //     element_rectangle.style.display = "block";
        //     let start_x = event_start.x - map_rect.x;
        //     let start_y = event_start.y - map_rect.y
        //     let end_x = start_x;
        //     let end_y = start_y;
        //     setRect(element_rectangle, start_x, start_y, end_x, end_y);

        //     const callback_move = (event_move) => {
        //         end_x = event_move.x - map_rect.x;
        //         end_y = event_move.y - map_rect.y;
        //         setRect(element_rectangle, start_x, start_y, end_x, end_y);

        //         const min_lon = ((start_x / map_rect.width) * 2.0 - 1.0) * 180;
        //         const min_lat = ((start_y / map_rect.height) * 2.0 - 1.0) * -90;
        //         const max_lon = ((end_x / map_rect.width) * 2.0 - 1.0) * 180;
        //         const max_lat = ((end_y / map_rect.height) * 2.0 - 1.0) * -90;

        //         if (!Tile.isValidTileSet(min_lon, min_lat, max_lon, max_lat))
        //             element_rectangle.classList.add("invalid");
        //         else
        //             element_rectangle.classList.remove("invalid");
        //     };

        //     const callback_submit = async function() {
        //         element_select.removeEventListener("pointermove", callback_move);
        //         element_select.removeEventListener("pointerup", callback_submit);
        //         element_select.removeEventListener("pointercancel", callback_submit);
        //         element_select.removeEventListener("pointerleave", callback_submit);

        //         if (end_x < start_x)
        //             [start_x, end_x] = [end_x, start_x];
        //         if (end_y > start_y)
        //             [start_y, end_y] = [end_y, start_y];

        //         const min_lon = ((start_x / map_rect.width) * 2.0 - 1.0) * 180;
        //         const min_lat = ((start_y / map_rect.height) * 2.0 - 1.0) * -90;
        //         const max_lon = ((end_x / map_rect.width) * 2.0 - 1.0) * 180;
        //         const max_lat = ((end_y / map_rect.height) * 2.0 - 1.0) * -90;

        //         // const min_lon = 45;
        //         // const min_lat = 15;
        //         // const max_lon = 47;
        //         // const max_lat = 16;

        //         if (!Tile.isValidTileSet(min_lon, min_lat, max_lon, max_lat))
        //             return;

        //         // const image = await Tile.fetchTile(45.880899, 15.956237);
        //         // const image = await Tile.fetchTile(min_lat, min_lon);
        //         // const image = await Loader.loadImage("../assets/images/textures/disc.jpg");
        //         console.log("Region: ", min_lon, min_lat, max_lon, max_lat);
        //         const data = await Tile.getData(min_lon, min_lat, max_lon, max_lat);
        //         console.log("Data: ", data);

        //         // const test = Image.resize(image, 256, 512);
        //         // Loader.saveImage("a.png", test);

        //         gpu.reloadImage(data.image, data.range * 3);
        //         gpu.uniforms.height_offset = data.offset;
        //         gpu.uniforms.height_multiplier = data.multiplier * 3;

        //         // const data = Tile.getData(start_x, start_y, end_x, end_y);
        //         // gpu.reloadImage(data.image);

        //     };

        //     element_select.addEventListener("pointermove", callback_move);
        //     element_select.addEventListener("pointerup", callback_submit);
        //     element_select.addEventListener("pointercancel", callback_submit);
        //     element_select.addEventListener("pointerleave", callback_submit);
        // });
    }
}
