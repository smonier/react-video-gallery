import React, {useCallback, useContext, useState} from 'react';
import {useQuery} from '@apollo/client';
import {
    Container,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    CircularProgress,
    IconButton,
    Box
} from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import {JahiaCtx} from '../../contexts';
import {useTranslation} from 'react-i18next';
import {GET_REACT_VIDEO_GALLERY} from '../../webappGraphql';
import VideoService from './VideoService';

const ReactVideoGallery = () => {
    const {client, workspace, locale, reactVideoGalleryId, isEditing} = useContext(JahiaCtx);
    const {t} = useTranslation();
    const [open, setOpen] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);

    const handleEditContent = useCallback(video => {
        if (!video?.uuid) {
            console.error('Error: Video ID is missing.');
            return;
        }

        // Open Jahia Content Editor
        parent.top.window.CE_API.edit(
            {uuid: video.uuid},
            () => {}, // No need for a first callback
            () => {
                console.log('Content editor closed, reloading page...');
                window.location.reload();
            }
        );
    }, []); // No dependencies since CE_API is a global object

    const {loading, error, data} = useQuery(GET_REACT_VIDEO_GALLERY, {
        variables: {workspace, id: reactVideoGalleryId, language: locale},
        client
    });

    if (loading) {
        return <CircularProgress sx={{display: 'block', margin: 'auto'}}/>;
    }

    if (error) {
        return <Typography color="error">{t('error.loadingVideos')}</Typography>;
    }

    const handleOpen = video => {
        setSelectedVideo(video);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedVideo(null);
    };

    return (
        <Container maxWidth="lg" sx={{mt: 4}}>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
                <Typography gutterBottom variant="h4" align="center">
                    {data.response.Gallery.title}
                </Typography>
                {isEditing && (
                    <IconButton
                        sx={{
                            position: 'absolute',
                            right: 0, // Pushes it to the right side
                            bgcolor: 'rgba(255, 255, 255, 0.8)',
                            color: 'black',
                            '&:hover': {bgcolor: 'rgba(255, 255, 255, 1)'}
                        }}
                        onClick={() => handleEditContent(data.response.Gallery)}
                    >
                        <EditIcon/>
                    </IconButton>
                )}
            </Box>
            {data.response.Gallery.bannerText?.value && (
                <Typography gutterBottom variant="h6" align="center" dangerouslySetInnerHTML={{__html: data.response.Gallery.bannerText.value}}/>
            )}
            <Grid container spacing={3} justifyContent="center">
                {data.response.Gallery.children.nodes.map(video => (
                    <Grid key={video.id} item xs={12} sm={6} md={4}>
                        <Card sx={{position: 'relative', boxShadow: 3}}>
                            <CardMedia
                                component="img"
                                image={video.videoPoster?.refNode?.url || '/default-placeholder.jpg'}
                                title={video.title}
                                sx={{height: 250}}
                            />
                            {isEditing && (
                                <IconButton
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        bgcolor: 'rgba(255, 255, 255, 0.8)',
                                        color: 'black',
                                        '&:hover': {bgcolor: 'rgba(255, 255, 255, 1)'}
                                    }}
                                    onClick={() => handleEditContent(video)}
                                >
                                    <EditIcon/>
                                </IconButton>
                            )}
                            <IconButton
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                                    color: 'var(--primary)',
                                    '&:hover': {bgcolor: 'rgba(0, 0, 0, 0.8)'}
                                }}
                                onClick={() => handleOpen(video)}
                            >
                                <PlayCircleOutlineIcon sx={{fontSize: 60}}/>
                            </IconButton>
                            <CardContent
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '100%',
                                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                                    color: 'white',
                                    textAlign: 'center',
                                    p: 1
                                }}
                            >
                                <Typography variant="subtitle1" component="div" sx={{textAlign: 'left'}}>
                                    {video.title}
                                </Typography>
                                <Typography variant="body2" component="div" sx={{textAlign: 'left', fontSize: '0.85rem'}}>
                                    {video.videoDesc?.value || ''}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {selectedVideo && (
                <VideoService
                    open={open}
                    handleClose={handleClose}
                    videoTitle={selectedVideo.title || 'Video Player'}
                    videoService={selectedVideo.videoService?.value || 'internal'}
                    videoId={selectedVideo.videoId?.value}
                    videoUrl={selectedVideo.video?.refNode?.url}
                />
            )}
        </Container>
    );
};

export default ReactVideoGallery;
