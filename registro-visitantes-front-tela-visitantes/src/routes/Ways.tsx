import { BrowserRouter, Route, Routes } from "react-router-dom"
import PageVisitantes from "../pages/public/PageVisitantes"
import PublicLayout from "../layouts/PublicLayout"

const Ways = () => {
  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PublicLayout/>}>
                  <Route path="/" element={<PageVisitantes/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    </>
  )
}

export default Ways