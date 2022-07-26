import '../styles/globals.css'
import type { AppProps } from 'next/app'

import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import React from "react";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function UtilidadesApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  return getLayout(
      <>
      <Component {...pageProps} />
      </>)
}
export default UtilidadesApp;
