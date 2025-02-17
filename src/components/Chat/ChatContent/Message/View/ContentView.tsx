import React, {
  DetailedHTMLProps,
  HTMLAttributes,
  memo,
  useState,
} from 'react';

import ReactMarkdown from 'react-markdown';
import { CodeProps, ReactMarkdownProps } from 'react-markdown/lib/ast-to-react';

import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import useStore from '@store/store';

import TickIcon from '@icon/TickIcon';
import CrossIcon from '@icon/CrossIcon';

import useSubmit from '@hooks/useSubmit';

import { ChatInterface } from '@type/chat';

import { codeLanguageSubset } from '@constants/chat';


import CopyButton from './Button/CopyButton';
import EditButton from './Button/EditButton';
import DeleteButton from './Button/DeleteButton';
import MarkdownModeButton from './Button/MarkdownModeButton';

import CodeBlock from '../CodeBlock';

const ContentView = memo(
  ({
    content,
    setIsEdit,
    messageIndex,
    role,
  }: {
    content: string;
    setIsEdit?: React.Dispatch<React.SetStateAction<boolean>>;
    messageIndex: number;
    role: string;
  }) => {
    const { handleSubmit } = useSubmit();

    const [isDelete, setIsDelete] = useState<boolean>(false);

    const currentChatIndex = useStore((state) => state.currentChatIndex);
    const setChats = useStore((state) => state.setChats);

    const inlineLatex = useStore((state) => state.inlineLatex);
    const markdownMode = useStore((state) => state.markdownMode);

    const handleDelete = () => {
      const updatedChats: ChatInterface[] = JSON.parse(
        JSON.stringify(useStore.getState().chats)
      );
      updatedChats[currentChatIndex].messages.splice(messageIndex, 1);
      setChats(updatedChats);
    };



    const handleCopy = () => {
      navigator.clipboard.writeText(content);
    };

    return (
      <>
        <div className={`markdown prose prose-invert break-words ${role === 'user' ? 'self-end bg-white bg-opacity-5 rounded-full pr-4 pl-4 pt-2 pb-2' : ''}`}>
          {markdownMode ? (
            <ReactMarkdown
              remarkPlugins={[
                remarkGfm,
                [remarkMath, { singleDollarTextMath: inlineLatex }],
              ]}
              rehypePlugins={[
                rehypeKatex,
                [
                  rehypeHighlight,
                  {
                    detect: true,
                    ignoreMissing: true,
                    subset: codeLanguageSubset,
                  },
                ],
              ]}
              linkTarget='_new'
              components={{
                code,
                p,
              }}
            >
              {content}
            </ReactMarkdown>
          ) : (
            <span className='whitespace-pre-wrap'>{content}</span>
          )}
        </div>
      </>
    );
  }
);

const code = memo((props: CodeProps) => {
  const { inline, className, children } = props;
  const match = /language-(\w+)/.exec(className || '');
  const lang = match && match[1];

  if (inline) {
    return <code className={className}>{children}</code>;
  } else {
    return <CodeBlock lang={lang || 'text'} codeChildren={children} />;
  }
});

const p = memo(
  (
    props?: Omit<
      DetailedHTMLProps<
        HTMLAttributes<HTMLParagraphElement>,
        HTMLParagraphElement
      >,
      'ref'
    > &
      ReactMarkdownProps
  ) => {
    return <p className='whitespace-pre-wrap'>{props?.children}</p>;
  }
);


// This component is used to control the content of the message
// [CASSAL][TODO] REMOVED FOR NOW, NEED TO UNDERSTAND IF WE WANT TO KEEP IT
const ContentControls = memo(({
  isDelete,
  setIsDelete,
  messageIndex,
  handleCopy,
  handleDelete,
  setIsEdit,
}: {
  isDelete: boolean;
  setIsDelete: React.Dispatch<React.SetStateAction<boolean>>;
  messageIndex: number;
  handleCopy: () => void;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  handleDelete: () => void;
}) => {
  
  return (
    <div className='flex flex-row justify-end gap-2 w-full mt-2'>
      {isDelete || (
        <>
          <MarkdownModeButton />
          <CopyButton onClick={handleCopy} />
          <EditButton setIsEdit={setIsEdit} />
          <DeleteButton setIsDelete={setIsDelete} />
        </>
      )}
      {isDelete && (
        <>
          <button
            className='p-1 hover:text-white'
            aria-label='cancel'
            onClick={() => setIsDelete(false)}
          >
            <CrossIcon />
          </button>
          <button
            className='p-1 hover:text-white'
            aria-label='confirm'
            onClick={handleDelete}
          >
            <TickIcon />
          </button>
        </>
      )}
    </div>
  )
})



export default ContentView;
