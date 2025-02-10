function getD(balances: bigint[], amp: bigint): bigint {
  const A_PRECISION = 100n;
  const N_COINS = BigInt(balances.length);
  let S = balances.reduce((a, b) => a + b, 0n);
  if (S === 0n) return 0n;

  let D = S;
  let ANN = amp * N_COINS;
  for (let _ = 0; _ < 255; ++_) {
    let DP = D;
    for (const x of balances) DP = (DP * D) / x;
    DP /= N_COINS ** N_COINS;
    let DPrev = D;
    D =
      (((ANN * S) / A_PRECISION + DP * N_COINS) * D) / (((ANN - A_PRECISION) * D) / A_PRECISION + (N_COINS + 1n) * DP);
    if (D > DPrev && D - DPrev <= 1n) return D;
    if (D <= DPrev && DPrev - D <= 1n) return D;
  }
  return -1n;
}

export function getPrice(balances: bigint[], amp: bigint): bigint {
  const A_PRECISION = 100n;
  const D = getD(balances, amp);
  const N_COINS = BigInt(balances.length);
  const ANN = amp * N_COINS;
  let Dr = D / N_COINS ** N_COINS;
  for (const x of balances) {
    Dr = (Dr * D) / x;
  }
  const xp0_A = (ANN * balances[0]) / A_PRECISION;
  return (10n ** 18n * (xp0_A + (Dr * balances[0]) / balances[1])) / (xp0_A + Dr);
}

function newtonY(b: bigint, c: bigint, D: bigint, initY: bigint): bigint {
  let y_prev = 0n;
  let y = initY;

  for (let _ = 0; _ < 255; ++_) {
    y_prev = y;
    y = (y * y + c) / (2n * y + b - D);
    if (y > y_prev && y - y_prev <= 1n) return y;
    if (y <= y_prev && y_prev - y <= 1n) return y;
  }
  return -1n;
}

function getY(indexIn: number, indexOut: number, newX: bigint, xp: bigint[], amp: bigint, D: bigint): bigint {
  const A_PRECISION = 100n;
  const N_COINS = BigInt(xp.length);
  const Ann = amp * N_COINS;
  let S = 0n;
  let c = D;
  const oldX = xp[indexIn];
  xp[indexIn] = newX;
  for (let i = 0; i < xp.length; ++i) {
    if (i === indexOut) continue;
    S += xp[i];
    c = (c * D) / (xp[i] * N_COINS);
  }
  xp[indexIn] = oldX;

  c = (c * D * A_PRECISION) / (Ann * N_COINS);
  const b = S + (D * A_PRECISION) / Ann;
  return newtonY(b, c, D, D);
}

function dynamicFee(xpi: bigint, xpj: bigint, _fee: bigint, _fee_multiplier: bigint): bigint {
  const FEE_DENOMINATOR = 10n ** 10n;
  if (_fee_multiplier <= FEE_DENOMINATOR) return _fee;

  const xps2 = (xpi + xpj) ** 2n;
  return (_fee_multiplier * _fee) / (((_fee_multiplier - FEE_DENOMINATOR) * 4n * xpi * xpj) / xps2 + FEE_DENOMINATOR);
}

export function getDy(
  balances: bigint[],
  rates: bigint[],
  amp: bigint,
  baseFee: bigint,
  offpegFeeMultiplier: bigint,
  indexIn: number,
  indexOut: number,
  dx: bigint,
): bigint {
  const FEE_DENOMINATOR = 10n ** 10n;
  const xp: bigint[] = new Array(balances.length);
  for (let i = 0; i < balances.length; ++i) {
    xp[i] = balances[i] * rates[i];
  }
  const D = getD(xp, amp);
  const newX = xp[indexIn] + dx * rates[indexIn];
  const y = getY(indexIn, indexOut, newX, xp, amp, D);
  const dy = xp[indexOut] - y - 1n;
  const fee =
    (dynamicFee((xp[indexIn] + newX) / 2n, (xp[indexOut] + y) / 2n, baseFee, offpegFeeMultiplier) * dy) /
    FEE_DENOMINATOR;

  return (dy - fee) / rates[indexOut];
}
