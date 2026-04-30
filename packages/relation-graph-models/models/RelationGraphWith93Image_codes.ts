import {RelationGraphWith92MiniView} from "./RelationGraphWith92MiniView";

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
        // todo 待实现
        return this.$canvasDom;
    }
    /**
     * After the image is generated, let relation-graph return to the previous state
     */
    async restoreAfterImageGeneration() {
        // todo 待实现
    }
    // async createGraphCanvas(format = 'png') {
    //     const options = this.getOptions();
    //     const orign_zoom = options.canvasZoom;
    //     const orign_width = this.$canvasDom.clientWidth; // 获取dom 宽度
    //     const orign_height = this.$canvasDom.clientHeight; // 获取dom 高度
    //     const forceLayouting = options.layout.autoLayouting;
    //     if (forceLayouting) {
    //         this.stopAutoLayout();
    //     }
    //     this.loading('Generating...');
    //     this.dataProvider.updateOptions({
    //         snapshotting: true
    //     });
    //     this.setZoom(100);
    //     // Render all data, wait for a while to make sure all dom updated
    //     await new Promise<void>(resolve => {
    //         setTimeout(() => {
    //             this.setZoom(100);
    //             this.updateShouldRenderGraphData();
    //             this.updateElementLines();
    //             setTimeout(() => {
    //                 resolve();
    //             }, 200);
    //         }, 500);
    //     })
    //     const main = await this.createGraphMainCanvas(format);
    //     const background = this.$backgroundDom ? await this.createGraphBackgroundCanvas(format) : null;
    //     const watermark = this.$watermarkDom ? await this.createGraphWatermarkCanvas(format) : null;
    //     const finalCanvas = this.mergeCanvas(background, main, watermark);
    //     // Restore original state
    //     this.dataProvider.updateOptions({
    //         canvasSize: {
    //             width: orign_width,
    //             height: orign_height
    //         },
    //         snapshotting: false
    //     });
    //     this.setZoom(orign_zoom);
    //     if (forceLayouting) {
    //         this.startAutoLayout();
    //     }
    //     this.clearLoading();
    //     this._dataUpdated();
    //     return finalCanvas;
    // }
    //
    // private mergeCanvas(canvasBg: HTMLCanvasElement | null, canvasMain: HTMLCanvasElement, canvasWatermark: HTMLCanvasElement | null) {
    //     const pixelRatio = window.devicePixelRatio; // 定义任意放大倍数 支持小数
    //     const canvas = document.createElement('canvas');
    //     const options = this.getOptions();
    //     const canvasElWidth = options.canvasSize.width;
    //     const canvasElHeight = options.canvasSize.height;
    //     canvas.width = canvasElWidth * pixelRatio; // 定义canvas 宽度 * 缩放
    //     canvas.height = canvasElHeight * pixelRatio; // 定义canvas高度 *缩放
    //     canvas.style.width = `${canvasElWidth}px`;
    //     canvas.style.height = `${canvasElHeight}px`;
    //     const ctx = canvas.getContext('2d')!;
    //     canvas.getContext('2d')!.scale(1, 1); // 获取context,设置scale
    //     if (canvasBg) {
    //         ctx.drawImage(canvasBg, 0, 0);
    //     } else {
    //         ctx.fillStyle = (!options.backgroundColor || options.backgroundColor === 'transparent') ? '#ffffff' : this.options.backgroundColor;
    //         ctx.fillRect(0, 0, canvas.width, canvas.height);
    //     }
    //     ctx.drawImage(canvasMain, 0, 0);
    //     if (canvasWatermark) {
    //         const box = this.$watermarkDom!.getBoundingClientRect();
    //         const watermarkElWidth = box.width; // 获取dom 宽度
    //         const watermarkElHeight = box.height; // 获取dom 宽度
    //         // console.log('this.$watermarkPosition:', this.$watermarkPosition, watermarkElWidth, watermarkElHeight);
    //         let x = canvasElWidth - watermarkElWidth - 20;
    //         let y = canvasElHeight - watermarkElHeight - 20;
    //         if (this.$watermarkPosition === 'bl') {
    //             x = 20;
    //             y = canvasElHeight - watermarkElHeight - 20;
    //         } else if (this.$watermarkPosition === 'tl') {
    //             x = 20;
    //             y = 20;
    //         } else if (this.$watermarkPosition === 'tr') {
    //             x = canvasElWidth - watermarkElWidth - 20;
    //             y = 20;
    //         }
    //         ctx.drawImage(canvasWatermark, x * pixelRatio, y * pixelRatio);
    //     }
    //     return canvas;
    // }
    //
    // private async createGraphBackgroundCanvas(format = 'png') {
    //     const pixelRatio = window.devicePixelRatio; // 定义任意放大倍数 支持小数
    //     const canvas = document.createElement('canvas'); // 创建一个canvas节点
    //     const options = this.getOptions();
    //     const canvasElWidth = options.canvasSize.width;
    //     const canvasElHeight = options.canvasSize.height;
    //     canvas.width = canvasElWidth * pixelRatio; // 定义canvas 宽度 * 缩放
    //     canvas.height = canvasElHeight * pixelRatio; // 定义canvas高度 *缩放
    //     canvas.style.width = `${canvasElWidth}px`;
    //     canvas.style.height = `${canvasElHeight}px`;
    //     canvas.getContext('2d')!.scale(pixelRatio, pixelRatio); // 获取context,设置scale
    //     const exportDom = this.$backgroundDom!;
    //     exportDom.style.width = options.canvasSize.width + 'px';
    //     exportDom.style.height = options.canvasSize.height + 'px';
    //     const opts = {
    //         backgroundColor: '#ffffff',
    //         scale: 1, // 添加的scale 参数
    //         canvas, // 自定义 canvas
    //         logging: true, // 日志开关，便于查看内部执行流程
    //         // windowWidth: _image_width,
    //         // windowHeight: _image_height,
    //         width: options.canvasSize.width, // dom 原始宽度
    //         height: options.canvasSize.height,
    //         // x: relationGraphPosition.left,
    //         // y: relationGraphPosition.top,
    //         useCORS: true // 【重要】开启跨域配置
    //     };
    //     const resultCanvas = await this.createImage(exportDom, opts, format, '');
    //     exportDom.style.width = '';
    //     exportDom.style.height = '';
    //     return resultCanvas;
    // }
    //
    // private async createGraphWatermarkCanvas(format = 'png') {
    //     const canvasElWidth = this.$canvasDom.clientWidth; // 获取dom 宽度
    //     const canvasElHeight = this.$canvasDom.clientHeight; // 获取dom 高度
    //     const pixelRatio = window.devicePixelRatio; // 定义任意放大倍数 支持小数
    //     const canvas = document.createElement('canvas'); // 创建一个canvas节点
    //     canvas.width = canvasElWidth * pixelRatio; // 定义canvas 宽度 * 缩放
    //     canvas.height = canvasElHeight * pixelRatio; // 定义canvas高度 *缩放
    //     canvas.style.width = `${canvasElWidth}px`;
    //     canvas.style.height = `${canvasElHeight}px`;
    //     canvas.getContext('2d')!.scale(pixelRatio, pixelRatio); // 获取context,设置scale
    //     const exportDom = this.$watermarkDom!;
    //     return await this.createImage(exportDom, opts, format, '');
    // }
    //
    // private async createGraphMainCanvas(format = 'png') {
    //     const options = this.getOptions();
    //     const orign_zoom = options.canvasZoom;
    //     const _origin_offset_x = options.canvasOffset.x;
    //     const _origin_offset_y = options.canvasOffset.y;
    //     this.dataProvider.clearChecked();
    //     this.setZoom(100);
    //     this.updateShouldRenderGraphData(true);
    //     await sleep(500);
    //     const exportDom = this.$canvasDom;
    //     let _min_x = 999999;
    //     let _min_y = 999999;
    //     let _max_x = -999999;
    //     let _max_y = -999999;
    //     this.getNodes().forEach(thisNode => {
    //         if (thisNode.x < _min_x) {
    //             _min_x = thisNode.x;
    //         }
    //         const nodeMaxX = thisNode.x + thisNode.el_W;
    //         if (nodeMaxX > _max_x) {
    //             _max_x = nodeMaxX;
    //         }
    //         const nodeMaxY = thisNode.y + thisNode.el_H;
    //         if (thisNode.y < _min_y) {
    //             _min_y = thisNode.y;
    //         }
    //         if (nodeMaxY > _max_y) {
    //             _max_y = nodeMaxY;
    //         }
    //     });
    //     const canvasSlotInfoMap = new WeakMap<Element, { offsetX: number, offsetY: number }>();
    //     const canvasSlotList = this.$dom.querySelectorAll('> .rg-map-canvas > .rg-canvas-slot');
    //     for (const canvasSlot of canvasSlotList) {
    //         // console.log('canvasSlot:', canvasSlot);
    //         let sub_min_x = 999999;
    //         let sub_min_y = 999999;
    //         let sub_max_x = -999999;
    //         let sub_max_y = -999999;
    //         for (const item of canvasSlot.children) {
    //             const itemEl = item as HTMLDivElement;
    //             const x = itemEl.offsetLeft;
    //             const y = itemEl.offsetTop;
    //             if (x < sub_min_x) sub_min_x = x;
    //             if (x > sub_max_x) sub_max_x = x + itemEl.offsetWidth;
    //             if (y < sub_min_y) sub_min_y = y;
    //             if (y > sub_max_y) sub_max_y = y + itemEl.offsetHeight;
    //         }
    //         if (sub_min_x < _min_x) _min_x = sub_min_x;
    //         if (sub_min_y < _min_y) _min_y = sub_min_y;
    //         if (sub_max_x > _max_x) _max_x = sub_max_x;
    //         if (sub_max_y > _max_y) _max_y = sub_max_y;
    //         if (sub_min_x !== 999999) canvasSlotInfoMap.set(canvasSlot, {
    //             offsetX: sub_min_x,
    //             offsetY: sub_min_y
    //         });
    //     }
    //     const _padding = 200;
    //     _min_x = _min_x - _padding;
    //     _min_y = _min_y - _padding;
    //     _max_x = _max_x + _padding;
    //     _max_y = _max_y + _padding;
    //     const nodeOffsetX = _min_x;
    //     const nodeOffsetY = _min_y;
    //     this.getNodes().forEach(thisNode => {
    //         thisNode.x = thisNode.x - nodeOffsetX;
    //         thisNode.y = thisNode.y - nodeOffsetY;
    //     });
    //     // console.log('All nodeOffsetY:', nodeOffsetX, nodeOffsetY);
    //     for (const canvasSlot of canvasSlotList) {
    //         // console.log('canvasSlot:', canvasSlot);
    //         const canvasSlotDiv = canvasSlot as HTMLDivElement;
    //         // const canvasSlotInfo = canvasSlotInfoMap.get(canvasSlot)!;
    //         canvasSlotDiv.style.marginLeft = (-nodeOffsetX) + 'px';
    //         canvasSlotDiv.style.marginTop = (-nodeOffsetY) + 'px';
    //         // console.log('item:new-x-y:', canvasSlotInfo.offsetX, canvasSlotInfo.offsetY);
    //     }
    //     this.updateElementLines();
    //     const elementLineSvgList = this.$canvasDom.querySelectorAll('.rg-lines-svg-el-lines');
    //     elementLineSvgList.forEach(canvasSlot => {
    //         const svgEl = canvasSlot as SVGElement;
    //         svgEl.style.width = '4000px';
    //         svgEl.style.height = '4000px';
    //     });
    //     const _image_width = _max_x - _min_x;
    //     const _image_height = _max_y - _min_y;
    //     this.dataProvider.updateOptions({
    //         canvasOffset: {x: 0, y: 0},
    //         canvasSize: {
    //             width: _image_width,
    //             height: _image_height
    //         }
    //     });
    //     const pixelRatio = window.devicePixelRatio; // 定义任意放大倍数 支持小数
    //     devLog('export image:', {
    //         _image_width,
    //         _image_height,
    //         _min_x,
    //         _min_y,
    //         _max_x,
    //         _max_y,
    //         devicePixelRatio: window.devicePixelRatio
    //     });
    //     // this.moveToCenter();
    //     // this.zoomToFit();
    //     // return;
    //     const canvas = document.createElement('canvas'); // 创建一个canvas节点
    //     const canvasElWidth = _image_width;
    //     const canvasElHeight = _image_height;
    //     canvas.width = canvasElWidth * pixelRatio; // 定义canvas 宽度 * 缩放
    //     canvas.height = canvasElHeight * pixelRatio; // 定义canvas高度 *缩放
    //     canvas.style.width = `${canvasElWidth}px`;
    //     canvas.style.height = `${canvasElHeight}px`;
    //     canvas.getContext('2d')!.scale(pixelRatio, pixelRatio); // 获取context,设置scale
    //     // canvas.style.backgroundColor = 'red';
    //     const opts = {
    //         backgroundColor: 'transparent',
    //         scale: 1, // 添加的scale 参数
    //         canvas, // 自定义 canvas
    //         logging: true, // 日志开关，便于查看内部执行流程
    //         // windowWidth: _image_width,
    //         // windowHeight: _image_height,
    //         width: _image_width, // dom 原始宽度
    //         height: _image_height,
    //         // x: relationGraphPosition.left,
    //         // y: relationGraphPosition.top,
    //         useCORS: true // 【重要】开启跨域配置
    //     };
    //     this._dataUpdated();
    //     await sleep(1000);
    //     const resultCanvas = await this.createImage(exportDom, opts, format, '');
    //     canvasSlotList.forEach(canvasSlot => {
    //         const canvasSlotDiv = canvasSlot as HTMLDivElement;
    //         canvasSlotDiv.style.marginLeft = '0px';
    //         canvasSlotDiv.style.marginTop = '0px';
    //     });
    //     this.getNodes().forEach(thisNode => {
    //         thisNode.x = thisNode.x + nodeOffsetX;
    //         thisNode.y = thisNode.y + nodeOffsetY;
    //     });
    //     elementLineSvgList.forEach(canvasSlot => {
    //         const svgEl = canvasSlot as SVGElement;
    //         svgEl.style.width = '1px';
    //         svgEl.style.height = '1px';
    //     });
    //     this.dataProvider.updateOptions({
    //         canvasOffset: {x: _origin_offset_x, y: _origin_offset_y}
    //     });
    //     this.setZoom(orign_zoom);
    //     return resultCanvas;
    // }
    //
    // async createImage(
    //     exportDom: HTMLDivElement,
    //     opts: any,
    //     format: string,
    //     fileName: string
    // ) {
    //     devLog('createImage:', opts);
    //     const customHtml2canvas = window.getHtml2canvas();
    //     if (!customHtml2canvas) {
    //         console.error('Please define function window.getHtml2canvas, Make sure you can get "html2canvas" through the following code: const html2canvas = window.getHtml2canvas();')
    //         return;
    //     }
    //     const canvas = await customHtml2canvas(exportDom, opts);
    //     return canvas;
    // }
    //
    // async getImageBase64(format = 'png') {
    //     throw new Error('getImageBase64 is deprecated, Please get dom and trans to image by yourself!');
    //     const canvas = await this.createGraphCanvas(format);
    //     const dom = document.body.appendChild(canvas);
    //     dom.style.display = 'none';
    //     const base64 = dom.toDataURL(`image/${format}`);
    //     document.body.removeChild(dom);
    //     return base64;
    // }
    //
    // async downloadCanvasImage(canvas: HTMLCanvasElement, format: string, fileName: string) {
    //     const canvasDom = document.body.appendChild(canvas);
    //     // devLog('canvas:', fileName, dom)
    //     canvasDom.style.display = 'none';
    //     const blob = this.dataURLToBlob(canvasDom.toDataURL(`image/${format}`));
    //     document.body.removeChild(canvasDom);
    //     const a = document.createElement('a');
    //     a.style.display = 'none';
    //     try {
    //         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //         // @ts-ignore
    //         if (window.navigator.msSaveOrOpenBlob) {
    //             // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //             // @ts-ignore
    //             window.navigator.msSaveOrOpenBlob(blob, `${fileName}.${format}`);
    //         } else {
    //             a.setAttribute('href', URL.createObjectURL(blob));
    //             a.setAttribute('download', `${fileName}.${format}`);
    //             document.body.appendChild(a);
    //             // devLog('click to download:', opts)
    //             a.click();
    //             devLog('click ok!');
    //             URL.revokeObjectURL(await blob.text());
    //             devLog('revokeObjectURL ok!');
    //             document.body.removeChild(a);
    //             devLog('removeChild ok!');
    //         }
    //     } catch (e) {
    //         devLog('[relation-graph]Create and download image error:', e);
    //     }
    // }
    //
    // dataURLToBlob(dataurl: string) { // ie 图片转格式
    //     try {
    //         const arr = dataurl.split(',');
    //         const arrItem1 = arr[0];
    //         const mime = arrItem1 && arrItem1.match(/:(.*?);/)![1];
    //         const bstr = atob(arr[1]);
    //         let n = bstr.length;
    //         const u8arr = new Uint8Array(n);
    //         while (n--) {
    //             u8arr[n] = bstr.charCodeAt(n);
    //         }
    //         return new Blob([u8arr], {type: mime});
    //     } catch (e) {
    //         console.error('[relation-graph]Create and download image error:dataURLToBlob:dataurl', dataurl);
    //         console.error('[relation-graph]error object', e);
    //     }
    // }
}
