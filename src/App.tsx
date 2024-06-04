import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import HomePage from './pages/HomePage';
import AuthorizationPage from './pages/AuthorizationPage';
import ProposalList from './pages/ProposalList';
import ProposalItem from './pages/ProposalItem';
import AutoInfo from './pages/AutoInfo';
import CreateProposal from './pages/CreateProposal';
import Layout from './components/Layout';
import NotAuthorized from './components/NotAuthorized';
import Profile from './pages/Profile';

import { authSelector, logoutUser } from './store/auth/authSlice';
import type { AppDispatch } from './store/store';
import { AUTH_TIMEOUT } from './const/const';
import { getDictionary } from './store/dictionary/getDictionarySlice';

const AppWrapper = styled.div`
  max-width: 2500px;
  margin: auto;
`;

const App = () => {
  const { isLogin } = useSelector(authSelector);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (isLogin) {
      dispatch(getDictionary());
      setTimeout(() => {
        dispatch(logoutUser());
        window.location.reload();
      }, AUTH_TIMEOUT);
    }
  }, [isLogin, dispatch]);

  return (
    <AppWrapper>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/login' element={<AuthorizationPage />} />
            {!isLogin && <Route path='*' element={<NotAuthorized />} />}
            {isLogin && (
              <>
                <Route path='/create-proposal' element={<CreateProposal />} />
                <Route path='/proposals' element={<ProposalList />} />
                <Route path='/proposals/:id' element={<ProposalItem />} />
                <Route path='/autos' element={<AutoInfo />} />
                <Route path='/profile' element={<Profile />} />
              </>
            )}
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppWrapper>
  );
};

export default App;
