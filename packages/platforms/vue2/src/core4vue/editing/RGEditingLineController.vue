<template>
    <div
        v-if="show"
        class="rg-editing-line-ctrl"
    >
        <slot/>
        <svg v-if="pathEditable" class="rg-edt-ctrl-svg" xmlns="http://www.w3.org/2000/svg">
            <g>
                <path v-if="(editingLineShape === 6) && ctrlPoint1" :d="ctrlPoint1SvgPath"/>
                <path v-if="(editingLineShape === 6) && ctrlPoint2" :d="ctrlPoint2SvgPath"/>
            </g>
        </svg>

        <div class="rg-line-ctrl-dot start-dot"
             :style="{
                    '--rg-ctl-x': options.editingLineController.startPoint.x + 'px',
                    '--rg-ctl-y': options.editingLineController.startPoint.y + 'px'
          }"
             @mousedown.left="onMouseDown('start', $event)"
             @touchstart="onMouseDown('start', $event)"
        ></div>

        <div class="rg-line-ctrl-dot end-dot"
             :style="{
                    '--rg-ctl-x': editingLineController.endPoint.x + 'px',
                    '--rg-ctl-y': editingLineController.endPoint.y + 'px'
            }"
             @mousedown.left="onMouseDown('end', $event)"
             @touchstart="onMouseDown('end', $event)"
        ></div>

        <div
            v-if="pathEditable && editingLineShape === 6 && ctrlPoint1"
            class="rg-line-ctrl-dot ctrl-dot"
            :style="{
                        '--rg-ctl-x': ctrlPoint1.x + 'px',
                        '--rg-ctl-y': ctrlPoint1.y + 'px'
                }"
            @mousedown.left="onCtrlPointMouseDown(0, $event)"
            @touchstart="onCtrlPointMouseDown(0, $event)"
        ></div>

        <div
            v-if="pathEditable && editingLineShape === 6 && ctrlPoint2"
            class="rg-line-ctrl-dot ctrl-dot"
            :style="{
                        '--rg-ctl-x': ctrlPoint2.x + 'px',
                        '--rg-ctl-y': ctrlPoint2.y + 'px'
                }"
            @mousedown.left="onCtrlPointMouseDown(1, $event)"
            @touchstart="onCtrlPointMouseDown(1, $event)"
        ></div>

        <template v-if="pathEditable && (editingLineShape === 44 || editingLineShape === 49)">
            <div
                v-for="(split, index) of line44Splits"
                :key="split.optionName || index"
                v-if="!split.hide"
                class="rg-line-ctrl-dot ctrl-split"
                :class="{
                      'ctrl-split-core': (!split.optionName.startsWith('cp-')),
                      'ctrl-split-v': split.direction === 'v',
                      'ctrl-split-h': split.direction === 'h',
                    }"
                :style="{
                        '--rg-ctl-x': split.x + 'px',
                        '--rg-ctl-y': split.y + 'px'
                    }"
                @mousedown.left="onLine44CtrlPointMouseDown(split, $event)"
                @touchstart="onLine44CtrlPointMouseDown(split, $event)"
            ></div>
        </template>

        <div v-if="textEditable && editingLineController.line"
             :class="['rg-line-ctrl-text', (editing && 'rg-line-ctrl-text-editing')]"
             :style="{
                    '--rg-ctl-x': editingLineController.text.x + 'px',
                    '--rg-ctl-y': editingLineController.text.y + 'px'
            }"
             @click="startEditingLineText"
             @mousedown="startMoveText($event)"
             @touchstart="startMoveText($event)"
        >
            <template
                v-if="!editing"
            >
                <p v-if="lineText">{{ lineText }}</p>
                <p v-else class="empty-text">Add Text...</p>
            </template>
            <input
                v-else
                ref="inputRef"
                class="rg-line-text-input"
                :value="lineText"
                @blur="onLineTextChange"
            />
        </div>
    </div>
</template>

<script lang="ts">

import {JsonLine, RGNode, RGPosition} from "../../../../../types";

export default {
    name: 'RGEditingLineController',
    components: {},
    props: {
        textEditable: {
            // mustUseProp: false, // Vue 2 中通常不需要这个
            default: true
        },
        pathEditable: {
            // mustUseProp: false, // Vue 2 中通常不需要这个
            default: true
        }
    },
    inject: ['graphStore'],
    data() {
        return {
            lineText: '',
            editing: false,
            prevClickTime: 0 // 新增：用于模拟双击判断
        };
    },
    computed: {
        graphInstance() {
            return this.graphStore.graphInstance;
        },
        options() {
            return this.graphStore.options;
        },
        editingLineController() {
            return this.options.editingLineController;
        },
        show() {
            return this.editingLineController.show;
        },
        // 新增计算属性，方便 Template 访问
        editingLine() {
            return this.editingLineController.line;
        },
        editingLineShape() {
            return this.editingLine ? this.editingLine.lineShape : null;
        },
        ctrlPoint1() {
            return this.editingLineController.ctrlPoint1;
        },
        ctrlPoint2() {
            return this.editingLineController.ctrlPoint2;
        },
        ctrlPoint1SvgPath() {
            if (!this.ctrlPoint1) return '';
            const start = this.editingLineController.startPoint;
            return `M ${start.x} ${start.y} L ${this.ctrlPoint1.x} ${this.ctrlPoint1.y}`;
        },
        ctrlPoint2SvgPath() {
            if (!this.ctrlPoint2) return '';
            const end = this.editingLineController.endPoint;
            return `M ${end.x} ${end.y} L ${this.ctrlPoint2.x} ${this.ctrlPoint2.y}`;
        },
        line44Splits() {
            return this.editingLineController.line44Splits || [];
        },
        text() {
            return this.editingLineController.line && this.editingLineController.line.text;
        }
    },
    watch: {
        show(newValue) {
            if (!newValue) {
                this.editing = false;
                this.lineText = '';
                this.prevClickTime = 0;
            }
        },
        text(newValue) {
            if (newValue !== this.lineText) {
                this.lineText = newValue;
                this.$nextTick(() => {
                    this.graphInstance.updateEditingLineView();
                });
            }
        },
        // 新增：监听 shape 变化以更新视图
        editingLineShape(newValue) {
            this.$nextTick(() => {
                this.graphInstance.updateEditingLineView();
            });
        }
    },
    methods: {
        // 新增：贝塞尔曲线控制点拖拽
        onCtrlPointMouseDown(ctrlPointIndex, $event) {
            this.graphInstance.startMoveLine6CtrlPoint(ctrlPointIndex, $event, (line) => {
                this.$emit('onLinePathChanged', line, ctrlPointIndex);
            });
        },
        // 新增：折线控制点拖拽
        onLine44CtrlPointMouseDown(split, $event) {
            this.graphInstance.startMoveLine44CtrlPoint(split, $event, (line) => {
                this.$emit('onLinePathChanged', line, split);
            });
        },
        onMouseDown(type, $event) {
            const line = this.editingLineController.line;
            this.$emit('onMoveLineVertexStart', type, line);
            const graphInstance = this.graphInstance;

            // 保持原有的逻辑，同时兼容 touch
            graphInstance.startMoveLineVertex(type, $event, (fromNode: RGNode, toNode: RGNode | RGPosition, newLineJson: JsonLine) => {
                this.$emit('onMoveLineVertexEnd', fromNode, toNode, newLineJson);
                graphInstance.defaultLineVertexBeChangedHandler(fromNode, toNode, newLineJson);
            });
        },
        startMoveText($event) {
            this.graphInstance.startMoveLineText($event, () => {
                const line = this.editingLineController.line;
                this.$emit('onLineTextDragEnd', line);
            });
        },
        // 修改：使用时间戳模拟双击，逻辑同步自 Vue3 版本
        startEditingLineText($event) {
            const now = Date.now();
            if (this.prevClickTime && (now - this.prevClickTime) < 500) {
                this.editing = true;
                this.$nextTick(() => {
                    // Vue 2 中使用 $refs 获取 input 焦点
                    if (this.$refs.inputRef) {
                        this.$refs.inputRef.focus();
                    }
                });
            }
            this.prevClickTime = now;
        },
        onLineTextChange($event) {
            const line = this.editingLineController.line;
            const newValue = $event.target.value;

            if (line && line.text !== newValue) {
                this.graphInstance.updateLine(line.id, {
                    text: newValue,
                });
                this.$emit('onLineTextChanged', line);
            }
            this.editing = false;
        }
    }
};
</script>

<style scoped>
/* 如果原项目中有全局样式或父组件样式覆盖，这里可能不需要新增样式。
   但为了支持 SVG 和控制点，确保 CSS 类名与 Vue 3 版本保持一致。
*/
</style>
