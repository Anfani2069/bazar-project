export const environment = {
  production: false,
  stripe: {
    publicKey: 'pk_test_YOUR_STRIPE_PUBLIC_KEY',
  },
  emailjs: {
    serviceId:       'YOUR_EMAILJS_SERVICE_ID',
    templateId:      'YOUR_EMAILJS_TEMPLATE_ID',
    adminTemplateId: 'YOUR_EMAILJS_ADMIN_TEMPLATE_ID',
    publicKey:       'YOUR_EMAILJS_PUBLIC_KEY',
    adminEmail:      'YOUR_ADMIN_EMAIL',
  },
  firebase: {
    apiKey:            'YOUR_FIREBASE_API_KEY',
    authDomain:        'YOUR_PROJECT.firebaseapp.com',
    projectId:         'YOUR_PROJECT_ID',
    storageBucket:     'YOUR_PROJECT.firebasestorage.app',
    messagingSenderId: 'YOUR_SENDER_ID',
    appId:             'YOUR_APP_ID',
    measurementId:     'YOUR_MEASUREMENT_ID',
  },
};
