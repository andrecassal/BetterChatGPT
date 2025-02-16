import React, { useState } from 'react';
import useStore from '@store/store';

import ContentView from './View/ContentView';
import EditView from './View/EditView';


import { Role } from '@type/chat';



const Message = React.memo(
  ({
    role,
    content,
    messageIndex,
    sticky = false,
  }: {
    role: Role;
    content: string;
    messageIndex: number;
    sticky?: boolean;
  }) => {
    const [isEdit, setIsEdit] = useState<boolean>(sticky);

    
    return (
      <div
        id={`message-${messageIndex}`}
        data-role={role}
        role="row"
        className={' w-1/2 flex flex-col '}
      >

        {isEdit ? (
          <EditView
            content={content}
            setIsEdit={setIsEdit}
            messageIndex={messageIndex}
            sticky={sticky}
          />
        ) : (
          <ContentView
            role={role}
            content={content}
            setIsEdit={setIsEdit}
            messageIndex={messageIndex}
          />
        )}

      </div>
    );
  }
);

export default Message;
