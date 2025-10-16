import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";

declare module "fabric" {
  interface Line {
    customId?: string;
  }
  interface Canvas {
    gridBounds?: {
      left: number;
      right: number;
      top: number;
      bottom: number;
    };
  }
  interface FabricObject {
    customId?: string;
    lastValidAngle?: number;
    lastValidScaleX?: number;
    lastValidScaleY?: number;
  }
  interface IText {
    heigh?: number;
  }
  interface Image {
    customId?: string;
    lastValidAngle?: number;
    lastValidScaleX?: number;
    lastValidScaleY?: number;
  }
}
interface TextObject {
  widthInches: number;
  heightInches: number;
  angle: number;
  left: number;
  top: number;
  // add any other properties you expect
}

// interface GridLineResponse {
//   data: {
//     _id: string;
//     productType: string;
//     front_gridline: string;
//     back_gridline: string;
//     sleeve_gridline: string;
//     width: number;
//     height: number;
//     top: number;
//     left: number;
//     gridX: number;
//     gridY: number;
//     print_configurations: ("front" | "back" | "sleeve")[];
//   };
// }

import { BoxSelect, Database, GripVertical, Link, Tag,  Trash2,  Type } from "lucide-react";
import "./tshirt.css";
import { CiImageOn } from "react-icons/ci";
import useEditorStore from "../../store/useFabricEditStore";
import useTShirtStore from "../../store/useTShirtStore";
//import defaultTshirt from "../../assets/productImg2.png";
// import { useParams } from "react-router-dom";
import { useProductGridStore } from "../../store/useProductCustomizerAssetStore";
//import { useFetch } from "../../hooks/useFetch";
// const mytshirt = defaultTshirt;
// interface ProductCustomizerProps {
//   // Add any props you need here
// }
// const MAX_DISPLAY_SIZE = 500;
export const ProductCustomizer: React.FC = () => {
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const {textObjects,imageObjects} = useEditorStore();
  const { view, setView } = useTShirtStore();  
  // Get the last segment of the URL path
  // const { key } = useParams<{ key: string }>();
  // const lastSegment = key || window.location.pathname.split('/').pop();

  const productGrids = useProductGridStore((state) => state.productGrids);
  const productGrid = productGrids.find((grid) => grid.productType === "unisex_round"); 
  // const productGrid = productGrids.find((grid) => grid._id === lastSegment);
  // Select the correct gridline image URL based on the current view
const gridlineUrl =
  view === "back"
    ? productGrid?.back_gridline
    : view === "sleeve"
    ? productGrid?.sleeve_gridline
    : productGrid?.front_gridline;
  const GRID_SIZE = 12.75; // Each grid cell size in pixels 
  const convertToGridCells = (pixels: number) => {
    return (pixels / GRID_SIZE).toFixed(2); // Convert and round to 2 decimal places
  };
    
  useEffect(() => {
    if (!canvasRef.current) {
      canvasRef.current = new fabric.Canvas("canvas");
    }
    drawGrid();
  }, []);
  const drawGrid = () => {
  if (canvasRef.current) {
    const canvas = canvasRef.current;
    const baseCellSize = 12.75;
    const gridSizeX = productGrid?.gridX ?? 20;
    const gridSizeY = productGrid?.gridY ?? 20;
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();
    const offsetX = (canvasWidth - gridSizeX * baseCellSize) / 2;
    const offsetY = (canvasHeight - gridSizeY * baseCellSize) / 2;
    canvas.getObjects("line").forEach((obj) => canvas.remove(obj));
    canvas.gridBounds = {
      left: offsetX,
      right: offsetX + gridSizeX * baseCellSize,
      top: offsetY,
      bottom: offsetY + gridSizeY * baseCellSize,
    };
    for (let i = 0; i <= gridSizeX; i++) {
      const x = offsetX + i * baseCellSize;
      const line = new fabric.Line([x, offsetY, x, offsetY + gridSizeY * baseCellSize], {
        stroke: "red",
        strokeWidth: 0.3,
        selectable: false,
        evented: false,
      });
      canvas.add(line);
    }
    for (let j = 0; j <= gridSizeY; j++) {
      const y = offsetY + j * baseCellSize;
      const line = new fabric.Line([offsetX, y, offsetX + gridSizeX * baseCellSize, y], {
        stroke: "red",
        strokeWidth: 0.3,
        selectable: false,
        evented: false,
      });
      canvas.add(line);
    }
    canvas.renderAll();
  }
};
// Helper: Truncate text so it fits in the grid (maxLines = 100 for continuous typing)
function truncateTextToFitGrid(
  text: string,
  textObj: fabric.Textbox,
  maxWidth: number,
  maxHeight: number
) {
  let truncated = text;
  const fontSize = textObj.fontSize ?? 30;
  let lines = truncated.split("\n");
  const maxLines = 100; // allow many lines for continuous typing

  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    lines[maxLines - 1] = lines[maxLines - 1].slice(0, 1) + "…";
    truncated = lines.join("\n");
  }

  const temp = new fabric.Textbox("", {
    width: maxWidth,
    fontSize,
    originX: "center",
    originY: "center",
    fontFamily: textObj.fontFamily,
    fontWeight: textObj.fontWeight,
    fontStyle: textObj.fontStyle,
    textAlign: textObj.textAlign,
    fill: textObj.fill,
    underline: textObj.underline,
    linethrough: textObj.linethrough,
    overline: textObj.overline,
    charSpacing: textObj.charSpacing,
    lineHeight: textObj.lineHeight,
  });

  let fits = false;
  while (!fits) {
    temp.set({ text: truncated });
    if (temp.getScaledHeight() <= maxHeight && temp.getScaledWidth() <= maxWidth) {
      fits = true;
    } else {
      truncated = truncated.slice(0, -1);
      if (truncated.length === 0) break;
    }
  }
  return truncated;
}

// Fit text in grid: shrink font size and truncate text if needed, always center vertically
function fitTextInGrid(
  textObj: fabric.Textbox,
  bounds: { left: number; right: number; top: number; bottom: number }
) {
  const maxWidth = bounds.right - bounds.left;
  const maxHeight = bounds.bottom - bounds.top;

  textObj.set({
    width: maxWidth,
    textAlign: "center",
    originX: "center",
    originY: "center",
  });

  let fontSize = textObj.fontSize ?? 30;
  let bbox;
  let truncated = textObj.text ?? "";

  do {
    textObj.set({ fontSize, text: truncated });
    bbox = textObj.getBoundingRect();
    if (bbox.height > maxHeight) fontSize -= 1;
    if (fontSize < 8) break;
    if (bbox.height > maxHeight && fontSize <= 8) {
      truncated = truncateTextToFitGrid(truncated, textObj, maxWidth, maxHeight);
      textObj.set({ text: truncated });
      bbox = textObj.getBoundingRect();
      break;
    }
  } while (bbox.height > maxHeight);

  // Always keep text vertically centered in the grid
  textObj.set({
    left: bounds.left + maxWidth / 2,
    top: bounds.top + maxHeight / 2,
    originX: "center",
    originY: "center",
  });

  return true;
}

const addText = () => {
  setIsOpen(true);
  if (!canvasRef.current) return;
  const canvas = canvasRef.current;
  const id = `text-${Date.now()}`;
  const bounds = canvas.gridBounds!;

  const text = new fabric.Textbox("New Text", {
    left: bounds.left + (bounds.right - bounds.left) / 2,
    top: bounds.top + (bounds.bottom - bounds.top) / 2,
    width: bounds.right - bounds.left,
    fontSize: 30,
    fill: "black",
    originX: "center",
    originY: "center",
    textAlign: "center"
  });

  text.setControlsVisibility({ ml: false, mr: false, mt: false, mb: false });
  fitTextInGrid(text, bounds);

  canvas.add(text);
  canvas.setActiveObject(text);
  canvas.renderAll();

  const { addTextObject, updateTextObject } = useEditorStore.getState();
  addTextObject({
    id,
    text: text as fabric.IText | fabric.Textbox,
    widthInches: parseFloat(convertToGridCells(text.getScaledWidth())),
    heightInches: parseFloat(convertToGridCells(text.getScaledHeight())),
    angle: text.angle ?? 0,
    left: Math.round(text.left ?? 0),
    top: Math.round(text.top ?? 0),
  });

  const updateTextState = () => {
    fitTextInGrid(text, bounds);
    updateTextObject(id, {
      text: text as fabric.IText | fabric.Textbox,
      widthInches: parseFloat(convertToGridCells(text.getScaledWidth())),
      heightInches: parseFloat(convertToGridCells(text.getScaledHeight())),
      angle: text.angle ?? 0,
      left: Math.round(text.left ?? 0),
      top: Math.round(text.top ?? 0),
    } as Partial<TextObject>);
  };

  text.on("moving", updateTextState);
  text.on("scaling", updateTextState);
  text.on("rotating", updateTextState);
  text.on("modified", updateTextState);
  handleTextMove(text, canvas);
  restrictTextScalingAndRotation(text, canvas);
  updateTextState();

  text.on("changed", () => {
    fitTextInGrid(text, bounds);
    canvas.renderAll();
  });
};
const restrictTextScalingAndRotation = (text: fabric.Textbox, canvas: fabric.Canvas) => {
  text.on("scaling", () => {
    const bounds = canvas.gridBounds;
    if (!bounds) return;
    const bbox = text.getBoundingRect();
    if (
      bbox.left < bounds.left ||
      bbox.top < bounds.top ||
      bbox.left + bbox.width > bounds.right ||
      bbox.top + bbox.height > bounds.bottom
    ) {
      text.scaleX = text.lastValidScaleX || 1;
      text.scaleY = text.lastValidScaleY || 1;
    } else {
      text.lastValidScaleX = text.scaleX;
      text.lastValidScaleY = text.scaleY;
    }
    canvas.renderAll();
  });
  text.on("rotating", () => {
    const bounds = canvas.gridBounds;
    if (!bounds) return;
    const bbox = text.getBoundingRect();
    text.angle = Math.round(text.angle || 0);
    if (
      bbox.left < bounds.left ||
      bbox.top < bounds.top ||
      bbox.left + bbox.width > bounds.right ||
      bbox.top + bbox.height > bounds.bottom
    ) {
      text.angle = text.lastValidAngle || 0;
    } else {
      text.lastValidAngle = text.angle;
    }
    canvas.renderAll();
  });
};
const handleTextMove = (textObj: fabric.Textbox, canvas: fabric.Canvas) => {
  if (!canvas.gridBounds) return;
  const bounds = canvas.gridBounds;
  const GUIDE_THRESHOLD = 5;
  let verticalGuide: fabric.Line | null = null;
  let horizontalGuide: fabric.Line | null = null;
  const getCenter = () => ({
    centerX: bounds.left + (bounds.right - bounds.left) / 2,
    centerY: bounds.top + (bounds.bottom - bounds.top) / 2,
  });
  const getLimits = () => {
    const width = textObj.getScaledWidth();
    const height = textObj.getScaledHeight();
    return {
      minX: bounds.left + width / 2,
      maxX: bounds.right - width / 2,
      minY: bounds.top + height / 2,
      maxY: bounds.bottom - height / 2,
    };
  };
  const adjustPosition = () => {
    const { minX, maxX, minY, maxY } = getLimits();
    const newLeft = Math.round(Math.max(minX, Math.min(maxX, textObj.left ?? 0)));
    const newTop = Math.round(Math.max(minY, Math.min(maxY, textObj.top ?? 0)));
    textObj.set({ left: newLeft, top: newTop });
  };
  textObj.on("moving", () => {
    adjustPosition();
    restrictObjectScaling(textObj, canvas);
    const canvasCenter = getCenter();
    const left = textObj.left ?? 0;
    const top = textObj.top ?? 0;
    // Vertical guideline
    if (Math.abs(left - canvasCenter.centerX) < GUIDE_THRESHOLD) {
      if (!verticalGuide) {
        verticalGuide = new fabric.Line(
          [canvasCenter.centerX, bounds.top, canvasCenter.centerX, bounds.bottom],
          {
            stroke: "red",
            //strokeDashArray: [5, 5],
            selectable: false,
            evented: false,
          }
        );
        canvas.add(verticalGuide);
        // canvas.sendToBack(verticalGuide);
      }
    } else if (verticalGuide) {
      canvas.remove(verticalGuide);
      verticalGuide = null;
    }
    // Horizontal guideline
    if (Math.abs(top - canvasCenter.centerY) < GUIDE_THRESHOLD) {
      if (!horizontalGuide) {
        horizontalGuide = new fabric.Line(
          [bounds.left, canvasCenter.centerY, bounds.right, canvasCenter.centerY],
          {
            stroke: "red",
            //strokeDashArray: [5, 5],
            selectable: false,
            evented: false,
          }
        );
        canvas.add(horizontalGuide);
        // canvas.sendToBack(horizontalGuide);
      }
    } else if (horizontalGuide) {
      canvas.remove(horizontalGuide);
      horizontalGuide = null;
    }
    canvas.renderAll();
  });
  textObj.on("mouseup", () => {
    if (verticalGuide) {
      canvas.remove(verticalGuide);
      verticalGuide = null;
    }
    if (horizontalGuide) {
      canvas.remove(horizontalGuide);
      horizontalGuide = null;
    }
    canvas.renderAll();
  });
  adjustPosition(); // Run once on setup
};
const restrictObjectScaling = (object: fabric.Object, canvas: fabric.Canvas) => {
  const bounds = canvas.gridBounds;
  if (!bounds) return;
  const maxScaleX = Math.min(
    (bounds.right - bounds.left) / object.width!,
    (bounds.bottom - bounds.top) / object.height!
  );
  const maxScaleY = maxScaleX;
  if (object.scaleX! > maxScaleX || object.scaleY! > maxScaleY) {
    object.scaleX = object.lastValidScaleX || 1;
    object.scaleY = object.lastValidScaleY || 1;
  } else {
    object.lastValidScaleX = object.scaleX;
    object.lastValidScaleY = object.scaleY;
  }
  const minX = bounds.left + object.getScaledWidth() / 2;
  const maxX = bounds.right - object.getScaledWidth() / 2;
  const minY = bounds.top + object.getScaledHeight() / 2;
  const maxY = bounds.bottom - object.getScaledHeight() / 2;
  object.set({
    left: Math.max(minX, Math.min(maxX, object.left || 0)),
    top: Math.max(minY, Math.min(maxY, object.top || 0)),
  });
  canvas.renderAll();
};
  const monitorTextMovement = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.on("object:moving", (e) => {
        const obj = e.target;
        if (!obj || !canvas.gridBounds) return;
        obj.set("opacity", 1);
        canvas.renderAll();
      });
    }
  };
  monitorTextMovement();
const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  setIsOpen(true);
  if (!canvasRef.current || !event.target.files) return;
  const files = Array.from(event.target.files);
  if (!canvasRef.current.gridBounds) return;
  // Keep guideline references outside the forEach scope
  let verticalGuide: fabric.Line | null = null;
  let horizontalGuide: fabric.Line | null = null;
  const GUIDE_THRESHOLD = 5; // Pixels from center to trigger guideline
  const GUIDE_COLOR = 'red';
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target?.result || typeof e.target.result !== 'string') return;
      const imgObj = new Image();
      imgObj.src = e.target.result;
      imgObj.onload = () => {
        const id = Date.now().toString();
        const bounds = canvasRef.current?.gridBounds;
        if (!bounds) return;
        const { left, right, top, bottom } = bounds;
        const gridWidth = right - left;
        const gridHeight = bottom - top;
        const scaleX = gridWidth / imgObj.width;
        const scaleY = gridHeight / imgObj.height;
        const scaleFactor = Math.min(scaleX, scaleY, 1);
        const imgWidth = imgObj.width * scaleFactor;
        const imgHeight = imgObj.height * scaleFactor;
        const centerX = left + gridWidth / 2;
        const centerY = top + gridHeight / 2;
        const fabricImg = new fabric.Image(imgObj, {
          left: centerX,
          top: centerY,
          scaleX: scaleFactor,
          scaleY: scaleFactor,
          originX: 'center',
          originY: 'center',
          lockScalingFlip: true,
          selectable: true,
          hasControls: true,
          hasBorders: true,
          customId: id,
          lastValidLeft: centerX,
          lastValidTop: centerY,
          lastValidScaleX: scaleFactor,
          lastValidScaleY: scaleFactor,
          lastValidWidth: imgWidth,
          lastValidHeight: imgHeight,
          lastValidAngle: 0,
        } as unknown as fabric.ImageProps) as fabric.Image & fabric.FabricObject;
        const { addImageObject, updateImageObject } = useEditorStore.getState();
        addImageObject({
          id,
          image: fabricImg,
          widthImageInches: Number(fabricImg.getScaledWidth()),
          heightImageInches: Number(fabricImg.getScaledHeight()),
          angleImage: Number(fabricImg.angle ?? 0),
        });
        const updateInfoDisplay = () => {
          if (!canvasRef.current) return;
          updateImageObject(id, {
            widthImageInches: Number(fabricImg.getScaledWidth()),
            heightImageInches: Number(fabricImg.getScaledHeight()),
            angleImage: Math.round(Number(fabricImg.angle ?? 0)),
          });
          canvasRef.current.renderAll();
        };
        fabricImg.on('scaling', () => {
          const bounds = canvasRef.current?.gridBounds;
          if (!canvasRef.current || !bounds) return;
          const centerX = fabricImg.left!;
          const centerY = fabricImg.top!;
          const originalWidth = imgObj.width;
          const originalHeight = imgObj.height;
          const maxWidth = Math.min(centerX - bounds.left, bounds.right - centerX) * 2;
          const maxHeight = Math.min(centerY - bounds.top, bounds.bottom - centerY) * 2;
          const maxScaleX = maxWidth / originalWidth;
          const maxScaleY = maxHeight / originalHeight;
          const maxScale = Math.min(maxScaleX, maxScaleY);
          const newScale = Math.min(fabricImg.scaleX!, maxScale);
          fabricImg.set({
            scaleX: newScale,
            scaleY: newScale,
          });
          updateInfoDisplay();
        });
        fabricImg.on('moving', () => {
          const bounds = canvasRef.current?.gridBounds;
          if (!canvasRef.current || !bounds) return;
          const halfWidth = fabricImg.getScaledWidth() / 2;
          const halfHeight = fabricImg.getScaledHeight() / 2;
          const clampedLeft = Math.max(bounds.left + halfWidth, Math.min(bounds.right - halfWidth, fabricImg.left!));
          const clampedTop = Math.max(bounds.top + halfHeight, Math.min(bounds.bottom - halfHeight, fabricImg.top!));
          fabricImg.set({
            left: clampedLeft,
            top: clampedTop,
          });
          updateImageObject(id, {
            left: clampedLeft,
            top: clampedTop,
          });
          const canvas = canvasRef.current;
          const centerX = bounds.left + (bounds.right - bounds.left) / 2;
          const centerY = bounds.top + (bounds.bottom - bounds.top) / 2;
          // Show vertical guideline
          if (Math.abs(clampedLeft - centerX) < GUIDE_THRESHOLD) {
            if (!verticalGuide) {
              verticalGuide = new fabric.Line([centerX, bounds.top, centerX, bounds.bottom], {
                stroke: GUIDE_COLOR,
                strokeWidth: 1,
                selectable: false,
                evented: false,
              });
              canvas.add(verticalGuide);
              // canvas.sendToBack(verticalGuide);
            }
          } else if (verticalGuide) {
            canvas.remove(verticalGuide);
            verticalGuide = null;
          }
          // Show horizontal guideline
          if (Math.abs(clampedTop - centerY) < GUIDE_THRESHOLD) {
            if (!horizontalGuide) {
              horizontalGuide = new fabric.Line([bounds.left, centerY, bounds.right, centerY], {
                stroke: GUIDE_COLOR,
                strokeWidth: 1,
                selectable: false,
                evented: false,
              });
              canvas.add(horizontalGuide);
              // canvas.sendToBack(horizontalGuide);
            }
          } else if (horizontalGuide) {
            canvas.remove(horizontalGuide);
            horizontalGuide = null;
          }
          canvas.renderAll();
        });
        fabricImg.on('rotating', updateInfoDisplay);
        updateInfoDisplay();
        if (canvasRef.current) {
          canvasRef.current.add(fabricImg);
          canvasRef.current.renderAll();
        }
      };
    };
    reader.readAsDataURL(file);
  })
  event.target.value = '';
};
  // const removeGuidelines = (canvas: fabric.Canvas) => {
  //   canvas.getObjects().forEach((obj) => {
  //     const fabricObj = obj;
  //     if (
  //       fabricObj.customId === "x-guide" ||
  //       fabricObj.customId === "y-guide"
  //     ) {
  //       canvas.remove(fabricObj);
  //     }
  //   });
  //   canvas.renderAll();
  // };
  const deleteText = (id: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;  
    const { textObjects, removeTextObject } = useEditorStore.getState();
    const textObj = textObjects.find((obj) => obj.id === id);  
    if (textObj) {
      canvas.remove(textObj.text);
      removeTextObject(id);
      canvas.renderAll();
    }
  };
  const deleteImage = (id: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;  
    const { imageObjects, removeImageObject } = useEditorStore.getState();
    const imageObj = imageObjects.find((obj) => obj.id === id);  
    if (imageObj) {
      canvas.remove(imageObj.image );
      removeImageObject(id);
      canvas.renderAll();
    }
  };
  // const downloadMockup = () => {
  //   if (canvasRef.current) {
  //     const canvas = canvasRef.current;
  //     const gridLines = canvas
  //       .getObjects()
  //       .filter((obj) => obj instanceof fabric.Line);
  //     gridLines.forEach((line) => line.set({ visible: false }));
  //     canvas.renderAll();
  //     const background = new Image();
  //     background.src = mytshirt;
  //     background.onload = () => {
  //       const tempCanvas = document.createElement("canvas");
  //       tempCanvas.width = 452;
  //       tempCanvas.height = 500;
  //       const ctx = tempCanvas.getContext("2d");
  //       ctx?.drawImage(background, 0, 0, tempCanvas.width, tempCanvas.height);
  //       const fabricDataURL = canvas.toDataURL({
  //         format: "png",
  //         quality: 1,
  //         multiplier: 1,
  //       });
  //       const overlayImage = new Image();
  //       overlayImage.src = fabricDataURL;
  //       overlayImage.onload = () => {
  //         ctx?.drawImage(overlayImage, 125, 70, 205, 258);
  //         const finalDataURL = tempCanvas.toDataURL();
  //         const link = document.createElement("a");
  //         link.href = finalDataURL;
  //         link.download = "mockup.png";
  //         link.click();
  //         setTimeout(() => {
  //           gridLines.forEach((line) => line.set({ visible: true }));
  //           canvas.renderAll();
  //         }, 100);
  //       };
  //     };
  //   }
  // };
  // const downloadMockupAssets = () => {
  //   if (canvasRef.current) {
  //     const canvas = canvasRef.current;
  //     const gridLines = canvas.getObjects().filter((obj) => obj instanceof fabric.Line);
  //     gridLines.forEach((line) => line.set({ visible: false }));  
  //     canvas.renderAll();  
  //     const dataURL = canvas.toDataURL({
  //       format: "png",
  //       quality: 1,
  //       multiplier: 1,
  //     });  
  //     const link = document.createElement("a");
  //     link.href = dataURL;
  //     link.download = "mockup.png";
  //     link.click();  
  //     setTimeout(() => {
  //       gridLines.forEach((line) => line.set({ visible: true }));
  //       canvas.renderAll();
  //     }, 100);
  //   }
  // };  
  return (
    <>
      <div className="min-h-screen flex flex-col items-center pb-6 bg-[#F7F7F7]">
        {/* 3-column main content */}
        <div className="flex flex-row w-full max-w-[1400px] px-4 gap-6 mt-6">
          {/* Sidebar */}
          <div className="w-[80px] flex-shrink-0 flex flex-col items-center py-8 px-2 bg-white border border-gray-200 rounded-2xl shadow-md">
            <button className="w-14 h-14 flex flex-col items-center justify-center mb-4 rounded-xl hover:bg-gray-100 transition border-2 border-transparent">
              <Tag size={28} />
              <span className="text-xs mt-1">Product</span>
            </button>
            <button className="w-14 h-14 flex flex-col items-center justify-center mb-4 rounded-xl hover:bg-gray-100 transition">
              <Database size={28} />
              <span className="text-xs mt-1">Layers</span>
            </button>
            <label className="w-14 h-14 flex flex-col items-center justify-center mb-4 rounded-xl hover:bg-gray-100 transition cursor-pointer">
              <CiImageOn size={32} />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <span className="text-xs mt-1">Files</span>
            </label>
            <button
              onClick={addText}
              className="w-14 h-14 flex flex-col items-center justify-center mb-4 rounded-xl hover:bg-gray-100 transition border-2 border-transparent"
            >
              <Type size={28} />
              <span className="text-xs mt-1 font-semibold text-black">Text</span>
            </button>
            <button className="w-14 h-14 flex flex-col items-center justify-center mb-4 rounded-xl hover:bg-gray-100 transition">
              <Link size={28} />
              <span className="text-xs mt-1">Branding</span>
            </button>
            <button className="w-14 h-14 flex flex-col items-center justify-center mb-4 rounded-xl hover:bg-gray-100 transition">
              <BoxSelect size={28} />
              <span className="text-xs mt-1">Collections</span>
            </button>
          </div>

          {/* Canvas area */}
          <div className="flex-1 flex justify-center items-start">
            <div className="bg-white p-8 rounded-2xl border shadow w-[450px] h-[450px] flex items-center justify-center">
              <div className="relative w-[330px] h-[330px] flex items-center justify-center">
                {gridlineUrl && (
                  <img
                    id="tshirt-backgroundpicture"
                    src={gridlineUrl}
                    alt="T-Shirt"
                    className="absolute"
                    style={{
                      width: `${productGrid?.width}px`,
                      height: `${productGrid?.height}px`,
                      top: `${productGrid?.top}px`,
                      left: `${productGrid?.left}px`,
                    }}
                  />
                )}
                <div className="drawing-area absolute inset-0 flex items-center justify-center">
                  <canvas id="canvas" width="205" height="258"></canvas>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="w-[400px] flex-shrink-0 p-6 border rounded-2xl shadow-md bg-white ml-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Variants and layers</h2>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-sm font-medium text-gray-500"
              >
                {isOpen ? "✖" : "☰"}
              </button>
            </div>
            {isOpen && (
              <div className="max-h-96 overflow-y-auto">
                {/* Variants Section */}
                <div className="mt-4">
                  <h3 className="text-sm font-semibold">Variants</h3>
                  <button className="mt-2 w-full border p-2 rounded-lg">
                    Select variants
                  </button>
                  <div className="mt-2 w-10 h-10 border rounded-full bg-gray-200"></div>
                </div>
                {/* Layers Section */}
                <div className="mt-6">
                  <h3 className="text-sm font-semibold">Layers</h3>
                  {imageObjects.map(({ id, image }) => (
                    <div
                      key={id}
                      className="p-3 border rounded-lg mt-2 bg-gray-50"
                    >
                      {/* Image and Actions - First Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={image.getSrc()}
                            alt={`Image ${id.slice(-4)}`}
                            className="w-12 h-12 object-cover rounded"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => deleteImage(id)}>
                            <Trash2 className="w-5 h-5 text-gray-500 cursor-pointer" />
                          </button>
                          <GripVertical className="w-5 h-5 text-gray-500 cursor-move" />
                        </div>
                      </div>
                      {/* Image Properties - Second Row */}
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {[
                          { label: "Rotate", value: image.angle },
                          {
                            label: "Width",
                            value:
                              imageObjects.find((obj) => obj.id === id)
                                ?.widthImageInches || "",
                          },
                          {
                            label: "Height",
                            value:
                              imageObjects.find((obj) => obj.id === id)
                                ?.heightImageInches || "",
                          },
                          { label: "Position Top", value: image.top },
                          { label: "Position Left", value: image.left },
                        ].map(({ label, value }) => (
                          <div key={label}>
                            <label className="text-xs font-medium">
                              {label}
                            </label>
                            <input
                              type="number"
                              value={value}
                              className="mt-1 w-full border p-1 rounded"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {textObjects.map(({ id, text }) => (
                    <div
                      key={id}
                      className="p-3 border rounded-lg mt-2 bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 border rounded bg-gray-100 font-bold">
                            Tt
                          </div>
                          <div>
                            <p className="text-sm font-medium">{text.text}</p>
                            <p className="text-xs text-gray-500">Abel</p>
                          </div>
                        </div>
                        <button onClick={() => deleteText(id)}>
                          <Trash2 className="w-5 h-5 text-gray-500 cursor-pointer" />
                        </button>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-xs font-medium">Rotate</label>
                          <input
                            type="number"
                            value={text.angle}
                            className="mt-1 w-full border p-1 rounded"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium">width</label>
                          <input
                            type="number"
                            value={
                              textObjects.find((obj) => obj.id === id)
                                ?.widthInches || ""
                            }
                            className="mt-1 w-full border p-1 rounded"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium">Height </label>
                          <input
                            type="number"
                            value={
                              textObjects.find((obj) => obj.id === id)
                                ?.heightInches || ""
                            }
                            className="mt-1 w-full border p-1 rounded"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium">
                            Position top
                          </label>
                          <input
                            type="number"
                            value={text.top}
                            className="mt-1 w-full border p-1 rounded"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium">
                            Position left
                          </label>
                          <input
                            type="number"
                            value={text.left}
                            className="mt-1 w-full border p-1 rounded"
                          />
                        </div>
                      </div>
                      <div className="mt-2 flex gap-2 justify-center">
                        <button className="p-2 border rounded">↔</button>
                        <button className="p-2 border rounded">↕</button>
                        <button className="p-2 border rounded">⬆</button>
                        <button className="p-2 border rounded">⬇</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sizes and Sides controls */}
        <div className="flex flex-col justify-center w-full max-w-[1400px] mt-6">
          <div className="flex flex-row justify-center space-x-2">
            {/* ...existing size buttons... */}
            <button className="px-4 py-2 rounded-lg shadow-sm border transition-all relative z-10">S</button>
            <button className="px-4 py-2 rounded-lg shadow-sm border transition-all relative z-10">M</button>
            <button className="px-4 py-2 rounded-lg shadow-sm border transition-all relative z-10">L</button>
            <button className="px-4 py-2 rounded-lg shadow-sm border transition-all relative z-10">XL</button>
            <button className="px-4 py-2 rounded-lg shadow-sm border transition-all relative z-10">2XL</button>
            <button className="px-4 py-2 rounded-lg shadow-sm border transition-all relative z-10">3XL</button>
          </div>
          <div className="flex flex-row justify-center pt-4 pb-8">
            <div className="flex justify-center space-x-4 bg-white rounded-lg border px-10 py-2 w-fit">
              {productGrid?.print_configurations.map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-4 py-2 rounded-md ${
                    view === v
                      ? "bg-gray-200 font-bold text-black"
                      : "text-gray-700 hover:text-black"
                  }`}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)} Side
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* ...existing footer code... */}
      </div>
    </>
  );
};
export default ProductCustomizer;