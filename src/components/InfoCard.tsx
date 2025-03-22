import React from "react";

const InfoCard: React.FC<{
  label: string;
  value?: string | number;
  icon: string;
}> = ({ label, value, icon }) => (
  <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg shadow">
    <span className="text-xl">{icon}</span>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-semibold">{value || "N/A"}</p>
    </div>
  </div>
);

export default InfoCard;