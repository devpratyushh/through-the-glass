export const chapterStarts = [0, .16, .35, .53, .68, .83];
export const chapterPositions = [.025, .235, .445, .59, .77, .935];

export function chapterAt(progress: number) {
  for (let i = chapterStarts.length - 1; i > 0; i--) {
    if (progress >= chapterStarts[i]) return i;
  }
  return 0;
}

export function journeyDistance(section: HTMLElement, stage: HTMLElement) {
  return Math.max(1, section.offsetHeight - stage.clientHeight);
}
