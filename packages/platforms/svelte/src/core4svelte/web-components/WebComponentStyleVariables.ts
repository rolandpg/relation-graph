export const relationGraphWebComponentVarCss = `
.rg-toolbar {
    z-index: var(--rg-toolbar-z-index, 300);
    background-color: var(--rg-toolbar-bg, #ffffff);
    color: var(--rg-toolbar-color, #333333);
    --rg-toolbar-hover-bg-color: var(--rg-toolbar-hover-bg, rgba(220, 220, 220, 0.5));
    box-shadow: var(--rg-toolbar-shadow, 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 0 1px 0 rgba(0, 0, 0, 0.4));
    border: var(--rg-toolbar-border, none);
    border-radius: var(--rg-toolbar-radius, 5px);
    gap: var(--rg-toolbar-gap, 3px);
    backdrop-filter: var(--rg-toolbar-backdrop-filter, blur(5px));
}

.rg-toolbar .rg-icon {
    width: var(--rg-toolbar-icon-size, 16px);
    height: var(--rg-toolbar-icon-size, 16px);
}

.rg-toolbar .rg-current-zoom {
    font-size: var(--rg-toolbar-current-zoom-font-size, 10px);
    border-radius: var(--rg-toolbar-current-zoom-radius, 3px);
}

.rg-toolbar .rg-mb-button {
    width: var(--rg-toolbar-button-size, 35px);
    height: var(--rg-toolbar-button-size, 35px);
    border-radius: var(--rg-toolbar-button-radius, 3px);
}

.rg-toolbar.rg-toolbar-v {
    padding: var(--rg-toolbar-v-padding, 10px 3px);
}

.rg-toolbar.rg-toolbar-v .rg-current-zoom {
    width: var(--rg-toolbar-v-current-zoom-width, 35px);
    height: var(--rg-toolbar-v-current-zoom-height, 25px);
    line-height: var(--rg-toolbar-v-current-zoom-line-height, 25px);
}

.rg-toolbar.rg-toolbar-h {
    padding: var(--rg-toolbar-h-padding, 3px 10px);
}

.rg-toolbar.rg-toolbar-h .rg-current-zoom {
    padding: var(--rg-toolbar-h-current-zoom-padding, 0px 5px);
    height: var(--rg-toolbar-h-current-zoom-height, 35px);
    line-height: var(--rg-toolbar-h-current-zoom-line-height, 35px);
}

.rg-toolbar.rg-toolbar-h-right {
    right: var(--rg-toolbar-offset-right, 15px);
}

.rg-toolbar.rg-toolbar-h-left {
    left: var(--rg-toolbar-offset-left, 15px);
}

.rg-toolbar.rg-toolbar-v-top {
    top: var(--rg-toolbar-offset-top, 15px);
}

.rg-toolbar.rg-toolbar-v-bottom {
    bottom: var(--rg-toolbar-offset-bottom, 15px);
}

.rg-toolbar.rg-xs-toolbar .rg-mb-button {
    width: var(--rg-toolbar-xs-button-size, 25px);
    height: var(--rg-toolbar-xs-button-size, 25px);
}

.rg-toolbar.rg-xs-toolbar .rg-icon {
    width: var(--rg-toolbar-xs-icon-size, 14px);
    height: var(--rg-toolbar-xs-icon-size, 14px);
}

.rg-toolbar.rg-xs-toolbar.rg-toolbar-v {
    padding: var(--rg-toolbar-xs-v-padding, 3px);
}

.rg-toolbar.rg-xs-toolbar.rg-toolbar-v .rg-current-zoom {
    width: var(--rg-toolbar-xs-v-current-zoom-width, 30px);
    height: var(--rg-toolbar-xs-v-current-zoom-height, 25px);
    line-height: var(--rg-toolbar-xs-v-current-zoom-line-height, 25px);
}

.rg-toolbar.rg-xs-toolbar.rg-toolbar-h {
    padding: var(--rg-toolbar-xs-h-padding, 3px);
}

.rg-toolbar.rg-xs-toolbar.rg-toolbar-h .rg-current-zoom {
    width: var(--rg-toolbar-xs-h-current-zoom-width, 35px);
    height: var(--rg-toolbar-xs-h-current-zoom-height, 25px);
    line-height: var(--rg-toolbar-xs-h-current-zoom-line-height, 25px);
}

.rg-toolbar.rg-xs-toolbar.rg-toolbar-h-right {
    right: var(--rg-toolbar-xs-offset-right, 10px);
}

.rg-toolbar.rg-xs-toolbar.rg-toolbar-h-left {
    left: var(--rg-toolbar-xs-offset-left, 10px);
}

.rg-toolbar.rg-xs-toolbar.rg-toolbar-v-top {
    top: var(--rg-toolbar-xs-offset-top, 10px);
}

.rg-toolbar.rg-xs-toolbar.rg-toolbar-v-bottom {
    bottom: var(--rg-toolbar-xs-offset-bottom, 10px);
}

.rg-editing-referline {
    z-index: var(--rg-reference-line-z-index, 999);
}

.rg-editing-referline .rg-referline {
    --rg-refer-offset: var(--rg-reference-line-offset, -3px);
}

.rg-editing-referline .rg-referline .referline > div {
    background-color: var(--rg-reference-line-label-bg, var(--editor-main-color));
    font-size: var(--rg-reference-line-label-font-size, 8px);
    border-radius: var(--rg-reference-line-label-radius, 3px);
    color: var(--rg-reference-line-label-color, #ffffff);
    padding: var(--rg-reference-line-label-padding, 2px 5px);
}

.rg-editing-referline .rg-referline-v {
    width: var(--rg-reference-line-v-hit-width, 6px);
}

.rg-editing-referline .rg-referline-v .referline {
    width: var(--rg-reference-line-thickness, 1px);
    background-color: var(--rg-reference-line-color, var(--editor-main-color));
}

.rg-editing-referline .rg-referline-v::before,
.rg-editing-referline .rg-referline-v::after {
    width: var(--rg-reference-line-dot-size, 5px);
    height: var(--rg-reference-line-dot-size, 5px);
    background-color: var(--rg-reference-line-color, var(--editor-main-color));
}

.rg-editing-referline .rg-referline-h {
    height: var(--rg-reference-line-h-hit-width, 6px);
}

.rg-editing-referline .rg-referline-h .referline {
    height: var(--rg-reference-line-thickness, 1px);
    background-color: var(--rg-reference-line-color, var(--editor-main-color));
}

.rg-editing-referline .rg-referline-h::before,
.rg-editing-referline .rg-referline-h::after {
    width: var(--rg-reference-line-dot-size, 5px);
    height: var(--rg-reference-line-dot-size, 5px);
    background-color: var(--rg-reference-line-color, var(--editor-main-color));
}

.rg-editing-connect-ctrl {
    z-index: var(--rg-connect-controller-z-index, 1400);
    --hander-border-radius: var(--rg-connect-handler-radius, 5px);
    --border-handler-width: var(--rg-connect-border-bar-size, 8px);
    --hv-handler-width: var(--rg-connect-hv-bar-size, 10px);
    --center-handler-width: var(--rg-connect-center-size, 10px);
    --border-point-width: var(--rg-connect-point-width, 10px);
    --border-point-height: var(--rg-connect-point-height, 10px);
    --hander-color: var(--rg-connect-handler-bg, var(--editor-light2-color));
    --hander-border-color: var(--rg-connect-handler-border-color, var(--editor-main-color));
    --hander-shadow-color: var(--rg-connect-handler-shadow-color, rgba(57, 144, 216, 0.1));
    box-shadow: 0 0 0 var(--border-handler-width) var(--hander-shadow-color);
}

.rg-connect-ctl-handler-style {
    border-radius: var(--rg-connect-handler-corner-radius, 3px);
}

.rg-connect-ctl-handler-style:hover {
    background-color: var(--rg-connect-handler-hover-bg, #fbe691);
}

.rg-connect-ctl-lr,
.rg-connect-ctl-tb {
    opacity: var(--rg-connect-axis-handle-opacity, 0.01);
}

.rg-connect-ctl-bottom-bar,
.rg-connect-ctl-top-bar,
.rg-connect-ctl-left-bar,
.rg-connect-ctl-right-bar {
    background-color: var(--rg-connect-side-bar-bg, var(--edit-ctl-light-color));
    opacity: var(--rg-connect-side-bar-opacity, 0.1);
}

.rg-connect-ctl-bottom-bar {
    border-radius: var(--rg-connect-handler-radius, 5px);
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
}

.rg-connect-ctl-top-bar {
    border-radius: var(--rg-connect-handler-radius, 5px);
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
}

.rg-connect-ctl-left-bar {
    border-radius: var(--rg-connect-handler-radius, 5px);
    border-bottom-right-radius: 0px;
    border-top-right-radius: 0px;
}

.rg-connect-ctl-right-bar {
    border-radius: var(--rg-connect-handler-radius, 5px);
    border-bottom-left-radius: 0px;
    border-top-left-radius: 0px;
}
`;

export const miniViewWebComponentVarCss = `
.rg-miniview {
    pointer-events: var(--rg-miniview-pointer-events, all);
    z-index: var(--rg-miniview-z-index, 1100);
    min-width: var(--rg-miniview-min-width, 100px);
    min-height: var(--rg-miniview-min-height, 100px);
    --miniview-width: var(--rg-miniview-width, 200px);
    --miniview-height: var(--rg-miniview-height, 120px);
    width: var(--miniview-width);
    height: var(--miniview-height);
    border-radius: var(--rg-miniview-radius, 3px);
    background-color: var(--rg-miniview-bg, #ffffff);
    box-shadow: var(--rg-miniview-shadow, 0 0 0 1px #cccccc);
    border: var(--rg-miniview-border, none);
}

.rg-miniview .rg-mv-canvas-reset:hover {
    background-color: var(--rg-miniview-reset-hover-bg, rgba(187, 245, 71, 0.58));
}

.rg-miniview .rg-mv-visible-area {
    box-shadow: 0 0 0 9999px var(--rg-miniview-mask-color, rgba(0, 0, 0, 0.2));
    border: var(--rg-miniview-visible-area-border, #888 solid 1px);
    border-radius: var(--rg-miniview-visible-area-radius, 3px);
}

.rg-miniview.rg-miniview-top {
    left: var(--rg-miniview-left, calc((100% - var(--miniview-width)) / 2));
    right: var(--rg-miniview-right, auto);
    top: var(--rg-miniview-top, 10px);
    bottom: var(--rg-miniview-bottom, auto);
}

.rg-miniview.rg-miniview-bottom {
    left: var(--rg-miniview-left, calc((100% - var(--miniview-width)) / 2));
    right: var(--rg-miniview-right, auto);
    top: var(--rg-miniview-top, auto);
    bottom: var(--rg-miniview-bottom, 10px);
}

.rg-miniview.rg-miniview-left {
    left: var(--rg-miniview-left, 10px);
    right: var(--rg-miniview-right, auto);
    top: var(--rg-miniview-top, calc((100% - var(--miniview-height)) / 2));
    bottom: var(--rg-miniview-bottom, auto);
}

.rg-miniview.rg-miniview-right {
    left: var(--rg-miniview-left, auto);
    right: var(--rg-miniview-right, 10px);
    top: var(--rg-miniview-top, calc((100% - var(--miniview-height)) / 2));
    bottom: var(--rg-miniview-bottom, auto);
}

.rg-miniview.rg-miniview-tl {
    left: var(--rg-miniview-left, var(--rg-miniview-tl-left, 10px));
    right: var(--rg-miniview-right, var(--rg-miniview-tl-right, auto));
    top: var(--rg-miniview-top, var(--rg-miniview-tl-top, 10px));
    bottom: var(--rg-miniview-bottom, var(--rg-miniview-tl-bottom, auto));
}

.rg-miniview.rg-miniview-tr {
    left: var(--rg-miniview-left, var(--rg-miniview-tr-left, auto));
    right: var(--rg-miniview-right, var(--rg-miniview-tr-right, 10px));
    top: var(--rg-miniview-top, var(--rg-miniview-tr-top, 10px));
    bottom: var(--rg-miniview-bottom, var(--rg-miniview-tr-bottom, auto));
}

.rg-miniview.rg-miniview-bl {
    left: var(--rg-miniview-left, var(--rg-miniview-bl-left, 10px));
    right: var(--rg-miniview-right, var(--rg-miniview-bl-right, auto));
    top: var(--rg-miniview-top, var(--rg-miniview-bl-top, auto));
    bottom: var(--rg-miniview-bottom, var(--rg-miniview-bl-bottom, 10px));
}

.rg-miniview.rg-miniview-br {
    left: var(--rg-miniview-left, var(--rg-miniview-br-left, auto));
    right: var(--rg-miniview-right, var(--rg-miniview-br-right, 10px));
    top: var(--rg-miniview-top, var(--rg-miniview-br-top, auto));
    bottom: var(--rg-miniview-bottom, var(--rg-miniview-br-bottom, 10px));
}
`;

export const editingLineWebComponentVarCss = `
.rg-editing-line-ctrl {
    z-index: var(--rg-editing-line-z-index, 500);
}

.rg-editing-line-ctrl .rg-edt-ctrl-svg path {
    stroke: var(--rg-editing-line-guide-color, var(--editor-main-color));
    stroke-width: var(--rg-editing-line-guide-width, 1px);
}

.rg-editing-line-ctrl .rg-line-ctrl-dot {
    width: var(--rg-editing-line-dot-size, 10px);
    height: var(--rg-editing-line-dot-size, 10px);
    background-color: var(--rg-editing-line-dot-bg, #ffffff);
    box-shadow: 0 0 0 var(--rg-editing-line-dot-ring-width, 1px) var(--rg-editing-line-dot-ring-color, var(--editor-main-color));
    border-radius: var(--rg-editing-line-dot-radius, 50%);
}

.rg-editing-line-ctrl .ctrl-split-h {
    width: var(--rg-editing-line-split-h-width, 12px);
    height: var(--rg-editing-line-split-h-height, 5px);
    border-radius: var(--rg-editing-line-split-radius, 3px);
}

.rg-editing-line-ctrl .ctrl-split-v {
    width: var(--rg-editing-line-split-v-width, 5px);
    height: var(--rg-editing-line-split-v-height, 12px);
    border-radius: var(--rg-editing-line-split-radius, 3px);
}

.rg-editing-line-ctrl .rg-line-ctrl-text {
    background-color: var(--rg-editing-line-text-bg, rgba(255, 255, 255, 1));
    box-shadow: 0 0 0 var(--rg-editing-line-text-ring-width, 1px) var(--rg-editing-line-text-ring-color, var(--editor-main-color));
    border-radius: var(--rg-editing-line-text-radius, 3px);
    color: var(--rg-editing-line-text-color, #000000);
    padding: var(--rg-editing-line-text-padding, 3px 10px);
    min-height: var(--rg-editing-line-text-min-height, 20px);
    max-height: var(--rg-editing-line-text-max-height, 30px);
    min-width: var(--rg-editing-line-text-min-width, 50px);
    max-width: var(--rg-editing-line-text-max-width, 220px);
}

.rg-editing-line-ctrl .rg-line-ctrl-text p {
    color: var(--rg-editing-line-text-paragraph-color, #333333);
}

.rg-editing-line-ctrl .rg-line-ctrl-text p.empty-text {
    color: var(--rg-editing-line-empty-text-color, #888888);
}

.rg-editing-line-ctrl .rg-line-ctrl-text .rg-line-text-input {
    background-color: var(--rg-editing-line-input-bg, transparent);
    color: var(--rg-editing-line-input-color, #000000);
    border-radius: var(--rg-editing-line-input-radius, 3px);
    width: var(--rg-editing-line-input-width, 100px);
}

.rg-editing-line-ctrl .rg-line-ctrl-text-editing {
    background-color: var(--rg-editing-line-text-editing-bg, #faf191);
}
`;

export const editingResizeWebComponentVarCss = `
.rg-resize-ctl {
    --resize-handler-size: var(--rg-resize-handler-size, 10px);
    --resize-handler-offset: var(--rg-resize-handler-offset, -5px);
}

.rg-resize-ctl .rg-resize-ctl-handler {
    background-color: var(--rg-resize-handler-bg, #ffffff);
    border-radius: var(--rg-resize-handler-radius, 2px);
    box-shadow: inset 0 0 0 var(--rg-resize-handler-ring-width, 1px) var(--rg-resize-handler-ring-color, var(--editor-main-color));
}
`;
