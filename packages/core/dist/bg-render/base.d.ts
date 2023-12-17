import { Disposable, HasElement } from "../interfaces";
export declare abstract class AbstractBaseRenderer implements Disposable, HasElement {
    /**
     * 修改背景的流动速度，数字越大越快，默认为 2
     * @param speed 背景的流动速度，默认为 2
     */
    abstract setFlowSpeed(speed: number): void;
    /**
     * 修改背景的渲染比例，默认是 0.5
     *
     * 一般情况下这个程度既没有明显瑕疵也不会特别吃性能
     * @param scale 背景的渲染比例
     */
    abstract setRenderScale(scale: number): void;
    /**
     * 是否启用静态模式，即图片在更换后就会保持静止状态并禁用更新，以节省性能
     * @param enable 是否启用静态模式
     */
    abstract setStaticMode(enable: boolean): void;
    /**
     * 修改背景动画帧率，默认是 30 FPS
     *
     * 如果设置成 0 则会停止动画
     * @param fps 目标帧率，默认 30 FPS
     */
    abstract setFPS(fps: number): void;
    /**
     * 暂停背景动画，画面即便是更新了图片也不会发生变化
     */
    abstract pause(): void;
    /**
     * 恢复播放背景动画
     */
    abstract resume(): void;
    /**
     * 设置背景专辑图片，图片材质加载并设置完成后会返回
     * @param albumUrl 图片的目标链接
     */
    abstract setAlbumImage(albumUrl: string): Promise<void>;
    /**
     * 设置低频的音量大小，范围在 80hz-120hz 之间为宜，取值范围在 [0.0-1.0] 之间
     *
     * 部分渲染器会根据音量大小调整背景效果（例如根据鼓点跳动）
     *
     * 如果无法获取到类似的数据，请传入 1.0 作为默认值，或不做任何处理（默认值即 1.0）
     * @param volume 低频的音量大小，范围在 50hz-120hz 之间为宜，取值范围在 [0.0-1.0] 之间
     */
    abstract setLowFreqVolume(volume: number): void;
    abstract dispose(): void;
    abstract getElement(): HTMLElement;
}
export declare abstract class BaseRenderer extends AbstractBaseRenderer {
    protected canvas: HTMLCanvasElement;
    private observer;
    protected flowSpeed: number;
    protected currerntRenderScale: number;
    constructor(canvas: HTMLCanvasElement);
    setRenderScale(scale: number): void;
    /**
     * 当画板元素大小发生变化时此函数会被调用
     * 可以在此处重设和渲染器相关的尺寸设置
     * 考虑到初始化的时候元素不一定在文档中或出于某些特殊样式状态，尺寸长宽有可能会为 0，请注意进行特判处理
     * @param width 画板元素实际的物理像素宽度，有可能为 0
     * @param height 画板元素实际的物理像素高度，有可能为 0
     */
    protected onResize(width: number, height: number): void;
    /**
     * 修改背景的流动速度，数字越大越快，默认为 2
     * @param speed 背景的流动速度，默认为 2
     */
    setFlowSpeed(speed: number): void;
    /**
     * 是否启用静态模式，即图片在更换后就会保持静止状态并禁用更新，以节省性能
     * @param enable 是否启用静态模式
     */
    abstract setStaticMode(enable: boolean): void;
    /**
     * 修改背景动画帧率，默认是 30 FPS
     *
     * 如果设置成 0 则会停止动画
     * @param fps 目标帧率，默认 30 FPS
     */
    abstract setFPS(fps: number): void;
    /**
     * 暂停背景动画，画面即便是更新了图片也不会发生变化
     */
    abstract pause(): void;
    /**
     * 恢复播放背景动画
     */
    abstract resume(): void;
    /**
     * 设置背景专辑图片，图片材质加载并设置完成后会返回
     * @param albumUrl 图片的目标链接
     */
    abstract setAlbumImage(albumUrl: string): Promise<void>;
    dispose(): void;
}
