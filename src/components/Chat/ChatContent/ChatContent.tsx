import React, { useEffect } from 'react';

import useStore from '@store/store';

import Message from './Message';

import useSubmit from '@hooks/useSubmit';


const ChatContent = () => {

  const setError = useStore((state) => state.setError);
  const messages = useStore((state) =>
    state.chats &&
    state.chats.length > 0 &&
    state.currentChatIndex >= 0 &&
    state.currentChatIndex < state.chats.length
      ? state.chats[state.currentChatIndex].messages
      : []
  );


  const generating = useStore.getState().generating;


  // clear error at the start of generating new messages
  useEffect(() => {
    if (generating) {
      setError('');
    }
  }, [generating]);

  const { error } = useSubmit();

  return (
    <div className='h-full scroll-smooth overflow-y-auto flex flex-col items-center pt-8 pb-32'>


            {messages?.map((message, index) => (
              (index !== 0 || message.role !== 'system') && (
                  <Message
                    key={index}
                    role={message.role}
                    content={message.content}
                    messageIndex={index}
                  />
              )
            ))}


          {error !== '' && <ErrorMessage error={error} />}



    </div>
  );
};




const ErrorMessage = ({error}: {error: string}) => {
  return (
    <div className='relative py-2 px-3 w-3/5 mt-3 max-md:w-11/12 border rounded-md border-red-500 bg-red-500/10'>
      <div className='text-gray-600 dark:text-gray-100 text-sm whitespace-pre-wrap'>
        {error}
      </div>
    </div>
  );
}




export default ChatContent;
