import type { Interface, Result } from "ethers";
import type { Multicall3 } from "../types";

export const MULTICALL_ADDRESS = "0xcA11bde05977b3631167028862bE2a173976CA11";

export interface ContractCall {
  interface: Interface;
  address: string;
  method: string;
  parameters: Array<any>;
  callback?: (result: Result) => void;
}

export interface GroupContractCall {
  interface: Interface;
  address: string;
  method: string;
  parameters: Array<any>;
  group: string;
  reference: string;
}

async function fetchChunk(
  multicall: Multicall3,
  chunk: Array<Multicall3.CallStruct>,
  height?: number,
): Promise<{ blockNumber: number; results: Array<string> }> {
  let returnData: Array<string>;
  let blockNumber: bigint;
  try {
    [blockNumber, returnData] = await multicall.aggregate.staticCall(chunk, { blockTag: height });
  } catch (error) {
    console.debug("Failed to fetch chunk inside retry", error);
    throw error;
  }
  return {
    blockNumber: Number(blockNumber),
    results: returnData,
  };
}

export async function useMulticall(
  multicall: Multicall3,
  calls: Array<ContractCall>,
  height?: number,
): Promise<[number, Array<Result>]> {
  const rawCalls = calls.map<Multicall3.CallStruct>((call) => {
    const fragment = call.interface.getFunction(call.method);
    const data = call.interface.encodeFunctionData(fragment!, call.parameters);
    return {
      target: call.address,
      callData: data,
    };
  });

  const { blockNumber, results } = await fetchChunk(multicall, rawCalls, height);
  return [
    blockNumber,
    results.map((data, i) => {
      const call = calls[i];
      const fragment = call.interface.getFunction(call.method);
      const result = call.interface.decodeFunctionResult(fragment!, data);
      if (call.callback) {
        call.callback(result);
      }
      return result;
    }),
  ];
}

export async function useGroupMulticall(
  multicall: Multicall3,
  calls: Array<GroupContractCall>,
): Promise<[number, Record<string, Record<string, Result>>]> {
  const rawCalls = calls.map<Multicall3.CallStruct>((call) => {
    const fragment = call.interface.getFunction(call.method);
    const data = call.interface.encodeFunctionData(fragment!, call.parameters);
    return {
      target: call.address,
      callData: data,
    };
  });
  const { blockNumber, results } = await fetchChunk(multicall, rawCalls);
  const r: Record<string, Record<string, Result>> = {};
  calls.forEach((call, index) => {
    const fragment = call.interface.getFunction(call.method);
    if (r[call.group] === undefined) {
      r[call.group] = {};
    }
    r[call.group][call.reference] = call.interface.decodeFunctionResult(fragment!, results[index]);
  });
  return [blockNumber, r];
}
