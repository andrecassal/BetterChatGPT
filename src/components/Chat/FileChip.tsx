import React, { useState } from 'react';

/**
 * Component that displays a list of file chips and handles file removal
 */
interface FileChipListProps {
  files: File[];
  onRemove?: (file: File) => void;
  isInteractive?: boolean;
}

const FileChipList: React.FC<FileChipListProps> = ({ files, onRemove, isInteractive = true }) => {
  if(files.length === 0) {
    return null;
  }
  return (
    <div className="flex flex-row flex-wrap gap-2 pb-2">
      {files.map((file) => (
        <FileChip key={file.name} filename={file.name} isInteractive={isInteractive} onRemove={() => onRemove && onRemove(file)} />
      ))}
    </div>
  );
};

/**
 * Props for individual file chip components
 */
interface FileChipProps {
    filename: string;
    onRemove?: () => void;
    isInteractive?: boolean;
}
  
/**
 * Possible document type categories for files
 */
type DocumentType = 'Document' | 'Image' | 'Table' | 'Data' | 'File';
  
/**
 * Component that displays a single file chip with icon, name, type and remove button
 */
const FileChip: React.FC<FileChipProps> = ({ filename, onRemove, isInteractive = true }) => {
  const [isHovered, setIsHovered] = useState(false);
  const selfOnRemove = () => {
    onRemove && onRemove();
  };

  /**
   * Extracts file extension from filename
   */
  const getFileType = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase() || '';
    return extension;
  };

  /**
   * Maps file extensions to document type categories
   */
  const getDocumentType = (fileType: string): DocumentType => {
    const upperFileType = fileType.toUpperCase();
    
    if (upperFileType === 'PDF' || ['DOC', 'DOCX'].includes(upperFileType)) {
      return 'Document';
    }
    if (['JPG', 'JPEG', 'PNG', 'GIF', 'WEBP'].includes(upperFileType)) {
      return 'Image';
    }
    if (['CSV', 'TSV', 'XLS', 'XLSX'].includes(upperFileType)) {
      return 'Table';
    }
    if (upperFileType === 'JSON') {
      return 'Data';
    }
    return 'File';
  };

  /**
   * Returns SVG path for file type icon based on extension
   */
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'txt':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        );
      case 'pdf':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2zm0 0V5" />
        );
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        );
      case 'csv':
      case 'tsv':
      case 'xls':
      case 'xlsx':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z" />
        );
      case 'json':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        );
      case 'doc':
      case 'docx':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z M12 18v-6" />
        );
      default:
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        );
    }
  };

  /**
   * Returns background color class based on file type
   */
  const getBackgroundColor = (fileType: string): string => {
    switch (fileType) {
      case 'txt':
        return 'bg-pink-500';
      case 'pdf':
        return 'bg-red-500';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return 'bg-blue-500';
      case 'csv':
      case 'tsv':
      case 'xls':
      case 'xlsx':
        return 'bg-green-500';
      case 'json':
        return 'bg-yellow-500';
      case 'doc':
      case 'docx':
        return 'bg-indigo-500';
      default:
        return 'bg-gray-500';
    }
  };

  const fileType = getFileType(filename);
  const backgroundColor = getBackgroundColor(fileType);
  const documentType = getDocumentType(fileType);

  return (
    <div className={`flex items-center flex-row gap-2 px-3 py-2 bg-gray-800 rounded-lg max-w-xs relative`} 
        title={filename} 
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)}>

      {isInteractive && (
        <button onClick={selfOnRemove} className={`text-gray-400 bg-white rounded-full p-1 absolute -top-2 -left-2 ${isHovered ? 'visible' : 'invisible'}`}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      )}

      <div className={`w-8 h-8 ${backgroundColor} rounded-lg flex items-center justify-center px-2`}>
        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          {getFileIcon(fileType)}
        </svg>
      </div>
      <div className="flex grow flex-col w-96">
        <div className="text-white text-sm text-ellipsis overflow-hidden inline-block w-64">{filename}</div>
        <div className="text-gray-400 text-xs">{documentType}</div>
      </div>
      
    </div>
  );
};

export default FileChipList;
