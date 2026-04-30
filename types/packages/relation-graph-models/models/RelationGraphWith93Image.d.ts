import { RelationGraphWith92MiniView } from './RelationGraphWith92MiniView';
/**
 * API methods related to generating images in the relation-graph component,
 * - The methods here are just to prepare for generating images, making the dom reach a state suitable for generating images, and then letting the user get the dom and call third-party libraries to generate images
 * - Specific content includes: setting watermark dom, setting background dom, moving canvas position, adjusting node positions as necessary, adjusting canvas size, etc.
 */
export declare class RelationGraphWith93Image extends RelationGraphWith92MiniView {
    constructor();
    private $watermarkDom;
    private $watermarkPosition;
    private $backgroundDom;
    /**
     * Set the watermark dom element, which will be automatically called when using the <RGWatermark> component to set the watermark dom
     * - Note that this is an internal method, please do not use it externally
     * @inner
     */
    setWatermarkDom(watermarkDom: HTMLDivElement | null, forImage?: boolean, forDisplay?: boolean, position?: string): void;
    private _originBackgroundColor;
    /**
     * Set the background dom element, which will be automatically called when using the <RGBackground> component to set the background dom
     * - Note that this is an internal method, please do not use it externally
     * @inner
     */
    setBackgroundDom(backgroundDom: HTMLDivElement | null, forImage?: boolean, forDisplay?: boolean): void;
    /**
     * Switch to a state suitable for generating images, allowing relation-graph to enter a state suitable for generating images
     * - Note that this is an asynchronous method
     * @return Returns the dom element used to generate the image
     *
     */
    prepareForImageGeneration(): Promise<HTMLElement>;
    private graphStatusBeforeImageGeneration;
    /**
     * After the image is generated, let relation-graph return to the previous state
     */
    restoreAfterImageGeneration(): Promise<void>;
    private moveItemsAndFitContent;
}
