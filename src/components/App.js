import React, { Component } from 'react'
import '../styles/css/App.css'
import Wrapper from '../shared/components/layout/Wrapper'
import Header from '../shared/components/Header'
import Nav from '../shared/components/Nav'
import ContentWrapper from '../shared/components/layout/ContentWrapper'
import SidebarWrapper from './sidebar/SidebarWrapper' 

export default class App extends Component {
  render() {
    return (
      <Wrapper type='main'>
        <Header />
        <Wrapper type='nav'>
          <Nav />
        </Wrapper>
        <Wrapper type='middle'>
          <ContentWrapper />
          <SidebarWrapper />
        </Wrapper>
        <Wrapper type='footer' />
      </Wrapper>
    )
  }
}