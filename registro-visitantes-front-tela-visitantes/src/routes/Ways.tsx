import { BrowserRouter, Route, Routes } from "react-router-dom"
import PageVisitantes from "../pages/public/PageVisitantes"
import PublicLayout from "../layouts/PublicLayout"
import PageLogin from "../pages/public/PageLogin"

const Ways = () => {
  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PublicLayout/>}>
                  <Route path="/" element={<PageVisitantes/>}/>
                  <Route path="/login" element={<PageLogin/>}/>
                  <Route path="/admin" element={<PageLogin/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    </>
  )
}

export default Ways