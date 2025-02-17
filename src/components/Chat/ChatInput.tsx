import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';

import RefreshIcon from '@icon/RefreshIcon';
import SendIcon from '@icon/SendIcon';
import useSubmit from '@hooks/useSubmit';

import { ChatInterface } from '@type/chat';
import FileChipList from './FileChip';

import { MessageContentList } from '@type/chat';

import './chat.css';




const ChatInput = ({files}: {files: File[]}) => {

  const [_files, setFiles] = useState<File[]>(files);
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

  const handleGenerate = () => {
    if (useStore.getState().generating) return;
    const updatedChats: ChatInterface[] = JSON.parse(
      JSON.stringify(useStore.getState().chats)
    );
    
    const updatedMessages = updatedChats[currentChatIndex].messages;
    
    const content_list:MessageContentList[] = [{
      'type': 'text',
      'text': _content
    }]

    if (files && files.length > 0)
    {
      content_list.push(
        ...files.map(file => {
          return {
            'type': 'image_url',
            'image_url': {
              'url': URL.createObjectURL(file)
            }
          }
        })
      )
    }

    if (_content !== '') {
      updatedMessages.push({ role: inputRole, content: _content });
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

  
  return (
    <div className='absolute bottom-0 w-full m-auto border-t md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:bg-vert-light-gradient bg-white dark:bg-gray-800 md:!bg-transparent dark:md:bg-vert-dark-gradient'>
      <form className='stretch mx-2 flex flex-row gap-3 pt-2 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl lg:pt-6'>
          
          <FileChipList files={_files} onRemove={() => {}} />

          <div className='flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-xl shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]'>
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

            <button aria-label='submit' className='absolute p-1 rounded-md text-gray-500 bottom-1.5 right-1 md:bottom-2.5 md:right-2 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent'>
              <SendIcon />
            </button>
          </div>
      </form>
    </div>
  );
};


export default ChatInput;
