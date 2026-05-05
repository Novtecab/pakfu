import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon, Loader2, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateListingImage } from '../services/geminiService';
import toast from 'react-hot-toast';

interface ImageGeneratorProps {
  onImageGenerated: (url: string) => void;
  defaultPrompt?: string;
}

const STYLES = [
  { id: 'realistic', name: 'Realistic', full: 'photorealistic' },
  { id: 'studio', name: 'Studio', full: 'studio lighting, white background' },
  { id: 'dramatic', name: 'Dramatic', full: 'moody lighting, urban evening' },
  { id: 'vintage', name: 'Vintage', full: 'retro film, 70s look' },
  { id: 'futuristic', name: 'Futuristic', full: 'neon lights, concept art' },
];

export default function ImageGenerator({ onImageGenerated, defaultPrompt = '' }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [style, setStyle] = useState(STYLES[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please provide a description');
      return;
    }

    setIsGenerating(true);
    setPreview(null);
    try {
      const selectedStyle = STYLES.find(s => s.id === style)?.full || '';
      const imageUrl = await generateListingImage(prompt, selectedStyle);
      
      if (imageUrl) {
        setPreview(imageUrl);
        toast.success('Image generated successfully!');
      } else {
        toast.error('Failed to generate image. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred during generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseImage = () => {
    if (preview) {
      onImageGenerated(preview);
      toast.success('Image added to your listing');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-nordic-slate/10 p-6 space-y-6 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-nordic-blue/10 flex items-center justify-center text-nordic-blue">
          <Sparkles size={20} />
        </div>
        <div>
          <h3 className="font-serif text-lg">AI Image Visualizer</h3>
          <p className="text-xs opacity-50">Generate professional photos for your listing</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-widest opacity-40 mb-2 block">
            Car Description
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A silver 2022 Volvo XC90 parked in a Swedish forest"
            className="w-full bg-nordic-snow border-none rounded-2xl p-4 focus:ring-2 focus:ring-nordic-blue min-h-[100px] resize-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-widest opacity-40 mb-2 block">
            Select Style
          </label>
          <div className="flex flex-wrap gap-2">
            {STYLES.map((s) => (
              <button
                key={s.id}
                onClick={() => setStyle(s.id)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  style === s.id
                    ? 'bg-nordic-ink text-white'
                    : 'bg-nordic-snow text-nordic-ink/60 hover:bg-nordic-slate/10'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-nordic-blue hover:bg-nordic-blue/90 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Generating Visual...
            </>
          ) : (
            <>
              <Wand2 size={20} />
              Generate Pro Photo
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-4 pt-4 border-t border-nordic-slate/10"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-nordic-snow border border-nordic-slate/10">
              <img
                src={preview}
                alt="AI Generated"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <button
              onClick={handleUseImage}
              className="w-full bg-nordic- ink text-nordic-snow font-bold py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all"
            >
              <ImageIcon size={18} />
              Use This Image
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
