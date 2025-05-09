
import React from 'react';
import { Card } from "@/components/ui/card";

interface TrafficInfoCardProps {
  title: string;
  value: string;
  color: string;
  description: string;
}

const TrafficInfoCard: React.FC<TrafficInfoCardProps> = ({ title, value, color, description }) => {
  return (
    <div className="neo-card p-4 border-white/5">
      <h3 className="text-sm font-medium text-gray-400">{title}</h3>
      <div className={`text-2xl font-bold mt-2 ${color}`}>{value}</div>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  );
};

export default TrafficInfoCard;
