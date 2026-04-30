<template>
    <div
            v-if="editingLineController.show"
            class="rg-editing-line-ctrl"
    >
        <slot/>
        <svg v-if="pathEditable" class="rg-edt-ctrl-svg" xmlns="http://www.w3.org/2000/svg">
            <g>
                <path v-if="(editingLine.lineShape === 6) && ctrlPoint1" :d="ctrlPoint1SvgPath"/>
                <path v-if="(editingLine.lineShape === 6) && ctrlPoint2" :d="ctrlPoint2SvgPath"/>
            </g>
        </svg>
        <div class="rg-line-ctrl-dot start-dot"
             :style="{
                    '--rg-ctl-x': editingLineController.startPoint.x + 'px',
                    '--rg-ctl-y': editingLineController.startPoint.y + 'px'
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
                v-if="pathEditable && editingLine.lineShape === 6 && ctrlPoint1"
                class="rg-line-ctrl-dot ctrl-dot"
                :style="{
                        '--rg-ctl-x': ctrlPoint1.x + 'px',
                        '--rg-ctl-y': ctrlPoint1.y + 'px'
                }"
                @mousedown.left="onCtrlPointMouseDown(0, $event)"
                @touchstart="onCtrlPointMouseDown(0, $event)"
        ></div>
        <div
                v-if="pathEditable && editingLine.lineShape === 6 && ctrlPoint2"
                class="rg-line-ctrl-dot ctrl-dot"
                :style="{
                        '--rg-ctl-x': ctrlPoint2.x + 'px',
                        '--rg-ctl-y': ctrlPoint2.y + 'px'
                }"
                @mousedown.left="onCtrlPointMouseDown(1, $event)"
                @touchstart="onCtrlPointMouseDown(1, $event)"
        ></div>
        <template v-if="pathEditable && (editingLine.lineShape === 44 || editingLine.lineShape === 49)" v-for="split of line44Splits">
            <div
                    :key="split.optionName"
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
        <div v-if="textEditable && editingLine"
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

<script lang="ts" setup>
import {computed, nextTick, ref, watch} from 'vue';
import type {
    JsonLine,
    RGCtrlPointForLine44,
    RGLine,
    RGLineEditPoint,
    RGLineTarget,
    RGNode,
    RGPosition
} from "../../../../types";
import {useGraphInstance} from "../../hooks/useGraphInstance";

const graphInstance = useGraphInstance();
const props = withDefaults(defineProps<{
    textEditable?: boolean,
    pathEditable?: boolean,
}>(), {
    textEditable: true,
    pathEditable: true
});
const options = computed(() => graphInstance.dataStores.optionsRef.value);
const editingLineController = computed(() => options.value.editingLineController);
const editingLine = computed(() => editingLineController.value.line);
const editingLineShape = computed(() => editingLineController.value.line?.lineShape);
const ctrlPoint1 = computed(() => editingLineController.value.ctrlPoint1);
const ctrlPoint2 = computed(() => editingLineController.value.ctrlPoint2);
const ctrlPoint1SvgPath = computed(() => `M ${editingLineController.value.startPoint.x} ${editingLineController.value.startPoint.y} L ${ctrlPoint1.value.x} ${ctrlPoint1.value.y}`);
const ctrlPoint2SvgPath = computed(() => `M ${editingLineController.value.endPoint.x} ${editingLineController.value.endPoint.y} L ${ctrlPoint2.value.x} ${ctrlPoint2.value.y}`);
const line44Splits = computed<RGCtrlPointForLine44[]>(() => editingLineController.value.line44Splits);
const text = computed(() => editingLine.value && editingLine.value.text);

const lineText = ref('');
const editing = ref(false);
let prevClickTime = ref(0);
const emit = defineEmits<{
    (e: 'onMoveLineVertexStart', type: RGLineEditPoint, line: RGLine):void;
    (e: 'onMoveLineVertexEnd', from: RGNode | RGLineTarget | RGPosition, to: RGNode | RGLineTarget | RGPosition, newLineJson?: JsonLine):void;
    (e: 'onLinePathChanged', line: RGLine, params: any):void;
    (e: 'onLineTextDragEnd', line: RGLine):void;
    (e: 'onLineTextChanged', line: RGLine):void;
}>();
watch(text, (newValue) => {
    if (newValue !== lineText.value) {
        lineText.value = newValue;
        nextTick(() => {
            graphInstance.updateEditingLineView();
        });
    }
});
watch(editingLineShape, (newValue) => {
    nextTick(() => {
        graphInstance.updateEditingLineView();
    });
});

const onCtrlPointMouseDown = (ctrlPointIndex: number, $event: MouseEvent) => {
    graphInstance.startMoveLine6CtrlPoint(ctrlPointIndex, $event, (line) => {
        emit('onLinePathChanged', line, ctrlPointIndex);
    });
};

const onLine44CtrlPointMouseDown = (split, $event: MouseEvent) => {
    graphInstance.startMoveLine44CtrlPoint(split, $event, (line) => {
        emit('onLinePathChanged', line, split);
    });
};

const onMouseDown = (type: 'start' | 'end', $event: MouseEvent) => {
    const line = options.value.editingLineController.line;
    emit('onMoveLineVertexStart', type, line);
    graphInstance.startMoveLineVertex(type, $event, (fromNode: RGNode | RGLineTarget | RGPosition, toNode: RGNode | RGLineTarget | RGPosition, newLineJson?: JsonLine) => {
        emit('onMoveLineVertexEnd', fromNode, toNode, newLineJson);
        graphInstance.defaultLineVertexBeChangedHandler(fromNode, toNode, newLineJson);
    });
};

const startMoveText = ($event: MouseEvent) => {
    graphInstance.startMoveLineText($event, () => {
        const line = options.value.editingLineController.line;
        emit('onLineTextDragEnd', line);
    });
};

const startEditingLineText = ($event: MouseEvent) => {
    if (prevClickTime.value && (Date.now() - prevClickTime.value) < 500) {
        editing.value = true;
        nextTick(() => {
            $event.target!.focus();
        });
    }
    prevClickTime.value = Date.now();
};

const onLineTextChange = ($event: MouseEvent) => {
    const editingLineObj = editingLine.value;
    if (editingLineObj && editingLineObj.text !== $event.target.value) {
        graphInstance.updateLine(editingLineObj.id, {
            text: $event.target.value
        })
        emit('onLineTextChanged', editingLineObj);
    }
    editing.value = false;
};

</script>
