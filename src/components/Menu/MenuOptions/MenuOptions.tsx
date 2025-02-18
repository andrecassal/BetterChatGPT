import React from 'react';
import useStore from '@store/store';

import Api from './Api';
import AboutMenu from '@components/AboutMenu';
import ImportExportChat from '@components/ImportExportChat';
import SettingsMenu from '@components/SettingsMenu';
import CollapseOptions from './CollapseOptions';
import GoogleSync from '@components/GoogleSync';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || undefined;

const MenuOptions = () => {
  const hideMenuOptions = useStore((state) => state.hideMenuOptions);
  return (
    <>
      <CollapseOptions />
      <div
        className={`${
          hideMenuOptions ? 'max-h-0' : 'max-h-full'
        } overflow-hidden transition-all`}
      >
        {googleClientId && <GoogleSync clientId={googleClientId} />}
        <AboutMenu />
        <ImportExportChat />
        <Api />
        <SettingsMenu />
      </div>
    </>
  );
};

export default MenuOptions;
