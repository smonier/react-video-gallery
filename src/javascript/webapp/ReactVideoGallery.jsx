import React from 'react';
import ReactDOM from 'react-dom/client';
import {ApolloProvider} from '@apollo/client';
import {JahiaCtxProvider, CxsCtxProvider} from './contexts';
import AjvError from './components/Error/Ajv';
import {contextValidator} from './douane';

// Import {StylesProvider, createGenerateClassName} from '@material-ui/core/styles';
// import {getRandomString} from './ShoppingCart/misc/utils';

import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {appLanguageBundle} from './i18n/resources';
import {syncTracker} from './unomi/trackerWem';
import {getClient} from './webappGraphql';
import ReactVideoGallery from './components/ReactVideoGallery/ReactVideoGallery';

const render = async (target, context) => {
    try {
        context = contextValidator(context);
        const {
            workspace,
            locale,
            scope,
            gqlServerUrl,
            contextServerUrl,
            reactVideoGalleryId
        } = context;

        await i18n
            .use(initReactI18next)
            .init({
                resources: appLanguageBundle,
                lng: locale,
                fallbackLng: 'en',
                interpolation: {escapeValue: false}
            });
        const isPreview = workspace !== 'LIVE';
        const isEditing = window.parent.jahiaGWTParameters !== undefined;

        const client = getClient(gqlServerUrl);
        // Const reactVideoGalleryData = await getReactVideoGallery({client, workspace, locale, reactVideoGalleryId});

        i18n.use(initReactI18next) // Passes i18n down to react-i18next
            .init({
                resources: appLanguageBundle,
                lng: locale,
                fallbackLng: 'en',
                interpolation: {
                    escapeValue: false // React already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
                }
            });

        if (workspace === 'LIVE' && !window.wem && contextServerUrl) {
            if (!window.digitalData) {
                window.digitalData = {
                    _webapp: true,
                    scope,
                    site: {
                        siteInfo: {
                            siteID: scope
                        }
                    },
                    page: {
                        pageInfo: {
                            pageID: 'WebApp-Jahia-ReactVideoGallery',
                            pageName: document.title,
                            pagePath: document.location.pathname,
                            destinationURL: document.location.origin + document.location.pathname,
                            language: locale,
                            categories: [],
                            tags: []
                        }
                    },
                    events: [],
                    wemInitConfig: {
                        contextServerUrl,
                        timeoutInMilliseconds: '1500',
                        // ContextServerCookieName: "context-profile-id",
                        activateWem: true,
                        // TrackerProfileIdCookieName: "wem-profile-id",
                        trackerSessionIdCookieName: 'wem-session-id'
                    },
                    isEditing
                };
            }

            window.wem = syncTracker();
        }

        const root = ReactDOM.createRoot(document.getElementById(target));

        root.render(
            <React.StrictMode>
                <JahiaCtxProvider value={{
                    workspace,
                    locale,
                    scope,
                    isPreview,
                    contextServerUrl,
                    reactVideoGalleryId,
                    client,
                    isEditing
                }}
                >
                    <CxsCtxProvider>
                        <ApolloProvider client={client}>
                            <ReactVideoGallery/>
                        </ApolloProvider>
                    </CxsCtxProvider>
                </JahiaCtxProvider>
            </React.StrictMode>
        );
    } catch (e) {
        console.error('error : ', e);
        // Note: create a generic error handler
        return (
            <AjvError
                item={e.message}
                errors={e.errors}
            />
        );
    }
};

window.reactVideoGalleryUIApp = render;
