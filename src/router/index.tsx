import React, { lazy, Suspense } from 'react';
import { App } from 'antd';
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
const Loading = lazy(() => import('@/components/Loading'))
const Home = lazy(() => import('@/pages/Home'))
const ExploreLayout = lazy(() => import('@/pages/Explore/Layout'))
const ExploreBook = lazy(() => import('@/pages/Explore/Book'))
const ExploreBookDetail = lazy(() => import('@/pages/Explore/BookDetail'))
const ExploreNote = lazy(() => import('@/pages/Explore/Note'))
const ExploreNoteDetail = lazy(() => import('@/pages/Explore/NoteDetail'))
const ExploreUser = lazy(() => import('@/pages/Explore/User'))
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
const UserTemp = lazy(() => import('@/pages/User/Temp'))
const SearchPage = lazy(() => import('@/pages/Search'))
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
          <Route path="explore/" element={<ExploreLayout />}>
            <Route path="book" element={<ExploreBook />} />
            <Route path="book/:bookId" element={<ExploreBookDetail />} />
            <Route path="note" element={<ExploreNote />} />
            <Route path="note/:noteId" element={<ExploreNoteDetail />} />
            <Route path="user/:userId" element={<ExploreUser />} />
          </Route>
          <Route path="search" element={<SearchPage />} />
          <Route path="ai" element={<AIPage />} />
          <Route path="my/" element={<AuthRoute><UserLayout /></AuthRoute>}>
            <Route index element={<UserInfo />} />
            <Route path="edit" element={<UserEdit />} />
            <Route path="follow" element={<UserFollow />} />
            <Route path="fan" element={<UserFan />} />
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
