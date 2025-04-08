
import { useState } from 'react';
import CircuitsList from '@/components/circuits/CircuitsList';

export default function CircuitsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Circuit Management</h1>
        <p className="text-gray-500">
          Create and manage document workflow circuits
        </p>
      </div>
      
      <CircuitsList />
    </div>
  );
}
