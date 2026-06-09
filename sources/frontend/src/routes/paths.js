export const PATHS =
{
    HOME: '/',
    ERROR: '/error',
    CONTACT: '/contact',
    TERMS: '/terms-and-services',
    
    RANKING: '/ranking',
    PROGRESS: '/progress',

    /* User list */
    LIST: '/user-list',

    /* Create */
    CREATE: '/edit/courses',
    SEE: '/learn/courses',
    EDIT: '/edit/courses/:course?/:module?/:level?',
    LEARN: '/learn/courses/:course?/:module?/:level?',

    /* Auth */
    AUTH:
    {
        LOGIN: '/auth/login',
        SIGNIN: '/auth/signin',
        RECOVER: '/auth/recover',
        VERIFY: '/auth/verify/:type'
    },

    /* User */
    USER:
    {
        PROFILE: '/profile',
        UPDATE: '/profile/update/:type',
    }
};

const iconURL = '/assets/icons/home';

export const ICON_MAP =
{
    HIGH:
    {
        src: `${iconURL}/high.png`,
        alt: 'High level course icon',
        title: 'Course icon'
    },

    LIMIT:
    {
        src: `${iconURL}/limits.png`,
        alt: 'Break your limits',
        title: 'Limit icon'
    },

    PROGRESS:
    {
        src: `${iconURL}/progress.png`,
        alt: 'Progress icon',
        title: 'Progress icon'
    },

    RANKING:
    {
        src: `${iconURL}/ranking.png`,
        alt: 'Ranking icon',
        title: 'Ranking icon'
    },

    CREATE:
    {
        src: `${iconURL}/create.png`,
        alt: 'Create content icon',
        title: 'Create icon'
    },

    LIST:
    {
        src: `${iconURL}/list.png`,
        alt: 'User list icon',
        title: 'User icon'
    },

};