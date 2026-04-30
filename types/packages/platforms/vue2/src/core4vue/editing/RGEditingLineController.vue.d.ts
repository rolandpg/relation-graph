declare const _default: import('vue').DefineComponent<{
    textEditable: {
        default: boolean;
    };
    pathEditable: {
        default: boolean;
    };
}, {}, {
    lineText: string;
    editing: boolean;
    prevClickTime: number;
}, {
    graphInstance(): any;
    options(): any;
    editingLineController(): any;
    show(): any;
    editingLine(): any;
    editingLineShape(): any;
    ctrlPoint1(): any;
    ctrlPoint2(): any;
    ctrlPoint1SvgPath(): any;
    ctrlPoint2SvgPath(): any;
    line44Splits(): any;
    text(): any;
}, {
    onCtrlPointMouseDown(ctrlPointIndex: any, $event: any): void;
    onLine44CtrlPointMouseDown(split: any, $event: any): void;
    onMouseDown(type: any, $event: any): void;
    startMoveText($event: any): void;
    startEditingLineText($event: any): void;
    onLineTextChange($event: any): void;
}, import('vue/types/v3-component-options').ComponentOptionsMixin, import('vue/types/v3-component-options').ComponentOptionsMixin, {}, string, Readonly<import('vue').ExtractPropTypes<{
    textEditable: {
        default: boolean;
    };
    pathEditable: {
        default: boolean;
    };
}>>, {
    textEditable: boolean;
    pathEditable: boolean;
}>;
export default _default;
