import { EasingFunction, EasingFunctionEnum } from '../types';

const easeInQuad: EasingFunction = (t: number) => t * t;

const easeOutQuad: EasingFunction = (t: number) => t * (2 - t);

const easeInOutQuad: EasingFunction = (t: number) =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

const easeInOutCubic: EasingFunction = (t: number) =>
  t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

const easeOutExpo: EasingFunction = (t: number) =>
  t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

const EasingFunctionMap: Record<EasingFunctionEnum, EasingFunction> = {
  [EasingFunctionEnum.easeInQuad]: easeInQuad,
  [EasingFunctionEnum.easeInOutQuad]: easeInOutQuad,
  [EasingFunctionEnum.easeOutQuad]: easeOutQuad,
  [EasingFunctionEnum.easeInOutCubic]: easeInOutCubic,
  [EasingFunctionEnum.easeOutExpo]: easeOutExpo,
};

export default function smoothScrollTo(
  container: HTMLDivElement,
  target: HTMLDivElement,
  bias = 0,
  easingType = EasingFunctionEnum.easeInOutQuad,
) {
  return new Promise<boolean>((resolve, reject) => {
    const targetOffset = target?.offsetTop - container?.offsetTop - bias;
    const startOffset = container?.scrollTop;
    const distance = targetOffset - startOffset;
    const duration = 500;
    let startTime: null | number = null;
    function scrollStep(timestamp: number) {
      if (!startTime) {
        startTime = timestamp;
      }
      const progress = timestamp - startTime;
      const percent = Math.min(progress / duration, 1);
      if (container) {
        container.scrollTop =
          startOffset + distance * EasingFunctionMap[easingType](percent);
      }
      if (progress < duration) {
        window.requestAnimationFrame(scrollStep);
      } else {
        resolve(true);
      }
    }
    window.requestAnimationFrame(scrollStep);
  });
}
