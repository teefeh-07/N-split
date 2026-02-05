// IPFS Service

const IPFS_GATEWAY = 'https://ipfs.io/ipfs/';

export async function uploadToIPFS(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  // Using public IPFS pinning service
  const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
    },
    body: formData,
  });

  const data = await response.json();
  return data.IpfsHash;
}

export function getIPFSUrl(hash: string): string {
  return `${IPFS_GATEWAY}${hash}`;
}

export async function uploadJSONToIPFS(data: object): Promise<string> {
  const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  return result.IpfsHash;
}
