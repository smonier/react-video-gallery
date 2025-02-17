import PropTypes from 'prop-types';

// Define reusable PropTypes shapes
export const jcrNode = PropTypes.shape({
    workspace: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    primaryNodeType: PropTypes.shape({
        name: PropTypes.string.isRequired,
        supertypes: PropTypes.arrayOf(PropTypes.shape({name: PropTypes.string.isRequired}))
    }),
    mixinTypes: PropTypes.arrayOf(PropTypes.shape({name: PropTypes.string.isRequired})),
    site: PropTypes.shape({
        workspace: PropTypes.string.isRequired,
        uuid: PropTypes.string.isRequired,
        displayName: PropTypes.string.isRequired
    })
});

export const content = PropTypes.shape({
    title: PropTypes.string

});

export const config = PropTypes.shape({

});

export const reactVideoGalleryData = PropTypes.shape({
    content: content,
    config: config
});
