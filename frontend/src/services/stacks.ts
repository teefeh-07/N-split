// Stacks Service

import api from './api';

export async function getAccountInfo(address: string) {
  const response = await api.get(`/v2/accounts/${address}`);
  return response.data;
}

export async function getBalance(address: string) {
  const response = await api.get(`/extended/v1/address/${address}/balances`);
  return response.data;
}

export async function getTransaction(txId: string) {
  const response = await api.get(`/extended/v1/tx/${txId}`);
  return response.data;
}

