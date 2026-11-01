'use client';

import React, { useState } from 'react';
import {
  Volume2,
  Sparkles,
  MapPin,
  Home,
  CheckCircle2,
  HelpCircle,
  Eye,
  Sun,
  CloudSun,
  Leaf,
  Snowflake,
  Layers,
  Building,
} from 'lucide-react';
import { WordItem } from '../types';
import { speech } from '../lib/speech';
import { sounds } from '../lib/soundEffects';
import { useProgress } from '../lib/progress';

// ====================================================
// 1. FOOD & DRINKS SPECIAL (Plate & Food Explorer)
// ====================================================
export function FoodMatchSpecial({ words }: { words: WordItem[] }) {
  const [selectedWord, setSelectedWord] = useState<WordItem | null>(words[0] || null);

  const part1Words = words.filter((w) => w.groupId === 'g4-m5-p1');
  const part2Words = words.filter((w) => w.groupId === 'g4-m5-p2');

  const handleSelect = (word: WordItem) => {
    sounds.playClick();
    setSelectedWord(word);
    speech.speak(word.english);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-card space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
            Special Interactive Feature
          </span>
          <h4 className="font-display font-black text-xl text-indigo-deep mt-1">
            Food & Drinks Explorer
          </h4>
          <p className="text-xs font-semibold text-brand-muted">
            Explore authentic textbook ingredients divided into Part 1 & Part 2
          </p>
        </div>

        {selectedWord && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl">
            <span className="text-2xl">{selectedWord.emoji}</span>
            <div>
              <div className="font-display font-black text-sm text-indigo-deep">
                {selectedWord.english} ({selectedWord.kazakh})
              </div>
              <div className="text-[10px] font-mono text-brand-purple">
                {selectedWord.ipa}
              </div>
            </div>
            <button
              onClick={() => speech.speak(selectedWord.english)}
              className="p-1.5 rounded-full bg-brand-blue text-white ml-2"
              title="Speak"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Two Groups Presentation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Part 1 Group */}
        <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200/70">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-display font-extrabold text-sm text-orange-900">
              Part 1: Meals & Proteins
            </h5>
            <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-md">
              6 words
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {part1Words.map((w) => (
              <button
                key={w.id}
                onClick={() => handleSelect(w)}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  selectedWord?.id === w.id
                    ? 'bg-brand-blue text-white border-brand-blue shadow-md scale-102'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-orange-400 hover:bg-orange-50'
                }`}
              >
                <div className="text-3xl mb-1">{w.emoji}</div>
                <div className="font-bold text-xs">{w.english}</div>
                <div className="text-[10px] opacity-80">{w.kazakh}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Part 2 Group */}
        <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-display font-extrabold text-sm text-amber-900">
              Part 2: Dairy & Staples
            </h5>
            <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-md">
              6 words
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {part2Words.map((w) => (
              <button
                key={w.id}
                onClick={() => handleSelect(w)}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  selectedWord?.id === w.id
                    ? 'bg-brand-blue text-white border-brand-blue shadow-md scale-102'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-amber-400 hover:bg-amber-50'
                }`}
              >
                <div className="text-3xl mb-1">{w.emoji}</div>
                <div className="font-bold text-xs">{w.english}</div>
                <div className="text-[10px] opacity-80">{w.kazakh}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ====================================================
// 2. ANIMALS & BODY PARTS SPECIAL
// ====================================================
export function BodyPartsSpecial({ words }: { words: WordItem[] }) {
  const [activePart, setActivePart] = useState<WordItem | null>(null);

  const animalWords = words.filter((w) => w.groupId === 'g4-m6-p1');
  const bodyPartWords = words.filter((w) => w.groupId === 'g4-m6-p2');

  const handleSpeak = (word: WordItem) => {
    sounds.playClick();
    setActivePart(word);
    speech.speak(word.english);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-card space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Special Interactive Anatomy
          </span>
          <h4 className="font-display font-black text-xl text-indigo-deep mt-1">
            Animals & Body Parts Explorer
          </h4>
          <p className="text-xs font-semibold text-brand-muted">
            Tap any body part or animal to see its IPA pronunciation and Kazakh translation
          </p>
        </div>

        {/* Highlight distinction for chicken */}
        <div className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
          💡 Context: In Unit 6, "Chicken" = Тауық (living bird)!
        </div>
      </div>

      {/* Animals Showcase Row */}
      <div>
        <h5 className="text-xs font-black uppercase tracking-wider text-emerald-800 mb-2">
          1. Domestic Animals (Part 1)
        </h5>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          {animalWords.map((animal) => (
            <button
              key={animal.id}
              onClick={() => handleSpeak(animal)}
              className={`p-3 rounded-2xl border text-center transition-all ${
                activePart?.id === animal.id
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-105'
                  : 'bg-emerald-50/50 border-emerald-200 text-slate-800 hover:bg-emerald-100'
              }`}
            >
              <div className="text-3xl mb-1">{animal.emoji}</div>
              <div className="font-extrabold text-xs">{animal.english}</div>
              <div className="text-[10px] opacity-80">{animal.kazakh}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Body Parts Showcase */}
      <div>
        <h5 className="text-xs font-black uppercase tracking-wider text-brand-blue mb-2">
          2. Body Parts (Part 2)
        </h5>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {bodyPartWords.map((part) => (
            <button
              key={part.id}
              onClick={() => handleSpeak(part)}
              className={`p-3 rounded-2xl border text-center transition-all flex items-center gap-2.5 ${
                activePart?.id === part.id
                  ? 'bg-brand-blue text-white border-brand-blue shadow-md scale-105'
                  : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-brand-blue hover:bg-blue-50/50'
              }`}
            >
              <span className="text-2xl">{part.emoji}</span>
              <div className="text-left">
                <div className="font-extrabold text-xs">{part.english}</div>
                <div className="text-[10px] opacity-80">{part.kazakh}</div>
                <div className="text-[9px] font-mono text-brand-purple">{part.ipa}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ====================================================
// 3. TOWN & TRAVELLING EXPLORER SPECIAL
// ====================================================
export function TownExplorerSpecial({ words }: { words: WordItem[] }) {
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);

  const townPlaces = words.filter((w) => w.groupId === 'g4-m7-p2');
  const naturePlaces = words.filter((w) => w.groupId === 'g4-m7-p1');

  const storySpots = [
    { name: 'Fire Station', detail: "Next to the baker's", emoji: '🚒' },
    { name: "Baker's", detail: 'Next to fire station', emoji: '🥖' },
    { name: "Greengrocer's", detail: 'Between post office & hospital', emoji: '🥦' },
    { name: 'Post Office', detail: "Beside greengrocer's", emoji: '🏤' },
    { name: 'Hospital', detail: "Beside greengrocer's", emoji: '🏥' },
    { name: 'Cute Farm', detail: 'On the road ride', emoji: '🚜' },
    { name: 'Sweet Shop', detail: 'Where children wanted sweets', emoji: '🍭' },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-card space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
            Special Interactive Map
          </span>
          <h4 className="font-display font-black text-xl text-indigo-deep mt-1">
            Town & Travel Explorer
          </h4>
          <p className="text-xs font-semibold text-brand-muted">
            Explore natural wonders and town spots featured in Module 7
          </p>
        </div>
      </div>

      {/* Natural Landscapes Row */}
      <div>
        <h5 className="text-xs font-black uppercase tracking-wider text-teal-800 mb-2">
          Nature & Geography (Part 1)
        </h5>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {naturePlaces.map((nature) => (
            <button
              key={nature.id}
              onClick={() => {
                sounds.playClick();
                speech.speak(nature.english);
              }}
              className="p-3 rounded-2xl bg-teal-50/70 border border-teal-200 text-center hover:bg-teal-100 transition-colors"
            >
              <div className="text-3xl mb-1">{nature.emoji}</div>
              <div className="font-black text-xs text-teal-900">{nature.english}</div>
              <div className="text-[10px] text-teal-700 font-semibold">{nature.kazakh}</div>
              <div className="text-[9px] font-mono text-teal-600 mt-0.5">{nature.ipa}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Town Buildings Row */}
      <div>
        <h5 className="text-xs font-black uppercase tracking-wider text-brand-blue mb-2">
          Town Buildings (Part 2)
        </h5>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {townPlaces.map((place) => (
            <button
              key={place.id}
              onClick={() => {
                sounds.playClick();
                speech.speak(place.english);
              }}
              className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200 text-center hover:bg-blue-100 transition-colors"
            >
              <div className="text-3xl mb-1">{place.emoji}</div>
              <div className="font-black text-xs text-indigo-deep">{place.english}</div>
              <div className="text-[10px] text-brand-blue font-semibold">{place.kazakh}</div>
              <div className="text-[9px] font-mono text-purple-600 mt-0.5">{place.ipa}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Story Locations Map */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
        <h5 className="text-xs font-black uppercase tracking-wider text-indigo-deep mb-2 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-brand-coral" />
          <span>Locations from the Town Story ("At the zoo!")</span>
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {storySpots.map((spot, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2.5 text-xs"
            >
              <span className="text-2xl">{spot.emoji}</span>
              <div>
                <div className="font-bold text-indigo-deep">{spot.name}</div>
                <div className="text-[11px] text-slate-500 font-medium">{spot.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ====================================================
// 4. WONDERFUL WORLD & SUNFLOWERS SPECIAL
// ====================================================
export function SunflowersTechSpecial({ words }: { words: WordItem[] }) {
  const [activeSeason, setActiveSeason] = useState<'spring' | 'summer' | 'autumn'>('spring');

  const seasonsData = {
    spring: {
      title: 'Spring (Көктем)',
      icon: Leaf,
      color: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      description: 'Time to plant our sunflower seeds in the ground!',
      quote: '"Come on, children! It\'s spring. Time to plant our sunflower seeds!"',
      illustration: '🌱 🌻',
    },
    summer: {
      title: 'Summer (Жаз)',
      icon: Sun,
      color: 'bg-amber-50 border-amber-200 text-amber-900',
      description: 'The sunflowers grow tall and blossom beautifully! Cody also finds a surprise tomato plant!',
      quote: '"When do the sunflowers grow tall, Miss? - In summer."',
      illustration: '🌻 🍅 ☀️',
    },
    autumn: {
      title: 'Autumn (Күз)',
      icon: CloudSun,
      color: 'bg-orange-50 border-orange-200 text-orange-900',
      description: 'We harvest the nutritious seeds from the tall sunflowers.',
      quote: '"Then, in autumn we take the seeds from the sunflowers. We can use the seeds for a lot of things."',
      illustration: '🌰 🌾 🧺',
    },
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-card space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
            Special Interactive Story Feature
          </span>
          <h4 className="font-display font-black text-xl text-indigo-deep mt-1">
            Sunflowers Seasonal Cycle & Tech Showcase
          </h4>
          <p className="text-xs font-semibold text-brand-muted">
            Explore the 3 seasons from the Sunflowers text and modern technology devices
          </p>
        </div>
      </div>

      {/* Sunflower Seasons Explorer */}
      <div>
        <h5 className="text-xs font-black uppercase tracking-wider text-indigo-deep mb-3">
          1. The Sunflower Seasons Cycle
        </h5>
        <div className="flex items-center gap-2 mb-4">
          {(['spring', 'summer', 'autumn'] as const).map((s) => (
            <button
              key={s}
              onClick={() => {
                sounds.playClick();
                setActiveSeason(s);
              }}
              className={`flex-1 py-2.5 px-3 rounded-2xl font-display font-black text-xs sm:text-sm capitalize transition-all ${
                activeSeason === s
                  ? 'bg-amber-400 text-amber-950 shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className={`p-5 rounded-2xl border ${seasonsData[activeSeason].color}`}>
          <div className="flex items-start gap-4">
            <div className="text-4xl">{seasonsData[activeSeason].illustration}</div>
            <div>
              <h6 className="font-display font-black text-lg mb-1">
                {seasonsData[activeSeason].title}
              </h6>
              <p className="text-xs font-semibold mb-2">
                {seasonsData[activeSeason].description}
              </p>
              <div className="text-xs font-mono italic opacity-90">
                {seasonsData[activeSeason].quote}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Gadgets Grid */}
      <div>
        <h5 className="text-xs font-black uppercase tracking-wider text-brand-purple mb-3">
          2. Modern Technology Devices (8 Words)
        </h5>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {words.map((gadget) => (
            <button
              key={gadget.id}
              onClick={() => {
                sounds.playClick();
                speech.speak(gadget.english);
              }}
              className="p-3 rounded-2xl bg-purple-50/70 border border-purple-200 text-center hover:bg-purple-100 transition-colors"
            >
              <div className="text-3xl mb-1">{gadget.emoji}</div>
              <div className="font-black text-xs text-indigo-deep">{gadget.english}</div>
              <div className="text-[10px] text-purple-700 font-semibold">{gadget.kazakh}</div>
              <div className="text-[9px] font-mono text-purple-600 mt-0.5">{gadget.ipa}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ====================================================
// 5. GRADE 5 MODULE 1: INTERACTIVE HOUSE FLOOR PLAN
// ====================================================
export function HousePlanSpecial({ words }: { words: WordItem[] }) {
  const [selectedRoom, setSelectedRoom] = useState<string>('bedroom');

  const rooms = [
    { id: 'bedroom', name: 'Bedroom', kz: 'Жатын бөлме', emoji: '🛏️', color: 'from-indigo-500 to-purple-600' },
    { id: 'bathroom', name: 'Bathroom', kz: 'Жуынатын бөлме', emoji: '🛁', color: 'from-cyan-500 to-blue-600' },
    { id: 'living-room', name: 'Living room', kz: 'Қонақ бөлме', emoji: '🛋️', color: 'from-amber-500 to-orange-600' },
    { id: 'kitchen', name: 'Kitchen', kz: 'Ас үй', emoji: '🍳', color: 'from-rose-500 to-red-600' },
    { id: 'hall', name: 'Hall', kz: 'Дәліз', emoji: '🚪', color: 'from-emerald-500 to-teal-600' },
  ];

  // Mapping items to rooms based on natural house allocation
  const roomItemsMap: Record<string, string[]> = {
    bedroom: ['Wardrobe', 'Desk', 'Chair', 'Pillows', 'Mirror', 'Painting'],
    bathroom: ['Bath', 'Sink', 'Mirror'],
    'living-room': ['Sofa', 'Armchair', 'Carpet', 'Bookcase', 'Table', 'Poster', 'Painting'],
    kitchen: ['Cooker', 'Fridge', 'Sink', 'Table', 'Chair'],
    hall: ['Mirror', 'Carpet', 'Painting'],
  };

  const currentItems = roomItemsMap[selectedRoom] || [];
  const matchedWords = words.filter((w) =>
    currentItems.includes(w.english)
  );

  return (
    <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-card space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
            Interactive Floor Plan
          </span>
          <h4 className="font-display font-black text-xl text-indigo-deep mt-1">
            2D Interactive House Plan
          </h4>
          <p className="text-xs font-semibold text-brand-muted">
            Click on any room to explore its furniture and English vocabulary items
          </p>
        </div>
      </div>

      {/* Room Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => {
              sounds.playClick();
              setSelectedRoom(room.id);
              speech.speak(room.name);
            }}
            className={`p-3 rounded-2xl border text-center transition-all ${
              selectedRoom === room.id
                ? 'bg-indigo-deep text-white border-indigo-deep shadow-md scale-102'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="text-2xl mb-1">{room.emoji}</div>
            <div className="font-black text-xs">{room.name}</div>
            <div className="text-[10px] opacity-75">{room.kz}</div>
          </button>
        ))}
      </div>

      {/* Visual House Layout Diagram */}
      <div className="p-6 rounded-3xl bg-slate-100 border-2 border-dashed border-slate-300 relative">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black text-indigo-deep uppercase tracking-wider flex items-center gap-1.5">
            <Home className="w-4 h-4 text-brand-blue" />
            <span>
              Inside the {rooms.find((r) => r.id === selectedRoom)?.name} (
              {rooms.find((r) => r.id === selectedRoom)?.kz})
            </span>
          </span>
          <button
            onClick={() => {
              const r = rooms.find((rm) => rm.id === selectedRoom);
              if (r) speech.speak(r.name);
            }}
            className="flex items-center gap-1 text-xs font-bold text-brand-blue hover:underline"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Listen Room Name</span>
          </button>
        </div>

        {/* Furniture Items Grid inside the active room */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {matchedWords.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                sounds.playClick();
                speech.speak(item.english);
              }}
              className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-brand-blue shadow-xs text-center transition-all group hover:-translate-y-0.5"
            >
              <div className="text-3xl mb-1 group-hover:scale-110 transition-transform">
                {item.emoji}
              </div>
              <div className="font-black text-xs text-indigo-deep">{item.english}</div>
              <div className="text-[10px] text-slate-500 font-semibold">{item.kazakh}</div>
              <div className="text-[9px] font-mono text-brand-purple mt-0.5">{item.ipa}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
