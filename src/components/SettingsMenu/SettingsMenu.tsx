import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';
import useCloudAuthStore from '@store/cloud-auth-store';

import PopupModal from '@components/PopupModal';
import SettingIcon from '@icon/SettingIcon';
import LanguageSelector from '@components/LanguageSelector';

import InlineLatexToggle from './InlineLatexToggle';

import PromptLibraryMenu from '@components/PromptLibraryMenu';
import ChatConfigMenu from '@components/ChatConfigMenu';
import EnterToSubmitToggle from './EnterToSubmitToggle';
import ClearConversation from '@components/Menu/MenuOptions/ClearConversation';

const SettingsMenu = () => {
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <a
        className='flex py-2 px-2 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm'
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        <SettingIcon className='w-4 h-4' /> {t('setting') as string}
      </a>
      {isModalOpen && (
        <PopupModal
          setIsModalOpen={setIsModalOpen}
          title={t('setting') as string}
          cancelButton={false}
        >
          <div className='p-6 border-b border-gray-200 dark:border-gray-600 flex flex-col items-center gap-4'>
            <LanguageSelector />
            <div className='flex flex-col gap-3'>
              <EnterToSubmitToggle />
              <InlineLatexToggle />
            </div>
            <ClearConversation />
            <PromptLibraryMenu />
            <ChatConfigMenu />
          </div>
        </PopupModal>
      )}
    </>
  );
};

export default SettingsMenu;
