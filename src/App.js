import React, { Component } from 'react'
import './styles/App.css'
import Wrapper from './components/Wrapper'

export default class App extends Component {
  render() {
    return (
      <Wrapper type='main'>
        <Wrapper type='header' />
        <Wrapper type='nav' />
        <Wrapper type='content' />
        <Wrapper type='footer' />
      </Wrapper>
    )
  }
}