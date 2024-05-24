import * as React from "react";
import { useContext, useEffect, useRef } from "react";
import { Billboard as GlobusBillboard } from "@openglobus/og";
import { IBillboardParams } from "@openglobus/og/lib/js/entity/Billboard";
import { EntityContext } from "./Entity";

interface BillboardParams extends IBillboardParams {}

const Billboard: React.FC<{ params: BillboardParams }> = ({ params }) => {
    const { addBillboard, removeBillboard } = useContext(EntityContext);
    const billboardRef = useRef<GlobusBillboard | null>(null);

    useEffect(() => {
        billboardRef.current = new GlobusBillboard(params);
        if (billboardRef.current) {
            addBillboard(billboardRef.current);
        }

        return () => {
            if (billboardRef.current) {
                removeBillboard(billboardRef.current);
            }
        };
    }, [addBillboard, removeBillboard, params]);

    return null;
};

export { Billboard };
