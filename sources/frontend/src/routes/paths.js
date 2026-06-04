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
        COURSE: '/edit',
        MODULE: '/edit/:courseId',
        LEVELS: '/edit/:courseId/:moduleId',
        LESSON: '/edit/:courseId/:moduleId/:lessonId',
    },

    /* Learn */
    LEARN:
    {
        COURSE: '/learn',
        MODULE: '/learn/:courseId',
        LEVELS: '/learn/:courseId/:moduleId',
        LESSON: '/learn/:courseId/:moduleId/:lessonId',
    },

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