import React, { Component } from 'react'
import './styles/css/App.css'
import Wrapper from './components/Wrapper'
import Nav from './components/Nav'

export default class App extends Component {
  render() {
    return (
      <Wrapper type='main'>
        <Wrapper type='header'>
          0.1% - games that masochists love.
        </Wrapper>
        <Wrapper type='nav'>
          <Nav />
        </Wrapper>
        <Wrapper type='middle'>
          <Wrapper type='content' />
          <Wrapper type='sidebar' />
        </Wrapper>
        <Wrapper type='footer' />
      </Wrapper>
    )
  }
}