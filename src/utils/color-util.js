export function HSVtoRGB(h, s, v, a) {
  let i, f, p1, p2, p3;
  let r = 0,
    g = 0,
    b = 0;
  if (s < 0) s = 0;
  if (s > 1) s = 1;
  if (v < 0) v = 0;
  if (v > 1) v = 1;
  h %= 360;
  if (h < 0) h += 360;
  h /= 60;
  i = Math.floor(h);
  f = h - i;
  p1 = v * (1 - s);
  p2 = v * (1 - s * f);
  p3 = v * (1 - s * (1 - f));
  switch (i) {
    case 0:
      r = v;
      g = p3;
      b = p1;
      break;
    case 1:
      r = p2;
      g = v;
      b = p1;
      break;
    case 2:
      r = p1;
      g = v;
      b = p3;
      break;
    case 3:
      r = p1;
      g = p2;
      b = v;
      break;
    case 4:
      r = p3;
      g = p1;
      b = v;
      break;
    case 5:
      r = v;
      g = p1;
      b = p2;
      break;
  }
  if (a && a < 1)
    return (
      "rgba(" +
      Math.round(r * 255) +
      ", " +
      Math.round(g * 255) +
      ", " +
      Math.round(b * 255) +
      ", " +
      a +
      ")"
    );
  else
    return (
      "rgb(" +
      Math.round(r * 255) +
      ", " +
      Math.round(g * 255) +
      ", " +
      Math.round(b * 255) +
      ")"
    );
}

export function HexToRgb(hex) {
  let hexNum = hex.substring(1);
  let a = 1;
  if (hexNum.length < 6) {
    hexNum = repeatLetter(hexNum, 2);
  } else if (hexNum.length == 8) {
    a = ("0x" + hexNum) & "0xff";
    a = Number(((a / 255) * 1).toFixed(2));
    hexNum = hexNum.substring(0, 6);
  }
  hexNum = "0x" + hexNum;
  let r = hexNum >> 16;
  let g = (hexNum >> 8) & "0xff";
  let b = hexNum & "0xff";
  return {
    red: r,
    green: g,
    blue: b,
    alpha: a,
  };

  function repeatWord(word, num) {
    let result = "";
    for (let i = 0; i < num; i++) {
      result += word;
    }
    return result;
  }
  function repeatLetter(word, num) {
    let result = "";
    for (let letter of word) {
      result += repeatWord(letter, num);
    }
    return result;
  }
}

export function RgbToHsv(R, G, B, A) {
  R /= 255;
  G /= 255;
  B /= 255;
  const max = Math.max(R, G, B);
  const min = Math.min(R, G, B);
  const range = max - min;
  let V = max;
  let S = V === 0 ? 0 : range / V;
  let H = 0;
  if (R === V) H = (60 * (G - B)) / range;
  if (G === V) H = 120 + (60 * (B - R)) / range;
  if (B === V) H = 240 + (60 * (R - G)) / range;

  if (range === 0) H = 0;
  if (H < 0) H += 360;
  H = H / 2 / 180;
  H = Number(H.toFixed(4));
  S = Number(S.toFixed(4));
  V = Number(V.toFixed(4));
  // S *= 255
  // V *= 255
  return [H, S, V, A];
}
