import {sitePath} from './site-path';

const holdMs = 4000;
const glitchFrameMs = 48;
const glitchFrames = 4;
const framesPerSlide = glitchFrames + 1;

export function createIntroSignal(screen: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const {width, height} = screen;
  const makeFrame = () => {
    const frame = document.createElement('canvas');
    frame.width = width;
    frame.height = height;
    return frame;
  };

  const title = makeFrame();
  title.getContext('2d')!.drawImage(screen, 0, 0);
  const portrait = makeFrame();
  const image = new Image();
  let ready = false;
  let started: number | undefined;

  image.onload = () => {
    const frame = portrait.getContext('2d')!;
    const glow = frame.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, 590);
    glow.addColorStop(0, '#35412b');
    glow.addColorStop(1, '#111a16');
    frame.fillStyle = glow;
    frame.fillRect(0, 0, width, height);

    const size = height * .71;
    // Screen blending lets the cutout's black background disappear into the CRT glow.
    frame.globalCompositeOperation = 'screen';
    frame.drawImage(image, (width - size) / 2, (height - size) / 2 - 6, size, size);
    frame.globalCompositeOperation = 'source-over';

    frame.textAlign = 'center';
    frame.fillStyle = '#b49a71';
    frame.font = '14px monospace';
    frame.fillText('P—01     •     EXPLORATIONS SINCE 2020', width / 2, 74);
    frame.fillText('CODE / DATA / PHOTOGRAPHS', width / 2, height - 68);
    frame.fillStyle = '#00000022';
    for (let y = 0; y < height; y += 4) frame.fillRect(0, y, width, 1);
    ready = true;
  };
  image.src = sitePath('/crt-portrait.png');

  function frameAt(time: number, paused: boolean) {
    if (paused || !ready) {
      started = undefined;
      return 0;
    }

    started ??= time;
    const elapsed = time - started;
    const slide = Math.floor(elapsed / holdMs);
    const step = Math.floor((elapsed % holdMs) / glitchFrameMs);
    const glitch = slide > 0 && step < glitchFrames ? step + 1 : 0;
    return (slide % 2) * framesPerSlide + glitch;
  }

  function paint(key: number) {
    const showsPortrait = key >= framesPerSlide;
    const incoming = showsPortrait ? portrait : title;
    const outgoing = showsPortrait ? title : portrait;
    const glitch = key % framesPerSlide;
    ctx.drawImage(incoming, 0, 0);
    if (!glitch) return;

    // Brief horizontal tracking errors carry pieces of the previous frame across the cut.
    for (let band = 0; band < 7; band++) {
      const y = (band * 113 + glitch * 53) % (height - 32);
      const stripHeight = 8 + ((band + glitch) % 4) * 8;
      const shift = (band % 2 ? -1 : 1) * (24 + band * 5) * (5 - glitch) / 4;
      const source = (band + glitch) % 3 === 0 ? outgoing : incoming;
      ctx.drawImage(source, 0, y, width, stripHeight, shift, y, width, stripHeight);
      ctx.fillStyle = band % 2 ? '#8a9c6750' : '#c89e683f';
      ctx.fillRect(0, y, width, 2);
    }
  }

  return {
    frameAt,
    paint,
    reset: () => { started = undefined; },
    dispose: () => { image.onload = null; },
  };
}
