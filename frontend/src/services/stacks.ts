// Stacks Service

import api from './api';

export async function getAccountInfo(address: string) {
  const response = await api.get(`/v2/accounts/${address}`);
  return response.data;
}

