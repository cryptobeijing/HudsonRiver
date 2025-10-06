'use client';

import { useState } from 'react';

interface Lesson {
  id: string;
  title: string;
  emoji: string;
  category: string;
  difficulty: string;
  description: string;
  content: string[];
}

const lessons: Lesson[] = [
  {
    id: 'discharge',
    title: 'What is River Discharge?',
    emoji: '💧',
    category: 'Hydrology',
    difficulty: 'Beginner',
    description: 'Learn how scientists measure water flow in rivers',
    content: [
      'Discharge is the volume of water flowing past a point per unit of time',
      'Measured in cubic feet per second (ft³/s) or cubic meters per second (m³/s)',
      'Calculated by multiplying the cross-sectional area of the river by the velocity of the water',
      'Higher discharge = more water flowing = stronger currents',
      'Discharge varies with rainfall, snowmelt, and upstream dam releases',
    ],
  },
  {
    id: 'tides',
    title: 'How Tides Work',
    emoji: '🌊',
    category: 'Tides',
    difficulty: 'Beginner',
    description: 'Understand what causes tides and how they affect rivers',
    content: [
      'Tides are caused by the gravitational pull of the Moon and Sun on Earth\'s oceans',
      'The Hudson River experiences semi-diurnal tides: two high tides and two low tides per day',
      'Tidal influence extends 153 miles north from New York Harbor to Troy, NY',
      'During flood tide, water moves upstream (north); during ebb tide, it flows downstream (south)',
      'Slack tide is the brief period between flood and ebb when currents are weakest - best time for kayaking!',
    ],
  },
  {
    id: 'currents',
    title: 'Understanding River Currents',
    emoji: '🌀',
    category: 'Hydrology',
    difficulty: 'Intermediate',
    description: 'Learn what creates currents and how to read them',
    content: [
      'Currents are the movement of water in a specific direction',
      'In the Hudson, currents are influenced by both tides AND river discharge',
      'Current speed measured in knots (1 knot = 1.15 mph)',
      'Faster currents near the center of the channel, slower near shores',
      'Currents can reverse direction with the tide in tidal rivers like the Hudson',
      'Avoid kayaking when currents exceed 2 knots unless you\'re experienced',
    ],
  },
  {
    id: 'safety',
    title: 'Kayaking Safety Basics',
    emoji: '🛶',
    category: 'Safety',
    difficulty: 'Beginner',
    description: 'Essential safety tips for kayaking on the Hudson',
    content: [
      'ALWAYS wear a properly fitted life jacket (PFD)',
      'Check weather and water conditions before launching',
      'Paddle during slack tide when possible (between high and low tide)',
      'Stay within 100 feet of shore if you\'re a beginner',
      'Avoid high discharge days (>20,000 ft³/s)',
      'Tell someone your float plan and expected return time',
      'Bring a whistle, phone in waterproof case, and first aid kit',
    ],
  },
  {
    id: 'gage',
    title: 'What is Gage Height?',
    emoji: '📏',
    category: 'Hydrology',
    difficulty: 'Intermediate',
    description: 'Learn how water levels are measured',
    content: [
      'Gage height is the water surface elevation above a fixed reference point (datum)',
      'Measured in feet or meters',
      'Changes in gage height indicate rising or falling water levels',
      'Not the same as water depth - it\'s measured from an arbitrary zero point',
      'Used to predict flooding and monitor river conditions',
      'USGS maintains thousands of stream gages across the United States',
    ],
  },
  {
    id: 'estuary',
    title: 'The Hudson River Estuary',
    emoji: '🌅',
    category: 'Environment',
    difficulty: 'Intermediate',
    description: 'Discover what makes the Hudson unique',
    content: [
      'An estuary is where freshwater from rivers meets saltwater from the ocean',
      'The Hudson River Estuary extends from New York Harbor to the Federal Dam at Troy',
      'Brackish water (mix of fresh and salt) creates a unique ecosystem',
      'Tides cause the river to flow BOTH ways - up to 4 times per day!',
      'Home to over 200 species of fish',
      'One of the most important estuaries in North America',
    ],
  },
];

export default function EducationalSection() {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  const activeLesson = lessons.find(l => l.id === selectedLesson);

  const categories = ['All', 'Hydrology', 'Tides', 'Safety', 'Environment'];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredLessons = activeCategory === 'All'
    ? lessons
    : lessons.filter(l => l.category === activeCategory);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">📚 Learn About the River</h2>
        <p className="text-gray-600">
          Interactive lessons about hydrology, tides, and river safety
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-river-blue text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Lesson Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map((lesson) => (
          <button
            key={lesson.id}
            onClick={() => setSelectedLesson(lesson.id)}
            className="bg-white rounded-lg shadow-lg p-6 text-left hover:shadow-xl transition-all hover:-translate-y-1 border-t-4 border-river-blue"
          >
            <div className="text-4xl mb-3">{lesson.emoji}</div>
            <h3 className="text-xl font-bold mb-2">{lesson.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{lesson.description}</p>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                {lesson.category}
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                {lesson.difficulty}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Lesson Modal */}
      {activeLesson && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-river-dark to-river-blue text-white p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-5xl mb-2">{activeLesson.emoji}</div>
                  <h2 className="text-2xl font-bold">{activeLesson.title}</h2>
                  <p className="text-blue-100 mt-1">{activeLesson.description}</p>
                </div>
                <button
                  onClick={() => setSelectedLesson(null)}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {activeLesson.content.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-river-blue text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 pt-1">{point}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
                <p className="font-semibold text-green-900 mb-1">💡 Quick Quiz</p>
                <p className="text-green-700 text-sm">
                  {activeLesson.id === 'discharge' && 'What does higher discharge indicate about river flow?'}
                  {activeLesson.id === 'tides' && 'How many high tides occur each day in the Hudson?'}
                  {activeLesson.id === 'currents' && 'When are currents typically weakest for kayaking?'}
                  {activeLesson.id === 'safety' && 'What is the #1 most important safety item for kayaking?'}
                  {activeLesson.id === 'gage' && 'What does gage height measure?'}
                  {activeLesson.id === 'estuary' && 'What makes the Hudson River an estuary?'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional Resources */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg p-6">
        <h3 className="text-2xl font-bold mb-4">🌟 Ready to Explore More?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
            <p className="font-semibold mb-2">📖 Further Reading</p>
            <p className="text-sm text-blue-100">
              Visit USGS Water Science School for in-depth hydrology lessons
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
            <p className="font-semibold mb-2">🎓 Field Trips</p>
            <p className="text-sm text-blue-100">
              Many organizations offer Hudson River educational tours
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
            <p className="font-semibold mb-2">🔬 Citizen Science</p>
            <p className="text-sm text-blue-100">
              Participate in river monitoring programs and contribute data
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
