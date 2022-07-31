import { ColorSchemeProvider } from '@mantine/core'
import { MantineProvider } from '@mantine/core'
import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node'
import { json } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'
import { useState } from 'react'
import { fontFamily } from './shared/configs/css'
import type { ColorScheme } from './shared/models/colorSchemeCookie'
import {
  generateHeadersWithColorSchemeCookie,
  parseColorSchemeCookie,
} from './shared/models/colorSchemeCookie/index.server'

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1',
})

export const links: LinksFunction = () => [
  {
    rel: 'preconnect',
    href: 'https://fonts.googleapis.com',
  },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&family=Noto+Sans+JP:wght@100;300;400;500;700;900&family=Noto+Serif+JP:wght@200;300;400;500;600;700;900&display=swap',
  },
]

export const loader: LoaderFunction = async ({ request }) => {
  const parsedCookie = await parseColorSchemeCookie(request)
  return json<ColorScheme>(
    parsedCookie,
    await generateHeadersWithColorSchemeCookie(parsedCookie)
  )
}

export default function App() {
  const loaderData = useLoaderData<ColorScheme>()
  const [colorScheme, setColorScheme] = useState<ColorScheme>(loaderData)
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{
          colorScheme,
          fontFamily: fontFamily.sans,
          fontFamilyMonospace: fontFamily.mono,
        }}
        withGlobalStyles
        withNormalizeCSS
      >
        <html lang='ja'>
          <head>
            <Meta />
            <Links />
          </head>
          <body style={{ width: '100vw', height: '100vh' }}>
            <Outlet />
            <ScrollRestoration />
            <Scripts />
            <LiveReload />
          </body>
        </html>
      </MantineProvider>
    </ColorSchemeProvider>
  )
}
