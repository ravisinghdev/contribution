import { ReactNode, FC } from "react"
import { Metadata } from "next"
import "./globals.css"
import {Roboto} from "next/font/google"
import Provider from "./provider"
import Script from "next/script"

export interface ILayoutProps{
    children: ReactNode
}

const roboto = Roboto({
    weight: "400",
    subsets: ["latin"]
})

export const metadata: Metadata = {
    title: "NEET-OS",
    description: "This is NEET-OS, a webapp designed for students"
}

const Layout:FC<ILayoutProps> = ({children}) =>{
    return(
        <html lang="en" suppressHydrationWarning className={roboto.className}>
            <head>
                 <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            </head>
            <body className="min-w-full min-h-screen">
                <Provider>
                    {children}
                </Provider>
            </body>
        </html>
    )
}

export default Layout