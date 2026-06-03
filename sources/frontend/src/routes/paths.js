export const PATHS =
{
    HOME: '/',
    ERROR: '/error',
    CONTACT: '/contact/:rol',
    TERMS: '/terms-and-services',
    
    RANKING: '/ranking',
    PROGRESS: '/progress/:username',

    /* User list */
    LIST: '/user-list',

    /* Create */
    EDIT:
    {
        COURSE: '/edit/courses',
        MODULE: '/edit/:course/modules',
        LEVELS: '/edit/:course/:module/levels',
        LESSON: '/edit/:course/:module/:lesson',
    },

    /* Learn */
    LEARN:
    {
        COURSE: '/learn/courses',
        MODULE: '/learn/:course/modules',
        LEVELS: '/learn/:course/:module/levels',
        LESSON: '/learn/:course/:module/:lesson',
    },

    /* Auth */
    AUTH:
    {
        LOGIN: '/auth/login',
        SIGNIN: '/auth/signin',
        RECOVER: '/auth/recover',
        VERIFY: '/auth/verify'
    },

    /* User */
    USER:
    {
        PROFILE: '/profile',
        UPDATE: '/profile/update/:type',
    }
};

const iconURL = '@/assets/icons';

export const ICON_MAP =
{
    HIGH:
    {
        src: `${iconURL}/`,
        alt: 'High level course icon',
        title: 'Course icon'
    },

    LIMIT:
    {
        src: '',
        src: `${iconURL}/`,
        alt: 'Break your limits',
        title: 'Limit icon'
    },

    PROGRESS:
    {
        src: `${iconURL}/`,
        alt: 'Progress icon',
        title: 'Progress icon'
    },

    RANKING:
    {
        src: `${iconURL}/`,
        alt: 'Ranking icon',
        title: 'Ranking icon'
    },

    CREATE:
    {
        src: `${iconURL}/`,
        alt: 'Create content icon',
        title: 'Create icon'
    },

    LIST:
    {
        src: `${iconURL}/`,
        alt: 'User list icon',
        title: 'User icon'
    },

};