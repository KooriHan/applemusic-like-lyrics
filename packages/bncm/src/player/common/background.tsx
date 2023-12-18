import { useAtomValue } from "jotai";
import { useState, type FC, useEffect } from "react";
import {
	backgroundStaticModeAtom,
	backgroundTypeAtom,
	enableBackgroundAtom,
	backgroundCustomSolidColorAtom,
	BackgroundType,
	backgroundMaxFPSAtom,
	backgroundRenderScaleAtom,
} from "../../components/config/atoms";
import {
	ConnectionColor,
	wsConnectionStatusAtom,
} from "../../music-context/ws-states";
import { BackgroundRender } from "@applemusic-like-lyrics/react";
import {
	displayMusicCoverAtom,
	lyricPageOpenedAtom,
} from "../../music-context/wrapper";
import "./background.sass";
import { EplorRenderer } from "@applemusic-like-lyrics/core";
import { fftDataAtom } from "./fft-context";
import { globalStore } from "../../injector";

export const Background: FC = () => {
	const enableBackground = useAtomValue(enableBackgroundAtom);
	const lyricPageOpened = useAtomValue(lyricPageOpenedAtom);
	const musicCoverUrl = useAtomValue(displayMusicCoverAtom);
	const backgroundMaxFPS = useAtomValue(backgroundMaxFPSAtom);
	const backgroundRenderScale = useAtomValue(backgroundRenderScaleAtom);
	const backgroundCustomSolidColor = useAtomValue(
		backgroundCustomSolidColorAtom,
	);
	const wsStatus = useAtomValue(wsConnectionStatusAtom);
	const backgroundFakeLiquidStaticMode = useAtomValue(backgroundStaticModeAtom);
	const backgroundType = useAtomValue(backgroundTypeAtom);
	const [lowFreqVolume, setLowFreqVolume] = useState(1);
	
	useEffect(() => {
		let maxValue = 1;
		let curValue = 1;
		
		let stopped = false;
		let lt = 0;
		const onFrame = (dt: number) => {
			if (stopped) return;
			// const delta = dt - lt;
			
			const value = globalStore.get(fftDataAtom)[0] ?? 1;
			setLowFreqVolume(curValue / maxValue);
			
			maxValue = (maxValue * 99 + Math.max(maxValue, curValue * 2, 1)) / 100;
			curValue = (curValue * 9 + value) / 10;
			
			requestAnimationFrame(onFrame);
			lt = dt;
		};
		
		onFrame(0);
		
		return () => {
			stopped = true;
		}
	}, [wsStatus.color, enableBackground, backgroundType])
	
	if (wsStatus.color !== ConnectionColor.Active && enableBackground) {
		if (
			backgroundType === BackgroundType.FakeLiquid ||
			backgroundType === BackgroundType.LiquidEplor
		) {
			return (
				<>
				<BackgroundRender
					className="amll-background-render-wrapper"
					staticMode={backgroundFakeLiquidStaticMode}
					disabled={!lyricPageOpened}
					albumImageUrl={musicCoverUrl}
					fps={backgroundMaxFPS}
					lowFreqVolume={lowFreqVolume}
					renderScale={backgroundRenderScale}
					renderer={
						backgroundType === BackgroundType.LiquidEplor
							? EplorRenderer
							: undefined
					}
				/>
				<span>{lowFreqVolume}</span>
				</>
			);
		} else if (backgroundType === BackgroundType.CustomSolidColor) {
			return (
				<div
					style={{
						gridColumn: "1 / 3",
						gridRow: "1 / 7",
						position: "absolute",
						width: "100%",
						height: "100%",
						pointerEvents: "none",
						background: backgroundCustomSolidColor,
						zIndex: "-1",
					}}
				/>
			);
		}
	}
	return null;
};
