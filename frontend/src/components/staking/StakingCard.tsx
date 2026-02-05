// Staking Card Component

'use client';

import { Card, CardHeader, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Progress } from '../ui/Progress';
import { StatCard } from '../ui/StatCard';
import type { StakePosition } from '@/types/contracts';
import { formatTokenAmount } from '@/lib/utils/format';

interface StakingCardProps {
  position: StakePosition;
  onUnstake: () => void;
  onClaimRewards: () => void;
}

export function StakingCard({ position, onUnstake, onClaimRewards }: StakingCardProps) {
  const stakedAmount = formatTokenAmount(position.amount, 6);
  const rewards = formatTokenAmount(position.rewards, 6);

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Your Stake</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <StatCard title="Staked Amount" value={`${stakedAmount} STX`} />
          <StatCard title="Pending Rewards" value={`${rewards} STX`} />
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-2">Lock Progress</p>
          <Progress value={65} showLabel />
        </div>
      </CardContent>
      <CardFooter className="flex gap-3">
        <Button onClick={onClaimRewards} variant="primary">Claim Rewards</Button>
        <Button onClick={onUnstake} variant="outline">Unstake</Button>
      </CardFooter>
    </Card>
  );
}
