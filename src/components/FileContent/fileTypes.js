import React from 'react';
import { PiFilePdf, PiImageSquare, PiVideo } from 'react-icons/pi';
import { apps } from '../../shared/js/apps';

export const supportedFileTypes = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  PDF: 'PDF',
};

export const supportedFileIcon = {
  [supportedFileTypes.IMAGE]: <PiImageSquare color={apps.file37.color} />,
  [supportedFileTypes.VIDEO]: <PiVideo color={apps.file37.color} />,
  [supportedFileTypes.PDF]: <PiFilePdf color={apps.file37.color} />,
};
