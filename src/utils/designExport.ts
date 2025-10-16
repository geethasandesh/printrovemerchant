// Utility functions for exporting and downloading designs

export interface ExportOptions {
  format: 'png' | 'jpg' | 'svg' | 'pdf';
  quality: number; // 0-1 for jpg
  scale: number; // 1-4 for resolution multiplier
  backgroundColor?: string;
}

/**
 * Export canvas to image
 */
export async function exportCanvasToImage(
  canvas: HTMLCanvasElement,
  options: ExportOptions
): Promise<Blob> {
  const { format, quality, scale, backgroundColor } = options;
  
  // Create a new canvas with scaled dimensions
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = canvas.width * scale;
  exportCanvas.height = canvas.height * scale;
  
  const ctx = exportCanvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }
  
  // Fill background if specified
  if (backgroundColor) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
  }
  
  // Scale and draw original canvas
  ctx.scale(scale, scale);
  ctx.drawImage(canvas, 0, 0);
  
  // Convert to blob
  return new Promise((resolve, reject) => {
    exportCanvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      },
      `image/${format}`,
      format === 'jpg' ? quality : undefined
    );
  });
}

/**
 * Download blob as file
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export design as PNG
 */
export async function exportAsPNG(
  canvas: HTMLCanvasElement,
  filename: string = 'design.png',
  scale: number = 2
) {
  const blob = await exportCanvasToImage(canvas, {
    format: 'png',
    quality: 1,
    scale,
    backgroundColor: 'transparent',
  });
  
  downloadBlob(blob, filename);
}

/**
 * Export design as JPG
 */
export async function exportAsJPG(
  canvas: HTMLCanvasElement,
  filename: string = 'design.jpg',
  quality: number = 0.9,
  scale: number = 2
) {
  const blob = await exportCanvasToImage(canvas, {
    format: 'jpg',
    quality,
    scale,
    backgroundColor: '#ffffff',
  });
  
  downloadBlob(blob, filename);
}

/**
 * Upload image to S3 or backend
 */
export async function uploadImageToBackend(
  file: File | Blob,
  endpoint: string = '/api/upload'
): Promise<{ url: string; key: string }> {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Failed to upload image');
  }
  
  return response.json();
}

/**
 * Save design data to backend
 */
export async function saveDesignToBackend(designData: any): Promise<{ id: string }> {
  const response = await fetch('/api/designs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(designData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to save design');
  }
  
  return response.json();
}

/**
 * Load design data from backend
 */
export async function loadDesignFromBackend(designId: string): Promise<any> {
  const response = await fetch(`/api/designs/${designId}`);
  
  if (!response.ok) {
    throw new Error('Failed to load design');
  }
  
  return response.json();
}

/**
 * Generate thumbnail from canvas
 */
export async function generateThumbnail(
  canvas: HTMLCanvasElement,
  width: number = 200,
  height: number = 200
): Promise<string> {
  const thumbnailCanvas = document.createElement('canvas');
  thumbnailCanvas.width = width;
  thumbnailCanvas.height = height;
  
  const ctx = thumbnailCanvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }
  
  // Calculate scaling to fit
  const scale = Math.min(width / canvas.width, height / canvas.height);
  const scaledWidth = canvas.width * scale;
  const scaledHeight = canvas.height * scale;
  const x = (width - scaledWidth) / 2;
  const y = (height - scaledHeight) / 2;
  
  // Fill background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  
  // Draw scaled canvas
  ctx.drawImage(canvas, x, y, scaledWidth, scaledHeight);
  
  return thumbnailCanvas.toDataURL('image/png');
}

/**
 * Convert data URL to blob
 */
export function dataURLtoBlob(dataURL: string): Blob {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new Blob([u8arr], { type: mime });
}

/**
 * Compress image before upload
 */
export async function compressImage(
  file: File,
  maxWidth: number = 2000,
  maxHeight: number = 2000,
  quality: number = 0.9
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        
        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          file.type,
          quality
        );
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

