import { applyRatio } from './number';
import { CTR_MAX_PLAYERS, MIME_JPEG, MIME_PNG } from '../constants';
import { Category, Coord } from '../types';
import { sortAlphanumeric } from './string';

const getMimeType = (extension: string) => {
  if (!extension) return MIME_JPEG;

  const isPng = extension.toLowerCase() === 'png';

  return isPng ? MIME_PNG : MIME_JPEG;
};

// TODO: for All, index is actually the number of players
const getExtract = (info: any, index = 0, category: Category) => {
  const { width, height } = info;
  const left = applyRatio(0.64, width);
  const top = applyRatio(0.265, height);
  const widthCrop = applyRatio(0.27, width);
  const heightCrop = applyRatio(0.425, height);

  if (category === Category.All) {
    const ratioHeight = index / CTR_MAX_PLAYERS;
    const extract: Coord = {
      height: applyRatio(ratioHeight, heightCrop),
      left,
      top,
      width: widthCrop
    };

    return extract;
  }

  const ratioTime = 0.73;
  const ratioEnd = 0.03;
  const ratioLeftOffsetName = 0.27;
  const ratioEndPosition = 0.1;
  const antiRatioTime = 1 - ratioTime - ratioEnd;

  const rectangle = {
    top: applyRatio(index / 8, heightCrop),
    height: applyRatio(1 / 8, heightCrop)
  };

  const topExt = top + rectangle.top;
  const heightExt = rectangle.height;

  if (category === Category.Position) {
    const extract: Coord = {
      height: heightExt,
      left: left,
      top: topExt,
      width: applyRatio(ratioEndPosition, widthCrop)
    };

    return extract;
  }

  const leftExtTime = left + applyRatio(ratioTime, widthCrop);
  const widthExtTime = applyRatio(antiRatioTime, widthCrop);

  const leftExtName = left + applyRatio(ratioLeftOffsetName, widthCrop);
  const widthExtName = applyRatio(1 - antiRatioTime - ratioLeftOffsetName - ratioEnd, widthCrop);

  const isTime = category === Category.Time;
  const leftExt = isTime ? leftExtTime : leftExtName;
  const widthExt = isTime ? widthExtTime : widthExtName;

  const extract: Coord = {
    height: heightExt,
    left: leftExt,
    top: topExt,
    width: widthExt
  };

  return extract;
};

const getFilenameWithoutExtension = (filename: string) => {
  if (!filename) return '';

  const splits = filename.split('.');

  return splits[0];
};

const sortImagesByFilename = (images: any[]) => {
  if (images.length === 0) return [];
  if (images.length === 1) return images;

  const sortedImages = images.sort((imageA: any, imageB: any) => {
    const { name: nameA } = imageA;
    const { name: nameB } = imageB;

    const newNameA = getFilenameWithoutExtension(nameA);
    const newNameB = getFilenameWithoutExtension(nameB);

    return sortAlphanumeric(newNameA, newNameB);
  });

  return sortedImages;
};

export { getFilenameWithoutExtension, getMimeType, getExtract, sortImagesByFilename };
