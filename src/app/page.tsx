'use client'

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');

  const cameras = [...Array(10)].map((_, index) => ({
    id: index + 1,
    name: `Camera ${index + 1}`,
    image: `/images/camera${index + 1}.jpg`
  }));

  const filteredCameras = cameras.filter(camera =>
    camera.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Camera Management</h1>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search cameras..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCameras.map((camera) => (
            <div key={camera.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="aspect-video bg-gray-200 relative">
                <Image
                  src={camera.image}
                  alt={`Feed from ${camera.name}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900">{camera.name}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}