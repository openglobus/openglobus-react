import * as React from 'react';
import {useEffect} from 'react';
import {ILayerParams, Layer as GlobusLayer} from '@openglobus/og';
import {EventCallback} from '@openglobus/og/lib/Events';

export interface LayerProps extends ILayerParams {
    name: string
    layerRef?: React.MutableRefObject<GlobusLayer | null>,
    children?: React.ReactNode;
    onVisibilityChange?: EventCallback;
    onAdd?: EventCallback;
    onRemove?: EventCallback;
    onMouseMove?: EventCallback;
    onMouseEnter?: EventCallback;
    onMouseLeave?: EventCallback;
    onLclick?: EventCallback;
    onRclick?: EventCallback;
    onMclick?: EventCallback;
    onLdblclick?: EventCallback;
    onRdblclick?: EventCallback;
    onMdblclick?: EventCallback;
    onLup?: EventCallback;
    onRup?: EventCallback;
    onMup?: EventCallback;
    onLdown?: EventCallback;
    onRdown?: EventCallback;
    onMdown?: EventCallback;
    onLhold?: EventCallback;
    onRhold?: EventCallback;
    onMhold?: EventCallback;
    onMouseWheel?: EventCallback;
    onTouchMove?: EventCallback;
    onTouchStart?: EventCallback;
    onTouchEnd?: EventCallback;
    onDoubleTouch?: EventCallback;
    onTouchLeave?: EventCallback;
    onTouchEnter?: EventCallback;
}

const Layer: React.FC<LayerProps> = ({opacity, children, name, layerRef, ...params}) => {
    const [refPassed, setRefPassed] = React.useState(false);
    useEffect(() => {
        if (layerRef) {
            if (layerRef.current && typeof opacity === 'number' && refPassed) {
                layerRef.current.opacity = opacity;
            }
        }
    }, [opacity]);
    useEffect(() => {
        if (refPassed && layerRef && layerRef.current) {
            if (params.onVisibilityChange) layerRef.current?.events.on("visibilitychange", params.onVisibilityChange)
            if (params.onAdd) layerRef.current?.events.on("add", params.onAdd)
            if (params.onRemove) layerRef.current?.events.on("remove", params.onRemove)
            if (params.onMouseMove) layerRef.current?.events.on("mousemove", params.onMouseMove)
            if (params.onMouseEnter) layerRef.current?.events.on("mouseenter", params.onMouseEnter)
            if (params.onMouseLeave) layerRef.current?.events.on("mouseleave", params.onMouseLeave)
            if (params.onLclick) layerRef.current?.events.on("lclick", params.onLclick)
            if (params.onRclick) layerRef.current?.events.on("rclick", params.onRclick)
            if (params.onMclick) layerRef.current?.events.on("mclick", params.onMclick)
            if (params.onLdblclick) layerRef.current?.events.on("ldblclick", params.onLdblclick)
            if (params.onRdblclick) layerRef.current?.events.on("rdblclick", params.onRdblclick)
            if (params.onMdblclick) layerRef.current?.events.on("mdblclick", params.onMdblclick)
            if (params.onLup) layerRef.current?.events.on("lup", params.onLup)
            if (params.onRup) layerRef.current?.events.on("rup", params.onRup)
            if (params.onMup) layerRef.current?.events.on("mup", params.onMup)
            if (params.onLdown) layerRef.current?.events.on("ldown", params.onLdown)
            if (params.onRdown) layerRef.current?.events.on("rdown", params.onRdown)
            if (params.onMdown) layerRef.current?.events.on("mdown", params.onMdown)
            if (params.onLhold) layerRef.current?.events.on("lhold", params.onLhold)
            if (params.onRhold) layerRef.current?.events.on("rhold", params.onRhold)
            if (params.onMhold) layerRef.current?.events.on("mhold", params.onMhold)
            if (params.onMouseWheel) layerRef.current?.events.on("mousewheel", params.onMouseWheel)
            if (params.onTouchMove) layerRef.current?.events.on("touchmove", params.onTouchMove)
            if (params.onTouchStart) layerRef.current?.events.on("touchstart", params.onTouchStart)
            if (params.onTouchEnd) layerRef.current?.events.on("touchend", params.onTouchEnd)
            if (params.onDoubleTouch) layerRef.current?.events.on("doubletouch", params.onDoubleTouch)
        }
        return () => {
            if (params.onLclick) layerRef?.current?.events.off('lclick', params.onLclick)
            setRefPassed(false)
        }
    }, [refPassed]);
    if (layerRef?.current && !refPassed) {
        setRefPassed(true)
    }
    return (
        <>
            {children}
        </>
    );
};

export {Layer};
