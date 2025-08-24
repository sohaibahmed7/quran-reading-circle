
import localFont from 'next/font/local'
import { GFS_Didot } from 'next/font/google'

export const didot = GFS_Didot({
  subsets: ['latin'],
  variable: '--font-didot',
  weight: ['400'],
  style: ['normal'],
})

export const zuhairDisplay = localFont({
  src: [
    {
      path: '../../public/fonts/ZuhairAlbaziNaskhDisplay-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ZuhairAlbaziNaskhDisplay-Bold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-zuhair-display',
})

export const zuhairText = localFont({
  src: [
    {
      path: '../../public/fonts/ZuhairAlbaziNaskhText-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ZuhairAlbaziNaskhText-Bold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-zuhair-text',
})
