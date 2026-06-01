export const PATHS =
{
    HOME: '/',
    ERROR: '/error/:error',
    CONTACT: '/contact/:rol',
    TERMS: '/terms-and-services',

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
        VERIFY: '/auth/verify/:type',
    },

    /* User */
    PROFILE: '/profile',
    UPDATE: '/profile/update/:type',

    /* Stats */
    RANKING: '/ranking',
    PROGRESS: '/progress/:username'
};