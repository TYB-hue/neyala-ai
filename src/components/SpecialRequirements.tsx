'use client';

import React from 'react';
import { 
  UtensilsCrossed,
  Accessibility,
  Baby,
  PawPrint,
  HeartPulse,
  Leaf
} from 'lucide-react';

interface SpecialRequirementsProps {
  selectedRequirements: string[];
  onRequirementChange: (requirement: string) => void;
}

export default function SpecialRequirements({ selectedRequirements, onRequirementChange }: SpecialRequirementsProps) {
  const requirements = [
    {
      id: 'halal',
      label: 'Halal Food Required',
      icon: UtensilsCrossed,
      iconColor: 'text-amber-500'
    },
    {
      id: 'wheelchair',
      label: 'Wheelchair Accessibility Needed',
      icon: Accessibility,
      iconColor: 'text-blue-600'
    },
    {
      id: 'pregnancy',
      label: 'Pregnancy-Friendly Options',
      icon: Baby,
      iconColor: 'text-pink-500'
    },
    {
      id: 'pet-friendly',
      label: 'Pet-Friendly Accommodations',
      icon: PawPrint,
      iconColor: 'text-orange-500'
    },
    {
      id: 'medical',
      label: 'Medical Assistance Available',
      icon: HeartPulse,
      iconColor: 'text-red-500'
    },
    {
      id: 'vegetarian',
      label: 'Vegetarian/Vegan Food Options',
      icon: Leaf,
      iconColor: 'text-green-500'
    }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6">Special Requirements</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requirements.map((requirement) => {
          const isSelected = selectedRequirements.includes(requirement.id);
          const Icon = requirement.icon;
          
          return (
            <div
              key={requirement.id}
              onClick={() => onRequirementChange(requirement.id)}
              className={`flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer ${
                isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <input 
                type="checkbox" 
                checked={isSelected}
                readOnly
                className="h-5 w-5 text-blue-500 rounded border-gray-300 focus:ring-blue-500 pointer-events-none"
              />
              <Icon className={`h-6 w-6 ${requirement.iconColor}`} />
              <label className="flex-grow font-medium cursor-pointer">
                {requirement.label}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
} 