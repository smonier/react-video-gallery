// ConfigContext.js
import React, {createContext, useContext} from 'react';
import {reactVideoGalleryData} from './types';

const ConfigContext = createContext(null);

// eslint-disable-next-line react/prop-types
export const ConfigProvider = ({children, reactVideoGalleryData}) => {
    const config = {
        host: process.env.REACT_APP_JCONTENT_HOST,
        workspace: process.env.REACT_APP_JCONTENT_WORKSPACE,
        files: process.env.REACT_APP_JCONTENT_FILES_ENDPOINT,
        gqlServerUrl: process.env.REACT_APP_JCONTENT_GQL_ENDPOINT,
        contextServerUrl: process.env.REACT_APP_JCUSTOMER_ENDPOINT,
        reactVideoGalleryTitle: reactVideoGalleryData.title

    };

    return (
        <ConfigContext.Provider value={config}>
            {children}
        </ConfigContext.Provider>
    );
};

ConfigProvider.propTypes = {
    reactVideoGalleryData
};

export const useConfig = () => useContext(ConfigContext);
