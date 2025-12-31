import { Baloo_2, Inria_Sans, Berkshire_Swash, Calistoga } from "next/font/google";
import localFont from "next/font/local";


const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-baloo",
});
const inriaSans = Inria_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-inria",
});

export const berkshireSwash = Berkshire_Swash({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-berkshire",
});

export const calistoga = Calistoga({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-calistoga",
});
const berryFields = localFont({
  src: "./custom/berryfield.woff",
  variable: "--font-berry",
});

export const fonts = `${baloo.variable} ${inriaSans.variable} ${berryFields.variable} ${berkshireSwash.variable} ${calistoga.variable}`;
