// Import jCustomer from "./definitions/jCustomer";
// import jContent from "./definitions/jContent";
// import gql from "./definitions/gql";
import {workspace} from 'douane/lib/config';
const [, live] = workspace;

export const context = {
    title: 'context validation schema ',
    description: 'context is an object provided by the page in charge to load the app',
    // Definitions: {
    //     jContent:jContent,
    //     jCustomer:jCustomer,
    //     gql:gql
    // },
    type: 'object',
    // Properties:{
    //     jContent:{$ref:"#jContent"},
    //     gql:{$ref:"#gql"},
    //     jCustomer:{$ref:"#jCustomer"}
    // },
    properties: {
        host: {
            type: 'string',
            format: 'uri',
            default: process.env.REACT_APP_JCONTENT_HOST || 'http://localhost:8080'
        },
        workspace: {
            type: 'string',
            enum: workspace,
            default: process.env.REACT_APP_JCONTENT_WORKSPACE || live
        },
        scope: {type: 'string', pattern: '[a-zA-Z0-9-_]+'}, // Iso
        locale: {type: 'string', pattern: '[a-z]{2}(?:_[A-Z]{2})?', default: 'en'}, // "fr" or "fr_FR"
        reactVideoGalleryId: {type: 'string'}, // "3ff7b68c-1cfa-4d50-8377-03f19db3a985"
        previewTarget: {
            type: ['object', 'null'],
            default: null,
            properties: {
                id: {type: 'string'}, // "3ff7b68c-1cfa-4d50-8377-03f19db3a985"
                type: {type: 'string'}// "game4nt:qna"
            },
            required: ['id', 'type']
        }, // "3ff7b68c-1cfa-4d50-8377-03f19db3a985"
        previewCm: {type: 'boolean', default: false},
        isEdit: {type: 'boolean', default: false},
        gqlServerUrl: {
            type: 'string',
            format: 'uri',
            default: process.env.REACT_APP_JCONTENT_GQL_ENDPOINT || 'http://localhost:8080/modules/graphql'
        },
        // Gql_authorization:{
        //     type:"string",
        //     // default:process.env.REACT_APP_JCONTENT_GQL_AUTH || "Basic cm9vdDpyb290"
        // },
        contextServerUrl: {
            type: 'string',
            // Format:"uri", // with 8.2.0.4 and jCustomer v2 now it is the proxy path which is not an uri
            default: process.env.REACT_APP_JCUSTOMER_ENDPOINT // Could be null in case of edit!
        },
        cndTypes: {
            type: 'array'
        }
    },
    required: [
        'host',
        'workspace',
        'scope',
        'locale',
        // "filesServerUrl",
        'gqlServerUrl',
        // "gql_authorization",
        'contextServerUrl'
    ],
    additionalProperties: false
};
