import { useState } from "react";
import { cards } from "../data/cards.js";
import { BlockMath } from "react-katex";
import TargetSelectModal from "./modals/TargetSelectModal.jsx";
import CountSelectModal from "./modals/CountSelectModal.jsx";

export default function ControlPanel({ state, dispatch }) {

    //カードの仕分け
    const funcCards = cards.filter(card => card.type === "function");
    const operatorAllCards = cards.filter(card => card.type === "operator" && card.target === "all");
    const operatorSingleTrueCards = cards.filter(card => card.type === "operator" && card.target === "single" && card.multipleAllowed);
    const operatorSingleFalseCards = cards.filter(card => card.type === "operator" && card.target === "single" && !card.multipleAllowed);
    const multiplierDividerCards = cards.filter(card => card.type === "multiplier" || card.type === "divider");

    return (<>
        <div></div>
    </>);
}