/**
 * Creates a new BoundingBox object.
 * @param {CanvasRenderingContext2D} ctx - A canvas context for using isPointInPath().
 * @param {number} top - The top side of the box.
 * @param {number} left - The left side of the box.
 * @param {number} bottom - The bottom side of the box.
 * @param {number} right - The right side of the box.
 * @property {function(): number} getTop - Gets the top side of the bounding box.
 * @property {function(): number} getLeft - Gets the left side of the bounding box.
 * @property {function(): number} getBottom - Gets the bottom side of the bounding box.
 * @property {function(): number} getRight - Gets the right side of the bounding box.
 * @property {function(): {topLeft: [number, number], topRight: [number, number], bottomLeft: [number, number], bottomRight: [number, number]}} getPoints - Gets the four corner points of the bounding box.
 * @property {function(x: number, y: number): boolean} isPointInBox - Tests whether a point is inside the bounding box.
 * @property {function(box: BoundingBox): boolean} intersect - Checks whether the bounding box intersects with another bounding box.
 * @property {function(): {x: number, y: number}} randomPoint - Generates a random point inside the bounding box.
 * @returns {BoundingBox} Returns a BoundingBox object.
 */
const BoundingBox = function (ctx, top, left, bottom, right) {

    /**
     * The path containing the bounding box.
     * @type {Path2D}
     */
    const path = new Path2D();
    path.rect(left, top, right - left, bottom - top);

    /**
     * Gets the top side of the bounding box.
     * @returns {number} The top side of the bounding box.
     */
    const getTop = function () {
        return top;
    };

    /**
     * Gets the left side of the bounding box.
     * @returns {number} The left side of the bounding box.
     */
    const getLeft = function () {
        return left;
    };

    /**
     * Gets the bottom side of the bounding box.
     * @returns {number} The bottom side of the bounding box.
     */
    const getBottom = function () {
        return bottom;
    };

    /**
     * Gets the right side of the bounding box.
     * @returns {number} The right side of the bounding box.
     */
    const getRight = function () {
        return right;
    };

    /**
     * Gets the four corner points of the bounding box.
     * @returns {{topLeft: [number, number], topRight: [number, number], bottomLeft: [number, number], bottomRight: [number, number]}} The corner points of the bounding box.
     */
    const getPoints = function () {
        return {
            topLeft: [left, top],
            topRight: [right, top],
            bottomLeft: [left, bottom],
            bottomRight: [right, bottom]
        };
    };

    /**
     * Tests whether a point is inside the bounding box.
     * @param {number} x - The x-coordinate of the point.
     * @param {number} y - The y-coordinate of the point.
     * @returns {boolean} True if the point is inside the bounding box, false otherwise.
     */
    const isPointInBox = function (x, y) {
        return ctx.isPointInPath(path, x, y);
    };

    /**
     * Checks whether the bounding box intersects with another bounding box.
     * @param {BoundingBox} box - The other bounding box.
     * @returns {boolean} True if the bounding boxes intersect, false otherwise.
     */
    const intersect = function (box) {
        /* Check the points of the other box */
        let points = box.getPoints();
        for (const key in points) {
            if (isPointInBox(...points[key]))
                return true;
        }

        /* Check the points of this box */
        points = getPoints();
        for (const key in points) {
            if (box.isPointInBox(...points[key]))
                return true;
        }

        return false;
    };

    /**
     * Generates a random point inside the bounding box.
     * @returns {{x: number, y: number}} A random point inside the bounding box.
     */
    const randomPoint = function () {
        const x = left + (Math.random() * (right - left));
        const y = top + (Math.random() * (bottom - top));
        return {x, y};
    };

    // The methods are returned as an object here.
    return {
        getTop: getTop,
        getLeft: getLeft,
        getBottom: getBottom,
        getRight: getRight,
        getPoints: getPoints,
        isPointInBox: isPointInBox,
        intersect: intersect,
        randomPoint: randomPoint
    };
};
