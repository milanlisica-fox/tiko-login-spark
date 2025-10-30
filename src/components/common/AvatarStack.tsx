import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type AvatarStackProps = {
  count: number;
  seedPrefix?: string;
  size?: number;
};

export default function AvatarStack({ count, seedPrefix = "avatar", size = 24 }: AvatarStackProps) {
  const items = Array.from({ length: count });
  return (
    <div className="flex -space-x-2">
      {items.map((_, a) => {
        const seed = `${seedPrefix}_${a}`;
        return (
          <Avatar key={a} className="border-2 border-white" style={{ width: size, height: size }}>
            <AvatarImage src={`https://api.dicebear.com/7.x/personas/png?seed=${seed}&size=64`} alt={`Avatar ${a + 1}`} />
            <AvatarFallback className="text-xs bg-gradient-to-br from-blue-200 to-blue-300">
              {String.fromCharCode(65 + a)}
            </AvatarFallback>
          </Avatar>
        );
      })}
    </div>
  );
}


