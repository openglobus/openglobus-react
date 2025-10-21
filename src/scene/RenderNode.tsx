import * as React from 'react';
import {useEffect, useRef, useCallback, useState, createContext, useContext} from 'react';
import {RenderNode as OgRenderNode} from '@openglobus/og';
import {useRenderer} from '@/renderer/Renderer';

interface RenderNodeProps {
    name?: string;
    visible?: boolean;
    onDraw?: (e: any) => void;
    children?: React.ReactNode;
}

const RenderNodeContext = createContext<OgRenderNode | null>(null);
export const useParentNode = () => useContext(RenderNodeContext);

export const RenderNode: React.FC<RenderNodeProps> = ({
                                                          name,
                                                          visible = true,
                                                          onDraw,
                                                          children
                                                      }) => {
    const renderer = useRenderer();
    const parentNode = useParentNode();
    const nodeRef = useRef<OgRenderNode | null>(null);
    const [contextNode, setContextNode] = useState<OgRenderNode | null>(null);

    useEffect(() => {
        if (!renderer && !parentNode) return;

        const node = new OgRenderNode(name || 'node');
        node.show = visible;

        if (parentNode) parentNode.addNode(node);
        else if (renderer) renderer.addNode(node);

        nodeRef.current = node;
        setContextNode(node);

        return () => {
            node.remove();
            node.destroy();
            setContextNode(null);
        };
    }, [renderer, parentNode]);

    useEffect(() => {
        nodeRef.current && (nodeRef.current.show = visible);
    }, [visible]);

    return (
        <RenderNodeContext.Provider value={contextNode}>
            {children}
        </RenderNodeContext.Provider>
    );
};
