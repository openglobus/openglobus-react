// import * as React from "react";
// import {useContext, useEffect, useRef} from "react";
// import {useGlobusContext} from './index';
// import { Entity as GlobusEntity, IEntityParams, IGlobeParams, LonLat} from '@openglobus/og';
// import {VectorContext} from "../Vector";
// import {EventCallback} from "@openglobus/og/lib/js/Events";
// import {NumberArray3} from "@openglobus/og/lib/js/math/Vec3";
//
// type EntityChildElement = React.ReactElement<{ type: typeof Billboard }>;
//
//
// interface EntityProps extends IEntityParams {
//     children?: React.ReactNode,
//     onDraw?: EventCallback
// }
// const Entity: React.FC<EntityProps> = ({lonlat, name, ...rest}) => {
//     const {globus} = useGlobusContext();
//     const {addEntity, removeEntity} = useContext(VectorContext);
//     const entityRef = useRef<GlobusEntity | null>(null);
//     useEffect(() => {
//         if (lonlat) {
//             if (!(lonlat instanceof LonLat)) lonlat = LonLat.createFromArray(lonlat as NumberArray3)
//             entityRef.current?.setLonLat(lonlat);
//         }
//     }, [lonlat]);
//     useEffect(() => {
//         if (globus) {
//             entityRef.current = new GlobusEntity({lonlat, name, ...rest});
//             addEntity(entityRef.current);
//
//             return () => {
//                 if (globus) {
//                     removeEntity(entityRef.current)
//                 }
//                 // Cleanup if needed
//             };
//         }
//     }, [globus, addEntity, removeEntity]);
//
//     return null;
// };
//
// export {Entity};
