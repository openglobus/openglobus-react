import * as React from "react";
import {useEffect, useRef} from "react";
import {Label as GlobusLabel, Vec2, Vec3, ILabelParams} from "@openglobus/og";

export interface LabelParams extends ILabelParams {
    name?: string;
    opacity?: number;
    readonly _addLabel?: (billboard: GlobusLabel) => void;
    readonly _removeLabel?: (billboard: GlobusLabel) => void;
}

const Label: React.FC<LabelParams> = ({
                                          visibility,
                                          size,
                                          color,
                                          rotation,
                                          offset,
                                          text,
                                          face,
                                          isRTL,
                                          align,
                                          outline,
                                          outlineColor,
                                          opacity,
                                          _addLabel,
                                          _removeLabel,
                                          ...params
                                      }) => {
    const labelRef = useRef<GlobusLabel | null>(null);

    useEffect(() => {
        if (typeof visibility === 'boolean' && labelRef.current) {
            labelRef.current?.setVisibility(visibility)
        }
    }, [visibility]);

    useEffect(() => {
        if (typeof rotation === 'number' && labelRef.current) {
            labelRef.current?.setRotation(rotation * Math.PI / 180)
        }
    }, [rotation]);

    useEffect(() => {
        if (typeof size === 'number' && labelRef.current) {
            labelRef.current?.setSize(size)
        }
    }, [size]);

    useEffect(() => {
        if (typeof outline === 'number' && labelRef.current) {
            labelRef.current?.setOutline(outline)
        }
    }, [outline]);

    useEffect(() => {
        if (typeof opacity === 'number' && labelRef.current) {
            labelRef.current?.setOpacity(opacity)
        }
    }, [opacity]);

    useEffect(() => {
        if (typeof isRTL === 'boolean' && labelRef.current) {
            labelRef.current?.setRtl(isRTL)
        }
    }, [isRTL]);

    useEffect(() => {
        if (offset && labelRef.current) {
            if (offset instanceof Vec3) {
                labelRef.current?.setOffset(offset.x, offset.y, offset.z);
            } else if (offset instanceof Vec2) {
                labelRef.current?.setOffset(offset.x, offset.y);
            } else {
                labelRef.current?.setOffset(offset[0], offset[1], offset[2]);
            }
        }
    }, [offset]);

    useEffect(() => {
        if (typeof text === 'string' && labelRef.current) {
            labelRef.current?.setText(text)
        }
    }, [text]);

    useEffect(() => {
        if (typeof face === 'string' && labelRef.current) {
            labelRef.current?.setFace(face)
        }
    }, [face]);

    useEffect(() => {
        if (typeof align === 'string' && labelRef.current) {
            labelRef.current?.setAlign(align)
        }
    }, [align]);

    useEffect(() => {
        if (typeof color === 'string' && labelRef.current) {
            labelRef.current?.setColorHTML(color)
        }
    }, [color]);

    useEffect(() => {
        if (typeof outlineColor === 'string' && labelRef.current) {
            labelRef.current?.setOutlineColorHTML(outlineColor)
        }
    }, [outlineColor]);

    useEffect(() => {
        labelRef.current = new GlobusLabel({
            ...params,
            color,
            size,
            text,
            face,
            isRTL,
            align,
            outline,
            outlineColor,
            opacity,
            offset,
            visibility,
            rotation: rotation ? rotation * Math.PI / 180 : 0
        });
        if (labelRef.current && _addLabel) {
            _addLabel(labelRef.current);
        }

        return () => {
            if (labelRef.current && _removeLabel) {
                _removeLabel(labelRef.current);
            }
        };
    }, [_addLabel, _removeLabel]);

    return null;
};

export {Label};
