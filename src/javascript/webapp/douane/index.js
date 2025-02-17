import * as Ajv from 'ajv';
import addFormats from 'ajv-formats';
// Import AjvErrors from "ajv-errors";
import {context as contextSchema} from './lib/schema/context';
import {getGQLWorkspace} from '../misc/utils';
import {ContextException} from '../exceptions/ContextException';
import {cndTypes} from './lib/config';

const ajv = new Ajv({useDefaults: true});
// Const ajv = new Ajv({
//     allErrors: true,
//     strict: false
// });
addFormats(ajv);
// AjvErrors(ajv);

// Note le try catch doit etre fait ici et un component react doit etre retourne
export const contextValidator = context => {
    const valid = ajv.validate(contextSchema, context);
    if (!valid) {
        throw new ContextException({
            message: 'Context configuration object',
            errors: ajv.errors
        });
    }

    context.workspace = getGQLWorkspace(context.workspace);
    context.cndTypes = cndTypes;

    return context;
};
