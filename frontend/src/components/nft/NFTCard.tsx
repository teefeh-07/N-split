// NFT Card Component

'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import type { NFT } from '@/types/contracts';
import { formatCurrency } from '@/lib/utils/format';

interface NFTCardProps {
  nft: NFT;
  onBuy?: () => void;
}

export function NFTCard({ nft, onBuy }: NFTCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square relative bg-gray-100">
        <Image
          src={nft.uri || '/placeholder.png'}
          alt={`NFT #${nft.id}`}
          fill
          className="object-cover"
        />
        {nft.isListed && (
          <Badge variant="success" className="absolute top-2 right-2">
            For Sale
          </Badge>
        )}
      </div>
      <CardContent>
        <h3 className="font-semibold text-gray-900">NFT #{nft.id}</h3>
        {nft.price && (
          <p className="text-indigo-600 font-medium mt-1">
            {formatCurrency(nft.price / 1_000_000)} STX
          </p>
        )}
      </CardContent>
      {nft.isListed && onBuy && (
        <CardFooter>
          <Button onClick={onBuy} className="w-full">Buy Now</Button>
        </CardFooter>
      )}
    </Card>
  );
}
