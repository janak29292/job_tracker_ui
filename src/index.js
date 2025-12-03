import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import './styles/style.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import JobCard from './components/temp';
import store from './redux/store';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { AppContextProvider } from './context/appContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
  {/* <React.StrictMode> */}
  <Provider store={store}>
    <AppContextProvider>
      <App />
      <ToastContainer />
    </AppContextProvider>
  </Provider>
    {/* <JobCard
      job={{
        recruiter:'John',
        status:'pending',
        applied_on:'someday'
      }}
    /> */}
  {/* </React.StrictMode> */}
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
