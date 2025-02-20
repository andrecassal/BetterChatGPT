import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';

import RefreshIcon from '@icon/RefreshIcon';
import SendIcon from '@icon/SendIcon';
import useSubmit from '@hooks/useSubmit';

import { ChatInterface } from '@type/chat';
import FileChipList from './FileChip';

import { MessageContentList } from '@type/chat';

import './chat.css';
import PlusIcon from '@icon/PlusIcon';




const ChatInput = ({files, setFiles}: {files: File[], setFiles: Function}) => {

  const inputRole = useStore((state) => state.inputRole);
  const setChats = useStore((state) => state.setChats);
  const currentChatIndex = useStore((state) => state.currentChatIndex);
  const sticky = useState<boolean>(false);
  const [_content, _setContent] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const textareaRef = React.createRef<HTMLTextAreaElement>();

  const { t } = useTranslation();

  const resetTextAreaHeight = () => {
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|playbook|silk/i.test(
        navigator.userAgent
      );

    if (e.key === 'Enter' && !isMobile && !e.nativeEvent.isComposing) {
      const enterToSubmit = useStore.getState().enterToSubmit;

      if (e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        handleGenerate();
        resetTextAreaHeight();
      }
      else if ((enterToSubmit && !e.shiftKey) || (!enterToSubmit && (e.ctrlKey || e.shiftKey))) 
      {
        e.preventDefault();
        handleGenerate();
        resetTextAreaHeight();
      }
    }
  };

  

  const { handleSubmit } = useSubmit();

  const handleGenerate = async () => {
    if (useStore.getState().generating) return;
    const updatedChats: ChatInterface[] = JSON.parse(
      JSON.stringify(useStore.getState().chats)
    );
    
    const updatedMessages = updatedChats[currentChatIndex].messages;
    
    const content_list:MessageContentList[] = [{
      'type': 'text',
      'text': _content
    }]

    if (files && files.length > 0) {
      const filePromises = files.map(async file => {
        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        return {
          'type': 'image_url',
          'image_url': {
            'url': `data:${file.type};base64,${base64}`
          }
        };
      });

      const fileContents = await Promise.all(filePromises);
      content_list.push(...fileContents);
    }

    if (_content !== '') {
      updatedMessages.push({ role: inputRole, content: content_list });
    }

    _setContent('');
    setFiles([]);
    resetTextAreaHeight();

    setChats(updatedChats);
    handleSubmit();
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [_content]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  useEffect(() => {
    console.log(files);
  }, [files]);
  
  return (
    <div className='absolute bottom-0 w-full m-auto border-t md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:bg-vert-light-gradient bg-white dark:bg-gray-800 md:!bg-transparent dark:md:bg-vert-dark-gradient'>
      <form className='stretch mx-2 flex flex-row gap-3 pt-2 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl lg:pt-6'>
          
          <div className='flex flex-col w-full p-2 gap-4 flex-grow relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-xl shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]'>
            
            <FileChipList files={files} onRemove={(file) => { setFiles(files.filter(f => f !== file)) }} />
            <div className='flex flex-row gap-2 items-center justify-center'>
              <UploadButton onClick={(files) => { setFiles(files) }} />
              <textarea
                ref={textareaRef}
                tabIndex={0}
                data-id='2557e994-6f98-4656-a955-7808084f8b8c'
                rows={1}
                className='m-0 w-full resize-none border-0 bg-transparent p-0 pl-2 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent md:pl-0'
                style={{ maxHeight: '200px', height: '24px', overflowY: 'hidden' }}
                onChange={(e) => {
                  _setContent(e.target.value);
                }}
                value={_content}
                placeholder={t('submitPlaceholder') as string}
                onKeyDown={handleKeyDown}
              ></textarea>
              <SendButton onClick={handleGenerate} />
            </div>
          </div>
      </form>
    </div>
  );
};


const UploadButton = ({onClick, disabled}: {onClick: (files: File[]) => void, disabled?: false}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log('handleFileSelect', files);
    if (files) {
      onClick(Array.from(files));
    }
  };

  return (
    <label aria-label='submit' className='flex h-9 w-9 items-center justify-center border border-white/30 hover:border-white/50 rounded-full px-2'>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="" className="h-[18px] w-[18px]"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C12.5523 3 13 3.44772 13 4L13 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13L13 13L13 20C13 20.5523 12.5523 21 12 21C11.4477 21 11 20.5523 11 20L11 13L4 13C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11L11 11L11 4C11 3.44772 11.4477 3 12 3Z" fill="currentColor"></path></svg>
      <input
        type="file"
        multiple
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        ref={fileInputRef}
      />
    </label>
  );
};


const SendButton = ({onClick, disabled}: {onClick?: () => void, disabled?: false}) => {
  return (
    <button aria-label='submit' disabled={disabled} onClick={onClick} className='flex h-9 w-9 items-center justify-center px-2 rounded-full transition-colors hover:opacity-70 focus-visible:outline-none focus-visible:outline-black disabled:text-[#f4f4f4] disabled:hover:opacity-100 dark:focus-visible:outline-white disabled:dark:bg-token-text-quaternary dark:disabled:text-token-main-surface-secondary bg-black text-white dark:bg-white dark:text-black disabled:bg-[#D7D7D7]'>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{'strokeWidth': '1.5','flexShrink': 0,'height': '2rem','width': '2rem'}}><path fill-rule="evenodd" clip-rule="evenodd" d="M15.1918 8.90615C15.6381 8.45983 16.3618 8.45983 16.8081 8.90615L21.9509 14.049C22.3972 14.4953 22.3972 15.2189 21.9509 15.6652C21.5046 16.1116 20.781 16.1116 20.3347 15.6652L17.1428 12.4734V22.2857C17.1428 22.9169 16.6311 23.4286 15.9999 23.4286C15.3688 23.4286 14.8571 22.9169 14.8571 22.2857V12.4734L11.6652 15.6652C11.2189 16.1116 10.4953 16.1116 10.049 15.6652C9.60265 15.2189 9.60265 14.4953 10.049 14.049L15.1918 8.90615Z" fill="currentColor"></path></svg>
    </button>
  );
};


export default ChatInput;
