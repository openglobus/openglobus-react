import type {
    Events,
    PlanetCamera as OpenGlobusPlanetCamera,
    Renderer as OpenGlobusRenderer,
} from '@openglobus/og';

// Temporary type adapters for types that @openglobus/og does not currently
// export from its public entry point. Remove them once the library provides
// the corresponding public type exports.
export type EventCallback = Parameters<Events<string[]>['on']>[1];
export type PlanetCameraOptions = NonNullable<ConstructorParameters<typeof OpenGlobusPlanetCamera>[1]>;
export type RendererOptions = NonNullable<ConstructorParameters<typeof OpenGlobusRenderer>[1]>;
export type NumberArray3 = [number, number, number];
export type NumberArray4 = [number, number, number, number];
