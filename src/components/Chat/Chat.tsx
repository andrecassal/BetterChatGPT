import React, {DragEvent, useState} from 'react';
import useStore from '@store/store';

import ChatContent from './ChatContent';
import MobileBar from '../MobileBar';
import StopGeneratingButton from '@components/StopGeneratingButton/StopGeneratingButton';
import ChatInput from './ChatInput';

const Chat = () => {
  const hideSideMenu = useStore((state) => state.hideSideMenu);
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleDragOn = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOff = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    setFiles(files);
    console.log(files);
  };

  


  return (
    <div
      id='chat-container'
      className={`flex h-full flex-1 flex-col ${
        hideSideMenu ? 'md:pl-0' : 'md:pl-[260px]'
      }`}
      onDragOver={handleDragOn}
      onDragEnter={handleDragOn}
      onDragLeave={handleDragOff}
      onDrop={handleDrop}
    >
      <MobileBar />
      <main className='relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1'>
        <ChatContent />
        <ChatInput files={files} />
        <StopGeneratingButton />
        <DroppingArea enabled={isDragging} />
      </main>
    </div>
  );
};


const DroppingArea = ({enabled}: {enabled: boolean}) => {
  if(!enabled) return null;
  return (
    <div className='absolute inset-0 bg-black/80 pointer-events-none flex items-center justify-center prose prose-invert text-4xl'>
      <p className='text-center animate-pulse'>Drop files here</p>
    </div>
  );
};





export default Chat;


