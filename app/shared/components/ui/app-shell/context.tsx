import { Aside, Footer, Header, Navbar } from '@mantine/core'
import { createContext, useContext } from 'react'

const HeaderContext = createContext(() => (
  <Header height={'fit-content'}>
    <div />
  </Header>
))
export const HeaderProvider = HeaderContext.Provider
export const useHeader = () => useContext(HeaderContext)

const FooterContext = createContext(() => (
  <Footer height={'fit-content'} style={{ visibility: 'hidden' }}>
    <div />
  </Footer>
))
export const FooterProvider = FooterContext.Provider
export const useFooter = () => useContext(FooterContext)

const NavbarContext = createContext(() => (
  <Navbar style={{ visibility: 'hidden' }}>
    <div />
  </Navbar>
))
export const NavbarProvider = NavbarContext.Provider
export const useNavbar = () => useContext(NavbarContext)

const AsideContext = createContext(() => (
  <Aside style={{ visibility: 'hidden' }}>
    <div />
  </Aside>
))
export const AsideProvider = AsideContext.Provider
export const useAside = () => useContext(AsideContext)
