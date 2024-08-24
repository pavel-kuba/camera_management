'use client'

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

const DragDropContext = dynamic(
  () => import('react-beautiful-dnd').then(mod => mod.DragDropContext),
  { ssr: false }
);

function getRandomImage() {
  return `/images/camera${Math.floor(Math.random() * 10) + 1}.jpg`;
}

function createCameras(count: number, prefix: string) {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-${i + 1}`,
    name: `${prefix} Camera ${i + 1}`,
    image: getRandomImage(),
    cloudRecording: Math.random() > 0.2,
    licensePlateDetection: Math.random() > 0.5
  }));
}

type Camera = {
  id: string;
  name: string;
  image: string;
  cloudRecording: boolean;
  licensePlateDetection: boolean;
};

type Location = {
  id: string;
  name: string;
  cameras: Camera[];
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocations([
      { id: 'home', name: 'Home', cameras: createCameras(20, 'Home') },
      { id: 'office', name: 'Office', cameras: createCameras(20, 'Office') },
      { id: 'warehouse', name: 'Warehouse', cameras: createCameras(20, 'Warehouse') },
      { id: 'retail', name: 'Retail Store', cameras: createCameras(20, 'Store') },
    ]);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedCamera) {
        setSelectedCamera(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedCamera]);

  const onDragEnd = useCallback((result: DropResult) => {
    const { source, destination } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    setLocations(prevLocations => {
      const newLocations = Array.from(prevLocations);
      const sourceLocation = newLocations.find(loc => loc.id === source.droppableId);
      const destLocation = newLocations.find(loc => loc.id === destination.droppableId);

      if (!sourceLocation || !destLocation) {
        return prevLocations;
      }

      const [draggedCamera] = sourceLocation.cameras.splice(source.index, 1);
      destLocation.cameras.splice(destination.index, 0, draggedCamera);

      return newLocations;
    });
  }, []);

  const filteredLocations = locations.map(location => ({
    ...location,
    cameras: location.cameras.filter(camera =>
      camera.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }));

  // Function to generate a simulated timeline
  const generateTimeline = useCallback(() => {
    const timelineSegments = [];
    let currentTime = 0;
    while (currentTime < 24) {
      const segmentLength = Math.random() * 2 + 0.5; // Random length between 0.5 and 2.5 hours
      const isGap = Math.random() < 0.2; // 20% chance of being a gap
      timelineSegments.push({
        start: currentTime,
        end: Math.min(currentTime + segmentLength, 24),
        isGap
      });
      currentTime += segmentLength;
    }
    return timelineSegments;
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Mobile Menu */}
      {isMobile && (
        <div className="bg-white shadow-md p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Pavel's My Angel Cam</h1>
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          {menuOpen && (
            <nav className="mt-4">
              <a href="#" className="block py-2 text-gray-700 hover:bg-gray-200">Manage Cameras</a>
              <a href="#" className="block py-2 text-gray-700 hover:bg-gray-200">Billing & Invoices</a>
              <a href="#" className="block py-2 text-gray-700 hover:bg-gray-200">Share</a>
            </nav>
          )}
        </div>
      )}

      {/* Desktop Menu */}
      {!isMobile && (
        <div className="bg-white w-64 min-h-screen shadow-lg fixed left-0 top-0 z-30">
          <div className="p-4">
            <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
          </div>
          <nav className="mt-8">
            <a href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-200">Manage Cameras</a>
            <a href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-200">Billing & Invoices</a>
            <a href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-200">Share</a>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className={`flex-1 p-4 ${!isMobile ? 'ml-64' : ''}`}>
        <div className="max-w-full mx-auto">
          {!isMobile && <h1 className="text-4xl font-bold mb-8 text-gray-900">Pavel's My Angel Cam</h1>}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search cameras..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            {locations.map((location, locationIndex) => {
              const filteredCameras = location.cameras.filter(camera =>
                camera.name.toLowerCase().includes(searchTerm.toLowerCase())
              );
              
              return (
                <Droppable key={location.id} droppableId={location.id} direction="horizontal">
                  {(provided) => (
                    <div 
                      ref={provided.innerRef} 
                      {...provided.droppableProps}
                      className={`mb-8 p-4 rounded-lg ${
                        ['bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-purple-100'][locationIndex % 4]
                      }`}
                    >
                      <h2 className="text-2xl font-bold mb-4 text-gray-800">{location.name}</h2>
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-2">
                        {filteredCameras.map((camera, index) => (
                          <Draggable key={camera.id} draggableId={camera.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
                                onClick={() => setSelectedCamera(camera)}
                              >
                                <div className="aspect-video bg-gray-200 relative">
                                  <Image
                                    src={camera.image}
                                    alt={`Feed from ${camera.name}`}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                  />
                                </div>
                                <div className="p-2">
                                  <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-semibold text-gray-900 truncate">{camera.name}</h3>
                                    <div className="flex space-x-1">
                                      {camera.cloudRecording && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                        </svg>
                                      )}
                                      {camera.licensePlateDetection && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              );
            })}
          </DragDropContext>
        </div>
      </main>

      {/* Modal */}
      {selectedCamera && (
        <div 
          ref={modalRef}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedCamera(null)}
        >
          <div 
            className="bg-white rounded-lg p-4 w-4/5 h-4/5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full flex flex-col">
              <div className="relative flex-grow">
                <Image
                  src={selectedCamera.image}
                  alt={`Feed from ${selectedCamera.name}`}
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <h3 className="text-xl font-semibold mt-2 mb-4">{selectedCamera.name}</h3>
              <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
                {generateTimeline().map((segment, index) => (
                  <div
                    key={index}
                    className={`h-full inline-block ${segment.isGap ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{width: `${(segment.end - segment.start) / 24 * 100}%`}}
                  ></div>
                ))}
              </div>
              <button 
                className="absolute top-4 right-4 text-white bg-red-500 rounded-full p-2"
                onClick={() => setSelectedCamera(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}