import {RelationGraphWith92MiniView} from "./RelationGraphWith92MiniView";
import {devLog} from "../utils/RGCommon";

/**
 * API methods related to generating images in the relation-graph component,
 * - The methods here are just to prepare for generating images, making the dom reach a state suitable for generating images, and then letting the user get the dom and call third-party libraries to generate images
 * - Specific content includes: setting watermark dom, setting background dom, moving canvas position, adjusting node positions as necessary, adjusting canvas size, etc.
 */
export class RelationGraphWith93Image extends RelationGraphWith92MiniView {
    constructor() {
        super();
    }

    private $watermarkDom: HTMLDivElement | null = null;
    private $watermarkPosition = 'br';
    private $backgroundDom: HTMLDivElement | null = null;

    /**
     * Set the watermark dom element, which will be automatically called when using the <RGWatermark> component to set the watermark dom
     * - Note that this is an internal method, please do not use it externally
     * @inner
     */
    setWatermarkDom(watermarkDom: HTMLDivElement | null, forImage = true, forDisplay = false, position = 'br') {
        if (forImage) this.$watermarkDom = watermarkDom;
        this.$watermarkPosition = position;
    }
    private _originBackgroundColor = '';

    /**
     * Set the background dom element, which will be automatically called when using the <RGBackground> component to set the background dom
     * - Note that this is an internal method, please do not use it externally
     * @inner
     */
    setBackgroundDom(backgroundDom: HTMLDivElement | null, forImage = true, forDisplay = true) {
        if (backgroundDom === null) {
            this._originBackgroundColor = this.options.backgroundColor;
            this.dataProvider.updateOptions({
                backgroundColor: 'transparent'
            });
            if (forImage) {
                this.$backgroundDom = backgroundDom;
            } else {
                this.$backgroundDom = null;
            }
        } else {
            this.dataProvider.updateOptions({
                backgroundColor: this._originBackgroundColor
            });
            this.$backgroundDom = null;
        }
    }

    /**
     * Switch to a state suitable for generating images, allowing relation-graph to enter a state suitable for generating images
     * - Note that this is an asynchronous method
     * @return Returns the dom element used to generate the image
     *
     */
    async prepareForImageGeneration(): Promise<HTMLElement> {
        this.updateShouldRenderGraphData();
        this.updateElementLines();
        await this.moveItemsAndFitContent();
        this._dataUpdated();
        return this.$canvasDom.parentElement;
    }
    private graphStatusBeforeImageGeneration = {
        orignCanvasOffsetX: 0,
        orignCanvasOffsetY: 0,
        orignZoom: 0,
        forceLayouting: false
    };
    /**
     * After the image is generated, let relation-graph return to the previous state
     */
    async restoreAfterImageGeneration() {
        const {
            orignCanvasOffsetX, orignCanvasOffsetY,
            orignZoom,
            forceLayouting
        } = this.graphStatusBeforeImageGeneration;

        this.$canvasDom.parentElement.style.width = '100%';
        this.$canvasDom.parentElement.style.height = '100%';

        this.setZoom(orignZoom);
        this.dataProvider.updateOptions({
            canvasOffset: {x: orignCanvasOffsetX, y: orignCanvasOffsetY}
        });
        this._dataUpdated();
        // this.getNodes().forEach(thisNode => {
        //     thisNode.x = thisNode.x + itemOffsetX;
        //     thisNode.y = thisNode.y + itemOffsetY;
        // });
        //
        // const canvasSlotList = this.getCanvasSlotList();
        // canvasSlotList.forEach(canvasSlot => {
        //     const canvasSlotDiv = canvasSlot as HTMLDivElement;
        //     canvasSlotDiv.style.transform = `translate(0px, 0px)`;
        // });
        // const elementLineSvgList = this.$canvasDom.querySelectorAll('.rg-lines-svg-el-lines');
        // elementLineSvgList.forEach(canvasSlot => {
        //     const svgEl = canvasSlot as SVGElement;
        //     svgEl.style.width = '1px';
        //     svgEl.style.height = '1px';
        // });

        // Restore original state
        // this.dataProvider.updateOptions({
        //     canvasSize: {
        //         width: orignCanvasWidth,
        //         height: orignCanvasHeight
        //     },
        //     snapshotting: false
        // });
        if (forceLayouting) {
            this.startAutoLayout();
        }
        this.clearLoading();
    }
    private async moveItemsAndFitContent() {
        const options = this.getOptions();
        const orignZoom = options.canvasZoom;
        const orignCanvasOffsetX = options.canvasOffset.x;
        const orignCanvasOffsetY = options.canvasOffset.y;
        const forceLayouting = options.layout.autoLayouting === true;
        if (forceLayouting) {
            this.stopAutoLayout();
            await this.sleep(200);
        }
        this.loading('Generating...');
        this.dataProvider.updateOptions({
            snapshotting: true
        });
        this.dataProvider.clearChecked();
        this.setZoom(100);
        this.updateShouldRenderGraphData(true);
        this._dataUpdated();
        await this.sleep(200);
        const nodesRectBox = this.getNodesRectBox();
        const canvasSlotRectItems = this.getCanvasSlotRectItems();
        const canvasSlotRectBox = this.getNodesRectBox(canvasSlotRectItems);
        const padding = 100;
        const minX = Math.min(nodesRectBox.minX, canvasSlotRectBox.minX) - padding;
        const minY = Math.min(nodesRectBox.minY, canvasSlotRectBox.minY) - padding;
        const maxX = Math.max(nodesRectBox.maxX, canvasSlotRectBox.maxX) + padding;
        const maxY = Math.max(nodesRectBox.maxY, canvasSlotRectBox.maxY) + padding;
        const itemOffsetX = minX;
        const itemOffsetY = minY;
        const imageWidth = maxX - minX;
        const imageHeight = maxY - minY;
        this.graphStatusBeforeImageGeneration = {
            orignCanvasOffsetX, orignCanvasOffsetY,
            orignZoom,
            forceLayouting
        };
        // this.getNodes().forEach(thisNode => {
        //     thisNode.x = thisNode.x - itemOffsetX;
        //     thisNode.y = thisNode.y - itemOffsetY;
        // });
        // const canvasSlotList = this.getCanvasSlotList();
        // for (const canvasSlot of canvasSlotList) {
        //     const canvasSlotDiv = canvasSlot as HTMLDivElement;
        //     canvasSlotDiv.style.transform = `translate(${-itemOffsetX}px, ${-itemOffsetY}px)`;
        //     // canvasSlotDiv.style.marginLeft = (-itemOffsetX) + 'px';
        //     // canvasSlotDiv.style.marginTop = (-itemOffsetY) + 'px';
        // }
        // this.updateElementLines();
        // const elementLineSvgList = this.$canvasDom.querySelectorAll('.rg-lines-svg-el-lines');
        // elementLineSvgList.forEach(canvasSlot => {
        //     const svgEl = canvasSlot as SVGElement;
        //     svgEl.style.width = '4000px';
        //     svgEl.style.height = '4000px';
        // });
        // this.dataProvider.updateOptions({
        //     canvasOffset: {x: 0, y: 0},
        //     canvasSize: {
        //         width: imageWidth,
        //         height: imageHeight
        //     }
        // });
        // this._dataUpdated();

        this.dataProvider.updateOptions({
            canvasOffset: { x: -itemOffsetX, y: -itemOffsetY }
        });
        this._dataUpdated();
        this.setZoom(100);
        this.$canvasDom.parentElement.style.width = imageWidth + 'px';
        this.$canvasDom.parentElement.style.height = imageHeight + 'px';
        devLog('export image:', {
            imageWidth,
            imageHeight,
            minX,
            minY,
            maxX,
            maxY,
            devicePixelRatio: window.devicePixelRatio
        });
        await this.sleep(200);

    }
}
