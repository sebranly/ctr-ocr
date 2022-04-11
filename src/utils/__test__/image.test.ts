import { Category } from '../../types';
import { getExtract, getFilenameWithoutExtension, getMimeType, sortImagesByFilename } from '../image';

test('getFilenameWithoutExtension', () => {
  expect(getFilenameWithoutExtension('')).toBe('');
  expect(getFilenameWithoutExtension('name')).toBe('name');
  expect(getFilenameWithoutExtension('name.JPG')).toBe('name');
  expect(getFilenameWithoutExtension('name.JPEG')).toBe('name');
  expect(getFilenameWithoutExtension('name.PNG')).toBe('name');
  expect(getFilenameWithoutExtension('name.PNG.JPG')).toBe('name');
});

test('sortImagesByFilename', () => {
  const image1 = { name: 'IMG1.JPG' };
  const image2 = { name: 'IMG02.JPEG' };
  const image3 = { name: 'IMG000003.PNG' };
  const image4 = { name: 'IMG4.PNG' };
  const image5 = { name: 'IMG5.JPG' };
  const image6 = { name: 'IMG6' };
  const image7 = { name: 'IMG7.JPG' };
  const image8 = { name: 'IMG08.JPG' };
  const image9 = { name: 'IMG9.JPG' };
  const image10 = { name: 'IMG10.JPG' };
  const image11 = { name: 'IMG0011.JPG' };
  const image12 = { name: 'IMG12.JPG' };

  const notSortedImages = [
    image2,
    image11,
    image1,
    image3,
    image4,
    image6,
    image5,
    image7,
    image8,
    image9,
    image12,
    image10
  ];

  const sortedImages = [
    image1,
    image2,
    image3,
    image4,
    image5,
    image6,
    image7,
    image8,
    image9,
    image10,
    image11,
    image12
  ];

  expect(sortImagesByFilename([])).toStrictEqual([]);
  expect(sortImagesByFilename([{ name: 'any.JPG' }])).toStrictEqual([{ name: 'any.JPG' }]);
  expect(sortImagesByFilename(notSortedImages)).toStrictEqual(sortedImages);
  expect(sortImagesByFilename(sortedImages)).toStrictEqual(sortedImages);

  const image1Bis = { name: 'C-Horloge.JPG' };
  const image2Bis = { name: 'D-Canyon.JPEG' };
  const image3Bis = { name: 'Z-Crash Cove.PNG' };

  const notSortedImagesBis = [image3Bis, image1Bis, image2Bis];
  const sortedImagesBis = [image1Bis, image2Bis, image3Bis];

  expect(sortImagesByFilename(notSortedImagesBis)).toStrictEqual(sortedImagesBis);
});

test('getMimeType', () => {
  expect(getMimeType('')).toBe('image/jpeg');
  expect(getMimeType('jpeg')).toBe('image/jpeg');
  expect(getMimeType('JPEG')).toBe('image/jpeg');
  expect(getMimeType('jpg')).toBe('image/jpeg');
  expect(getMimeType('JPG')).toBe('image/jpeg');
  expect(getMimeType('png')).toBe('image/png');
  expect(getMimeType('PNG')).toBe('image/png');
});

test('getExtract', () => {
  const info = { width: 4052, height: 2564 };
  const commonHeight = 136;
  const commonTop0 = 679;
  const commonTop1 = 815;
  const positionWidth = 109;
  const usernameWidth = 503;
  const timeWidth = 262;
  const expectedFullCrop = {
    height: 1089,
    left: 2593,
    top: 679,
    width: 1094
  };

  const expectedHalfCrop = {
    height: 544,
    left: 2593,
    top: 679,
    width: 1094
  };

  expect(getExtract(info, 8, Category.All)).toStrictEqual(expectedFullCrop);
  expect(getExtract(info, 4, Category.All)).toStrictEqual(expectedHalfCrop);

  expect(getExtract(info, 0, Category.Position)).toStrictEqual({
    height: commonHeight,
    left: 2593,
    top: commonTop0,
    width: positionWidth
  });

  expect(getExtract(info, 1, Category.Position)).toStrictEqual({
    height: commonHeight,
    left: 2593,
    top: commonTop1,
    width: positionWidth
  });

  expect(getExtract(info, 0, Category.Username)).toStrictEqual({
    height: commonHeight,
    left: 2888,
    top: commonTop0,
    width: usernameWidth
  });

  expect(getExtract(info, 1, Category.Username)).toStrictEqual({
    height: commonHeight,
    left: 2888,
    top: commonTop1,
    width: usernameWidth
  });

  expect(getExtract(info, 0, Category.Time)).toStrictEqual({
    height: commonHeight,
    left: 3391,
    top: commonTop0,
    width: timeWidth
  });

  expect(getExtract(info, 1, Category.Time)).toStrictEqual({
    height: commonHeight,
    left: 3391,
    top: commonTop1,
    width: timeWidth
  });
});
