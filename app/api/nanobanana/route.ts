// app/api/nanobanana/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import * as path from "node:path";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imagePath, prompt: customPrompt } = body;

    // Check if API key is available
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('No GEMINI_API_KEY found in environment variables');
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" }, 
        { status: 500 }
      );
    }

    console.log('Using Google GenAI API with key:', apiKey.substring(0, 10) + '...');

    // Initialize Google GenAI
    const ai = new GoogleGenAI({
      apiKey: apiKey
    });

    // Handle image input
    let base64Image: string;
    
    if (imagePath) {
      try {
        // If image path is provided, read from file system
        const fullImagePath = path.join(process.cwd(), 'public', imagePath);
        
        // Check if file exists
        if (!fs.existsSync(fullImagePath)) {
          return NextResponse.json(
            { error: `Image file not found: ${imagePath}` }, 
            { status: 404 }
          );
        }
        
        const imageData = fs.readFileSync(fullImagePath);
        base64Image = imageData.toString("base64");
      } catch (fileError) {
        console.error('File reading error:', fileError);
        return NextResponse.json(
          { error: `Failed to read image file: ${imagePath}` }, 
          { status: 400 }
        );
      }
    } else {
      // You could also accept base64 image data directly from the request
      return NextResponse.json(
        { error: "Image path is required" }, 
        { status: 400 }
      );
    }

    // Create the prompt - for text-only generation like your example, or include image if provided
    let prompt;
    
    if (customPrompt && !imagePath) {
      // Text-only prompt like your example
      prompt = customPrompt;
    } else {
      // Prompt with image
      prompt = [
        { 
          text: customPrompt || "Create a picture of my cat eating a nano-banana in a fancy restaurant under the Gemini constellation" 
        },
        {
          inlineData: {
            mimeType: imagePath.endsWith('.jpg') || imagePath.endsWith('.jpeg') ? "image/jpeg" : "image/png",
            data: base64Image,
          },
        },
      ];
    }

    // Generate content with Gemini
    console.log('Sending request to Gemini API...');
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
    });

    const results = {
      textParts: [] as string[],
      images: [] as string[]
    };

    // Process response parts with proper null checks - matching your working example
    console.log('Response received:', response);
    
    if (response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          console.log('Found text part:', part.text);
          results.textParts.push(part.text);
        } else if (part.inlineData && part.inlineData.data) {
          console.log('Found image part');
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          
          // Save generated image to public folder
          const outputFileName = `gemini-generated-${Date.now()}.png`;
          const outputPath = path.join(process.cwd(), 'public', outputFileName);
          fs.writeFileSync(outputPath, buffer);
          
          results.images.push(`/${outputFileName}`);
          console.log(`Image saved as ${outputFileName}`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      results
    });

  } catch (error) {
    console.error('Nanobanana API error:', error);
    
    // More detailed error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error details:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    
    return NextResponse.json(
      { 
        error: "Failed to generate content",
        details: errorMessage,
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  // Test if we can read files from public directory
  const testImagePath = path.join(process.cwd(), 'public', 'colors.jpg');
  const fileExists = fs.existsSync(testImagePath);
  
  return NextResponse.json({
    message: "Nanobanana API is running",
    status: {
      apiKey: !!process.env.GEMINI_API_KEY,
      testImageExists: fileExists,
      publicPath: path.join(process.cwd(), 'public'),
      currentTime: new Date().toISOString()
    },
    endpoints: {
      POST: "Send image and prompt to generate content"
    }
  });
}