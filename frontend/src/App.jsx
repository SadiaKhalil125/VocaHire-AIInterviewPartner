import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Signup from './Signup'
import Login from './Login'
import HomePage from './HomePage'
import Header from './Header'
import Footer from './Footer'
import InterviewPractice from './InterviewPractice'
import InterviewSubmissions from './InterviewSubmissions'
function App() {

  return (
   
    <BrowserRouter>
    <Header></Header>
    <Routes>
      <Route path="/dashboard" element={<InterviewSubmissions></InterviewSubmissions>}/>
      <Route path="/" element = {<HomePage></HomePage>}></Route>
      <Route path="/interviewpractice" element = {<InterviewPractice></InterviewPractice>}/>
      <Route path="/signup" element= {<Signup></Signup>}   />
      <Route path="/login" element= {<Login></Login>}   />
      
    </Routes> 
    <Footer></Footer>
    </BrowserRouter>
  )
}

export default App
