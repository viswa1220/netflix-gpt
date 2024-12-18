import React from 'react'
import LoginComponent from '../Login/LoginComponent'
import BrowseComponent from '../BrowseComponent/BrowseComponent'
import { createBrowserRouter,RouterProvider } from 'react-router-dom';

const BodyComponent = () => {
    const appRouter= createBrowserRouter([
        {
            path:"/",
            element:<LoginComponent/>
        },
        {
            path:"/browse",
            element:<BrowseComponent></BrowseComponent>
        }
    ])
  return (
    <div>
 <RouterProvider router={appRouter}></RouterProvider>
    </div>
  )
}

export default BodyComponent
