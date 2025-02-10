import { BytesLike, ethers, Result } from "ethers";

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function same(x: string, y: string): boolean {
  return x.toLowerCase() === y.toLowerCase();
}

export function abiEncode(types: Array<string>, args: Array<any>): string {
  return ethers.AbiCoder.defaultAbiCoder().encode(types, args);
}

export function abiDecode(types: Array<string>, data: BytesLike): Result {
  return ethers.AbiCoder.defaultAbiCoder().decode(types, data);
}
