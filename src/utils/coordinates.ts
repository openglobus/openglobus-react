import {LonLat} from '@openglobus/og';
import type {LonLatInput} from '@/types/openglobus';

export const toLonLat = (value: LonLatInput): LonLat => {
    if (value instanceof LonLat) return value;

    return new LonLat(value[0], value[1], value[2] ?? 0);
};
