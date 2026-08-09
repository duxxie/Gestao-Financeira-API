import { Navigate, Outlet } from "react-router-dom"
import { useState, useEffect } from "react"
import { apiHttpMethodHandler } from "../helpers/apiFetch" 
import SideBar from "./SideBar"

function PrivateRoute({ setPropsInfoPopup }) {
    const token = localStorage.getItem("token")
    
    if(!token) {
        return <Navigate to={"/login"} replace />
    }
    const { apiFetch } = apiHttpMethodHandler()
    const [userProfileData, setUserProfileData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    
    useEffect(() => {
        carregarUsuario()
    }, [])

    async function carregarUsuario() {
        const response = await apiFetch("/users/me")

        if(!response) return;

        const data = await response.json();

        setUserProfileData(data)
        setIsLoading(false)
    }

    async function atualizarDadosUsuario(usuarioUpdateRequest) {
        const response = await apiFetch("/users/me", {
            method: "PATCH",
            body: JSON.stringify(usuarioUpdateRequest)
        })

        if(!response) return

        if(response.status === 400) {
            setPropsInfoPopup({msg: "Dados inválidos", type: "error", isOpen: true})
        }

        if(response.status === 404) {
            setPropsInfoPopup({msg: "Usuário não encontrado!", type: "error", isOpen: true})
        }

        if(response.status === 409) {
            const data = await response.json()
            setPropsInfoPopup({msg: data.message, type: "error", isOpen: true})
        }

        if(response.status === 204) {
            setPropsInfoPopup({msg: "Dados atualizados com sucesso!", type: "success", isOpen: true})
            carregarUsuario()
        }
    }
    
    return (
        <div className="app-shell active">
            <SideBar 
            userProfile={userProfileData}
            isLoading={isLoading}
            updateUser={atualizarDadosUsuario}
            />
            <main className='main-content'>
                <Outlet context={{ userProfileData, isLoading}}/>
            </main>
        </div>
    )
}

export default PrivateRoute