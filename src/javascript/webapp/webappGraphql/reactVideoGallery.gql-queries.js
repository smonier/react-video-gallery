import {gql} from '@apollo/client';
import {CORE_NODE_FIELDS} from './fragments';

const VIDEO_FIELDS_INTERNAL = gql`
    ${CORE_NODE_FIELDS}
    fragment InternalVideoFields on JCRNode {
        ...CoreNodeFields
        path: path
        title: displayName(language: $language)
        video: property(name: "video") {
            refNode {
                path
                url
            }
        }
        videoDesc: property(name: "videoDesc") {
            value
        }
        videoPoster: property(name: "videoPoster") {
            refNode {
                path
                url
            }
        }
    }
`;

const VIDEO_FIELDS_EXTERNAL = gql`
    ${CORE_NODE_FIELDS}
    fragment ExternalVideoFields on JCRNode {
        ...CoreNodeFields
        path: path
        title: displayName(language: $language)
        videoService: property(name: "videoService") {
            value
        }
        videoId: property(name: "videoId") {
            value
        }
        videoDesc: property(name: "videoDesc") {
            value
        }
        videoPoster: property(name: "videoPoster") {
            refNode {
                path
                url
            }
        }
    }
`;

export const GET_REACT_VIDEO_GALLERY = gql`
    ${CORE_NODE_FIELDS}
    query getReactVideoGalleryData($workspace: Workspace!, $id: String!, $language: String!) {
        response: jcr(workspace: $workspace) {
            workspace
            Gallery: nodeById(uuid: $id) {
                ...CoreNodeFields
                name
                title: displayName(language: $language)
                bannerText: property(name: "bannerText", language: $language) {
                    value
                }
                itemWidth: property(name: "itemWidth") {
                    value
                }
                children {
                    nodes {
                        primaryNodeType {
                            name
                        }
                        ...InternalVideoFields
                        ...ExternalVideoFields
                    }
                }
            }
        }
    }
    ${VIDEO_FIELDS_INTERNAL}
    ${VIDEO_FIELDS_EXTERNAL}
`;
