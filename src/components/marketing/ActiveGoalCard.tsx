"use client";

import { Card, CardContent } from "@/src/components/ui/card";
import { Progress } from "@/src/components/ui/progress";
import { Laptop } from "lucide-react";

interface ActiveGoalCardProps {
  productName: string;
  currentAmount: number;
  targetAmount: number;
  progress: number;
  className?: string;
}

export function ActiveGoalCard({
  productName,
  currentAmount,
  targetAmount,
  progress,
  className,
}: ActiveGoalCardProps) {
  return (
    <Card className={`bg-white border-none shadow-md rounded-tl-[30px] rounded-br-[30px] ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-[#ffce31] rounded-[23px] p-6 flex items-center justify-center min-w-[104px] h-[103px]">
            <div className="text-center">
              <div className="text-4xl font-bold text-white">{progress}%</div>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Laptop className="h-5 w-5 text-[#1a53c8]" />
              <h3 className="text-xl font-semibold text-black">{productName}</h3>
            </div>
            <div className="space-y-1">
              <div className="text-lg text-black">
                <span className="font-normal">GH¢{currentAmount.toLocaleString()} of </span>
                <span className="font-bold">GH¢{targetAmount.toLocaleString()}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

