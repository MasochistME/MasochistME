import React, { Component } from 'react'
import './styles/css/App.css'
import Wrapper from './components/Wrapper'
import Nav from './components/Nav'
import Header from './components/Header';
import MiniHeader from './components/MiniHeader';

export default class App extends Component {
  render() {
    return (
      <Wrapper type='main'>
        <Header />
        <Wrapper type='nav'>
          <Nav />
        </Wrapper>
        <Wrapper type='middle'>
          <Wrapper type='content'>
            <MiniHeader />
          </Wrapper>
          <Wrapper type='sidebar' />
        </Wrapper>
        <Wrapper type='footer' />
      </Wrapper>
    )
  }
}