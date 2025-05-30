import React, { useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { Camera, Upload, Loader } from 'lucide-react';

interface ImageFoodRecognitionProps {
  onFoodDetected: (foodName: string) => void;
}

const ImageFoodRecognition: React.FC<ImageFoodRecognitionProps> = ({ onFoodDetected }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);

  // Load the model when component mounts
  React.useEffect(() => {
    loadModel();
  }, []);

  const loadModel = async () => {
    try {
      const loadedModel = await mobilenet.load();
      setModel(loadedModel);
    } catch (error) {
      console.error('Failed to load model:', error);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !model) return;

    setIsLoading(true);
    setPreview(URL.createObjectURL(file));

    try {
      // Create an image element for TensorFlow.js
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await img.decode(); // Wait for image to load

      // Make prediction
      const predictions = await model.classify(img);
      
      // Find food-related predictions
      const foodPrediction = predictions.find(p => 
        p.className.toLowerCase().includes('food') ||
        p.className.toLowerCase().includes('fruit') ||
        p.className.toLowerCase().includes('vegetable')
      );

      if (foodPrediction) {
        onFoodDetected(foodPrediction.className);
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Upload className="w-5 h-5 mr-2" />
          Upload Food Image
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      {isLoading && (
        <div className="flex items-center justify-center">
          <Loader className="w-6 h-6 animate-spin text-blue-500" />
          <span className="ml-2 text-sm text-gray-600">Analyzing image...</span>
        </div>
      )}

      {preview && (
        <div className="relative rounded-lg overflow-hidden">
          <img
            src={preview}
            alt="Food preview"
            className="w-full h-48 object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default ImageFoodRecognition;