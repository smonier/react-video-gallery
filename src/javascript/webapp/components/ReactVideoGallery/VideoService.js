import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {Dialog, DialogTitle, DialogContent, DialogActions, Button, Divider} from '@mui/material';
import ReactPlayer from 'react-player';
import {useTranslation} from 'react-i18next';

const VideoService = ({open, handleClose, videoTitle, videoService, videoId, videoUrl}) => {
    const {t} = useTranslation();
    const isFullScreen = videoService?.toLowerCase() === 'storylane';
    useEffect(() => {
        if (isFullScreen && open) {
            // Dynamically load the Storylane script
            const script = document.createElement('script');
            script.src = 'https://js.storylane.io/js/v2/storylane.js';
            script.async = true;
            document.body.appendChild(script);

            return () => {
                document.body.removeChild(script);
            };
        }
    }, [isFullScreen, open]);
    const renderVideoContent = () => {
        switch (videoService?.toLowerCase()) {
            case 'storylane':
                return (
                    <div>
                        <div className="sl-embed"
                             style={{position: 'relative',
                                paddingBottom: '56.25%',
                                width: '100%',
                                height: '0',
                                transform: 'scale(0.9)'}}
                        >
                            <iframe
                                allowFullScreen
                                loading="lazy"
                                className="sl-demo video-frame"
                                src={`https://jahia.storylane.io/demo/${videoId}?embed=inline`}
                                name="sl-embed"
                                allow="fullscreen"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    border: '1px solid rgba(63,95,172,0.35)',
                                    boxShadow: '0px 0px 18px rgba(26, 19, 72, 0.15)',
                                    borderRadius: '10px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                    </div>
                );
            case 'vimeo':
                return <ReactPlayer controls url={`https://player.vimeo.com/video/${videoId}`} width="100%" height="100%"/>;
            case 'wistia':
                return <ReactPlayer controls url={`https://fast.wistia.net/embed/iframe/${videoId}`} width="100%" height="100%"/>;
            case 'youtube':
                return (
                    <iframe
                            allowFullScreen
                            width="100%"
                            height="90%"
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title="Youtube Video Player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '90%',
                                border: '1px solid rgba(63,95,172,0.35)',
                                boxShadow: '0px 0px 18px rgba(26, 19, 72, 0.15)',
                                borderRadius: '10px',
                                boxSizing: 'border-box'
                            }}
                        />
                );
            case
                'internal':
                return <ReactPlayer controls url={videoUrl} width="100%" height="100%"/>;
            default:
                return <p>Unsupported video service.</p>;
        }
    };

    return (
        <Dialog fullScreen={isFullScreen}
                fullWidth={!isFullScreen}
                open={open}
                maxWidth={isFullScreen ? false : 'md'}
                sx={{margin: 'auto'}}
                onClose={handleClose}
        >
            <DialogTitle sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                {videoTitle}
                {isFullScreen && (
                    <DialogActions sx={{justifyContent: 'flex-end'}}>
                        <Button color="primary" variant="contained" onClick={handleClose}>{t('button.close')}</Button>
                    </DialogActions>
                )}
            </DialogTitle>
            <Divider/>
            <DialogContent sx={{width: '100%', height: isFullScreen ? '100vh' : '560px', alignItems: 'center', justifyContent: 'center'}}>
                {renderVideoContent()}
            </DialogContent>
            <Divider/>
            {!isFullScreen && (
                <DialogActions sx={{justifyContent: 'flex-end'}}>
                    <Button color="primary" variant="contained" onClick={handleClose}>{t('button.close')}</Button>
                </DialogActions>
            )}
        </Dialog>
    );
};

VideoService.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    videoTitle: PropTypes.string,
    videoService: PropTypes.string.isRequired,
    videoId: PropTypes.string,
    videoUrl: PropTypes.string
};

export default VideoService;
