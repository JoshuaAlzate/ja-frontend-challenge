import { useLayoutEffect, useRef, useState } from 'react';

const ObjectVisualizer = (props: ObjectDetectionVisualizerProps) => {
  const boundingBoxStyles = props.boundingBoxStyles,
    annotations = props.annotations,
    image = props.image;
  const styles = {
    boudingBoxFill:
      (boundingBoxStyles === null || boundingBoxStyles === void 0
        ? void 0
        : boundingBoxStyles.boudingBoxFill) || '#6A66A3',
    boudingBoxStroke:
      (boundingBoxStyles === null || boundingBoxStyles === void 0
        ? void 0
        : boundingBoxStyles.boudingBoxStroke) || '#302E4D',
    boundingBoxOpacity:
      (boundingBoxStyles === null || boundingBoxStyles === void 0
        ? void 0
        : boundingBoxStyles.boundingBoxOpacity) || 0.2,
    boundingBoxTextColor:
      (boundingBoxStyles === null || boundingBoxStyles === void 0
        ? void 0
        : boundingBoxStyles.boundingBoxTextColor) || 'yellow',
    boundingBoxTextFont:
      (boundingBoxStyles === null || boundingBoxStyles === void 0
        ? void 0
        : boundingBoxStyles.boundingBoxTextFont) || '18px Comic Sans MS',
    boundingBoxTextPosition:
      (boundingBoxStyles === null || boundingBoxStyles === void 0
        ? void 0
        : boundingBoxStyles.boundingBoxTextPosition) || TextPosition.TopLeft,
    disableFill:
      boundingBoxStyles === null || boundingBoxStyles === void 0
        ? void 0
        : boundingBoxStyles.disableFill,
    disableStroke:
      boundingBoxStyles === null || boundingBoxStyles === void 0
        ? void 0
        : boundingBoxStyles.disableStroke,
    disableLabel:
      boundingBoxStyles === null || boundingBoxStyles === void 0
        ? void 0
        : boundingBoxStyles.disableLabel,
  };
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  useLayoutEffect(function () {
    if(error) return;
    let canvasContext = canvasRef.current.getContext('2d');
    if (imgRef.current && canvasRef.current) {
      imgRef.current.onload = function () {
        let _a, _b;
        canvasRef.current.height = imgRef.current.height;
        canvasRef.current.width = imgRef.current.width;
        canvasContext.drawImage(imgRef.current, 0, 0);
        (_b =
          (_a = imgRef.current) === null || _a === void 0
            ? void 0
            : _a.parentElement) === null || _b === void 0
          ? void 0
          : _b.removeChild(imgRef.current);
        annotations.forEach(function (anot) {
          canvasContext.fillStyle = styles.boudingBoxFill;
          canvasContext.strokeStyle = styles.boudingBoxStroke;
          let _a = anot.coordinates,
            x = _a.x,
            y = _a.y,
            height = _a.height,
            width = _a.width;
          x = x - width / 2;
          y = y - height / 2;
          if (!styles.disableFill) {
            canvasContext === null || canvasContext === void 0
              ? void 0
              : canvasContext.rect(x, y, width, height);
            canvasContext.globalAlpha = styles.boundingBoxOpacity;
            canvasContext === null || canvasContext === void 0
              ? void 0
              : canvasContext.fill();
          }
          if (!styles.disableStroke) {
            canvasContext === null || canvasContext === void 0
              ? void 0
              : canvasContext.rect(x - 1, y - 1, width + 1, height + 1);
            canvasContext.globalAlpha = 1;
            canvasContext === null || canvasContext === void 0
              ? void 0
              : canvasContext.stroke();
          }
          if (!styles.disableLabel) {
            canvasContext.font = styles.boundingBoxTextFont;
            const texWidth =
              canvasContext === null || canvasContext === void 0
                ? void 0
                : canvasContext.measureText(anot.label).width;
            canvasContext.fillStyle = styles.boundingBoxTextColor;
            const textPosition = styles.boundingBoxTextPosition;
            const textCoordinates =
              textPosition === 0
                ? { x: x, y: y }
                : textPosition === 1
                ? { x: x + width - texWidth, y: y }
                : textPosition === 2
                ? { x: x, y: y + height }
                : textPosition === 3
                ? { x: x + width - texWidth, y: y + height }
                : { x: x + width / 2 - texWidth / 2, y: y + height / 2 };
            canvasContext === null || canvasContext === void 0
              ? void 0
              : canvasContext.fillText(
                  anot.label,
                  textCoordinates.x,
                  textCoordinates.y
                );
          }
        });
      };
    }
  });

  const [error, setError] = useState(false);
  const handleImageError = () => {
    setError(true);
  };
  return (
    <>
      {error ? (
        <p>Image does not exist</p>
      ) : (
        <>
          <img
            ref={imgRef}
            src={image}
            style={{ display: 'none' }}
            onError={() => handleImageError()}
          />
          <canvas ref={canvasRef}></canvas>
        </>
      )}
    </>
  );
};
export default ObjectVisualizer;

export type BoundingBoxStyles = {
  boudingBoxFill?: string;
  boudingBoxStroke?: string;
  boundingBoxOpacity?: number;
  boundingBoxTextColor?: string;
  boundingBoxTextFont?: string;
  boundingBoxTextPosition?: TextPosition;
  disableLabel?: boolean;
  disableStroke?: boolean;
  disableFill?: boolean;
};
export enum TextPosition {
  TopLeft = 0,
  TopRight = 1,
  BottomLeft = 2,
  BottomRight = 3,
  Center = 4,
}

export type ObjectDetectionVisualizerProps = {
  image: string;
  annotations: Annotation[];
  boundingBoxStyles?: BoundingBoxStyles;
};
/**
 *Coordinates and Label of the bounding box accoridng to the createML Annotation format
 */
declare type Annotation = {
  label: string;
  coordinates: Coordinate;
};
/**
 * Coordinates of bounding box according to the createML Annotation format (x and y are coordinates of the center)
 */
declare type Coordinate = {
  x: number;
  y: number;
  width: number;
  height: number;
};
