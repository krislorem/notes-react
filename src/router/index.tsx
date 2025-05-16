import React, { lazy, Suspense } from 'react';
import { App } from 'antd';
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
const Loading = lazy(() => import('@/components/Loading'))
const Home = lazy(() => import('@/pages/Home'))
const ExploreLayout = lazy(() => import('@/pages/Explore/Layout'))
const UserLayout = lazy(() => import('@/pages/User/Layout'))
const UserInfo = lazy(() => import('@/pages/User/Info'))
const UserEdit = lazy(() => import('@/pages/User/Edit'))
const UserFollow = lazy(() => import('@/pages/User/Follow'))
const UserFan = lazy(() => import('@/pages/User/Fan'))
const UserBookDetail = lazy(() => import('@/pages/User/BookDetail'))
const UserNoteDetail = lazy(() => import('@/pages/User/NoteDetail'))
const UserBookEdit = lazy(() => import('@/pages/User/BookEdit'))
const UserNoteEdit = lazy(() => import('@/pages/User/NoteEdit'))
const UserBookList = lazy(() => import('@/pages/User/BookList'))
const UserMarkList = lazy(() => import('@/pages/User/MarkList'))
const UserTemp = lazy(() => import('@/pages/User/Temp'))
const SearchPage = lazy(() => import('@/pages/Search'))
const SearchPageBooks = lazy(() => import('@/pages/Search/Books'))
const AIPage = lazy(() => import('@/pages/AI'))
const Login = lazy(() => import('@/pages/Login'))
const NotFound = lazy(() => import('@/pages/NotFound'))
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { modal } = App.useApp();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const showModal = () => {
    modal.confirm({
      title: '登录确认',
      content: '您需要登录后才能继续操作',
      okText: '去登录',
      cancelText: '取消',
      onOk: () => navigate('/login')
    });
  };
  if (token) {
    return children;
  } else {
    showModal();
    return null;
  }
}
const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<Navigate to="explore" replace />} />
          <Route path="explore/" element={<ExploreLayout />} />
          <Route path="note-search" element={<SearchPage />} />
          <Route path='book-search' element={<SearchPageBooks />} />
          <Route path="ai/:noteId" element={<AIPage />} />
          <Route path="my/" element={<AuthRoute><UserLayout /></AuthRoute>}>
            <Route index path='info/:userId' element={<UserInfo />} />
            <Route path="edit/:userId" element={<UserEdit />} />
            <Route path="follow" element={<UserFollow />} />
            <Route path="fan" element={<UserFan />} />
            <Route path="mark" element={<UserMarkList />} />
            <Route path="temp" element={<UserTemp />} />
            <Route path="note/edit/:noteId" element={<UserNoteEdit />} />
            <Route path="book/edit/:bookId" element={<UserBookEdit />} />
            <Route path="book/list" element={<UserBookList />} />
            <Route path="book/detail/:bookId" element={<UserBookDetail />} />
            <Route path="note/detail/:noteId" element={<UserNoteDetail />} />
          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
