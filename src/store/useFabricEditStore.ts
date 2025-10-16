import { create } from "zustand";
import * as fabric from "fabric";

// Update your TextObject type in the store to match your usage:
export interface TextObject {
  id: string;
  text: fabric.IText | fabric.Textbox;
  widthInches: number;
  heightInches: number;
  angle: number;
  left: number;
  top: number;
  // ...any other properties...
}

interface ImageObject {
  id: string;
  image: fabric.Image;
  widthImageInches: number;
  heightImageInches: number;
  angleImage: number;
  left?: number;
  top?: number;
}
interface EditorState {
  textObjects: TextObject[];
  imageObjects: ImageObject[];
  addTextObject: (obj: TextObject) => void;
  updateTextObject: (id: string, updates: Partial<TextObject>) => void;
  removeTextObject: (id: string) => void;
  addImageObject: (newImage: ImageObject) => void;
  updateImageObject: (id: string, updatedData: Partial<ImageObject>) => void;
  removeImageObject: (id: string) => void;
}
const useEditorStore = create<EditorState>((set) => ({
  textObjects: [],
  imageObjects: [],
  addTextObject: (newText) =>
    set((state) => ({
      textObjects: [...state.textObjects, newText],
    })),
  updateTextObject: (id, updatedData) =>
    set((state) => ({
      textObjects: state.textObjects.map((text) =>
        text.id === id ? { ...text, ...updatedData } : text
      ),
    })),
  removeTextObject: (id) =>
    set((state) => ({
      textObjects: state.textObjects.filter((text) => text.id !== id),
    })),
  addImageObject: (newImage) =>
    set((state) => ({
      imageObjects: [...state.imageObjects, newImage],
    })),
  updateImageObject: (id, updatedData) =>
    set((state) => ({
      imageObjects: state.imageObjects.map((image) =>
        image.id === id ? { ...image, ...updatedData } : image
      ),
    })),
  removeImageObject: (id) =>
    set((state) => ({
      imageObjects: state.imageObjects.filter((image) => image.id !== id),
    })),
}));

export default useEditorStore;
