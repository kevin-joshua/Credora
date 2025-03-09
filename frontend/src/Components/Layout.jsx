import Footer from "./Footer"
import Header from "./Header"

const Layout = ({ children }) => {
  return (
    <>
    <Header/>
    <main className="flex justify-center items-center mx-auto">{children}</main>
    </>
  )
}

export default Layout;