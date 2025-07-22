export const environment = {

    production: false,
    apiUrl: 'http://localhost:5087/api',
    authRoutes: {
        login: '/auth/login',
        register: '/auth/register',
        checkEmail: '/Auth/email-check',
        verifyOtp: '/auth/verify-otp',
        logout: '/auth/logout',   
    }
};
