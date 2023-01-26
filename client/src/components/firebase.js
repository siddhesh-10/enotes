
  import firebase from 'firebase/app';
import 'firebase/database'; // If using Firebase database
import 'firebase/storage';
  import 'firebase/storage'

 

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey:process.env.REACT_APP_apiKey, 
    projectId:process.env.REACT_APP_projectId,
    storageBucket:process.env.REACT_APP_storageBucket,
    messagingSenderId:process.env.REACT_APP_messagingSenderId,
    appId:process.env.REACT_APP_appId,
    measurementId:process.env.REACT_APP_measurementId,
    authDomai:process.env.REACT_APP_authDomai 
  };

  // Initialize Firebase
//   const app = initializeApp(firebaseConfig);
//   const analytics = getAnalytics(app);
//  // Initialize Firebase
// //  firebase.initializeApp(firebaseConfig);
// //  //analytics is optional for this tutoral 
// //    firebase.analytics();
//   const storage = firebase.storage();

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
export  {
    storage, firebase as default
  }
 
