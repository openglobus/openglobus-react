import {useEffect, useMemo, useRef, useState} from "react";
import {LonLat, Vec3} from "@openglobus/og";
import {useGlobeContext} from "@/Globe";

/**
 * Возвращает экранные координаты для точки на глобусе.
 * Использует ту же формулу видимости, что и Popup.
 */
export function useGlobePosition(
    lonLat?: LonLat | [number, number, number?],
    cartesian?: Vec3 | [number, number, number],
    offset: [number, number] = [0, 0]
) {
    const {globe} = useGlobeContext();
    const [pos, setPos] = useState<{x: number; y: number; visible: boolean} | null>(null);

    const norm = useMemo(() => {
        if (!globe) return null;
        const ellipsoid = globe.planet.ellipsoid;

        if (cartesian) {
            const cart = cartesian instanceof Vec3 ? cartesian.clone() : new Vec3(...cartesian);
            const ll = ellipsoid.cartesianToLonLat(cart);
            return {cart, height: ll.height || 0};
        }

        if (lonLat) {
            const ll = lonLat instanceof LonLat ? lonLat : new LonLat(...lonLat);
            const cart = ellipsoid.lonLatToCartesian(ll);
            return {cart, height: ll.height || 0};
        }

        return null;
    }, [globe, lonLat, cartesian]);

    const offsetRef = useRef(offset);
    useEffect(() => {
        offsetRef.current = offset;
    }, [offset]);

    useEffect(() => {
        if (!globe || !norm) return;

        const planet = globe.planet;
        const handler = planet.renderer!.handler;
        const r = handler.pixelRatio;
        const {cart, height} = norm;

        const updatePosition = () => {
            const cam = planet.camera;

            // Немутирующий вектор от камеры к объекту
            const look = cart.sub(cam.eye);

            const f = planet.ellipsoid.equatorialSize + height;
            const g = cam._lonLat.height;
            const v = Math.sqrt((f + g) * (f + g) - f * f);

            const inFront = cam.getForward().dot(look.getNormal()) > 0.0;
            const visible = v > look.length() && inFront;

            if (visible) {
                const projected = cam.project3v(cart);
                const [ox, oy] = offsetRef.current;
                const x = projected.x / r + ox;
                const y = projected.y / r - handler.canvas!.clientHeight + oy;
                setPos({x, y, visible: true});
            } else {
                setPos({x: 0, y: 0, visible: false});
            }
        };

        planet.events.on("draw", updatePosition);
        return () => planet.events.off("draw", updatePosition);
    }, [globe, norm]);

    return pos;
}
