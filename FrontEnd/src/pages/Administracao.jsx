import { useEffect, useRef, useState } from "react"
import { apiHttpMethodHandler } from "../helpers/apiFetch"
import { useOutletContext } from "react-router-dom"
import BackGroundModal from "../components/BackGroundModal"
import ModalDeletar from "../components/ModalDeletar"
import ModalTornarAdmin from "../components/ModalTornarAdmin"

function Administracao( {setPropsInfoPopup} ) {
    const [isDashboardLoading, setIsDashboardLoading] = useState(true)
    const [dashboarAdmin, setDashboarAdmin] = useState(null)
    const { apiFetch } = apiHttpMethodHandler()
    const { userProfileData, isLoading } = useOutletContext();
    const [isBackGroundModalOpen, setIsBackGroundModalOpen] = useState(false)
    const [isDeletarUserModalOpen, setIsDeletarUserModalOpen] = useState(false)
    const [isTornarAdminModalOpen, setIsTornarAdminModalOpen] = useState(false)
    const idUserAction = useRef(null)

    useEffect(() => {
        carregarDashboardAdmin()
    }, [])

    async function carregarDashboardAdmin() {
        const response = await apiFetch("/admin/users/dashboard")

        if(!response) return

        const data = await response.json();
        
        setDashboarAdmin(data)
        setIsDashboardLoading(false)
    }

    function handleOptionsUsers(e) {
        const target = e.target

        const cardElement = target.closest('.row-user')

        if(!cardElement) return

        const userId = cardElement.dataset.id

        if(target.tagName === 'BUTTON') {
            const actionType = target.dataset.action
            if(actionType === "tornar-admin") {
                idUserAction.current = userId
                abrirModalTornarAdmin()
            } 
            
            if(actionType === "deletar") {
                idUserAction.current = userId
                abrirModalDeletarUser()
            }
        }
    }

    function abrirModalDeletarUser() {
        setIsBackGroundModalOpen(true)
        setIsDeletarUserModalOpen(true)
    }

    function fecharModalDeletarUser() {
        setIsBackGroundModalOpen(false)
        setIsDeletarUserModalOpen(false)
        idUserAction.current = null
    }

    function abrirModalTornarAdmin() {
        setIsBackGroundModalOpen(true)
        setIsTornarAdminModalOpen(true)
    }
    
    function fecharModalTornarAdmin() {
        setIsBackGroundModalOpen(false)
        setIsTornarAdminModalOpen(false)
        idUserAction.current = null
    }

    async function deletarUser() {
        const idUser = idUserAction.current
        const response = await apiFetch(`/admin/users/${idUser}`, {
            method: "DELETE"
        })

        if(!response) return

        if(response.status === 404) {
            setPropsInfoPopup({msg: "Usuário não encontrado!", type: "error", isOpen: true})
        }

        if(response.status === 204) {
            carregarDashboardAdmin()
            setPropsInfoPopup({msg: "Usuário deletado com sucesso!", type: "success", isOpen: true})
        }
        
        fecharModalDeletarUser()
    }

    async function tornarAdmin() {
        const idUser = idUserAction.current
        const response = await apiFetch(`/admin/users/${idUser}`, {
            method: "PATCH"
        })

        if(!response) return

        if(response.status === 404) {
            setPropsInfoPopup({msg: "Usuário não encontrado!", type: "error", isOpen: true})
        }

        if(response.status === 204) {
            setPropsInfoPopup({msg: "Usuário atualizado com sucesso!", type: "success", isOpen: true})
        }

        carregarDashboardAdmin()
        fecharModalTornarAdmin()
    }

    return (
        <>
        <section id="tab-admin" className="tab active">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Administração</h2>
                    <p className="page-sub">Visualize os usuários cadastrados e gerencie permissões</p>
                </div>
            </div>

            <div className="admin-summary">
                <div className="admin-summary-card">
                    <div className="admin-summary-label">Usuários cadastrados</div>
                    <div 
                    className={`admin-summary-value ${isDashboardLoading && "skeleton skeleton-xl"}`}
                    id="admin-total-users">{!isDashboardLoading && dashboarAdmin.quantUsers}</div>
                </div>
                <div className="admin-summary-card">
                    <div className="admin-summary-label">Administradores</div>
                    <div 
                    className={`admin-summary-value ${isDashboardLoading && "skeleton skeleton-xl"}`}
                    id="admin-total-admins">{!isDashboardLoading && dashboarAdmin.quantAdmin}</div>
                </div>
            </div>

            <div className="admin-table-wrap">
                {
                    isDashboardLoading || isLoading ?
                        <div className="loading-block">
                            <div className="loading-block-spinner"></div>
                            <span className="loading-block-text">Carregando dados</span>
                            <div className="loading-block-bar"></div>
                        </div>
                    :
                        <table className="admin-table">
                            <thead>
                            <tr><th>Nome</th><th>E-mail</th><th>Perfil</th><th></th></tr>
                            </thead>
                            <tbody id="admin-users-tbody" onClick={handleOptionsUsers}>
                            {
                                dashboarAdmin.users.length > 0 ? 
                                dashboarAdmin.users.map((user) => 
                                    <tr key={user.email} className="row-user" data-id={user.id}>
                                        <td>{user.nome} {(user.email === userProfileData.email) && <span className="page-sub">(você)</span>}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`badge ${user.userRole === "ADMIN" ? 'badge-receita' : 'badge-despesa'}`}>{user.userRole}</span>
                                        </td>
                                        <td>
                                            <div className="admin-actions">
                                                {
                                                user.email !== userProfileData.email && user.userRole === "USER" ? 
                                                <div style={{display: "flex", gap: "30px"}}>
                                                    <button 
                                                    className="btn-primary"
                                                    data-action="tornar-admin"
                                                    >Tornar ADMIN
                                                    </button>
                                                    <button 
                                                    className="btn-primary danger" 
                                                    data-action="deletar"
                                                    >Deletar User</button>
                                                </div>
                                                :
                                                <span className="page-sub">{user.email === userProfileData.email ? "Usuário atual" : "Já é admin"}</span>
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                )
                            :
                                <tr>
                                    <td colSpan="5" className="empty-row">Nenhum usuário encontrado.</td>
                                </tr>
                            }
                            </tbody>
                        </table>
                }
            </div>
        </section>
        
        <BackGroundModal isOpen={isBackGroundModalOpen}>
                <ModalDeletar 
                isOpen={isDeletarUserModalOpen}
                onCancelar={fecharModalDeletarUser}
                onExcluir={deletarUser}
                nomeDeletar={"Usuário"}
                />

                <ModalTornarAdmin 
                isOpen={isTornarAdminModalOpen}
                onCancelar={fecharModalTornarAdmin}
                onSubmit={tornarAdmin}
                />
        </BackGroundModal>
        </>
    )
}

export default Administracao