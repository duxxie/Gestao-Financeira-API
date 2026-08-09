import { useState } from "react"

function ModalUser({ isOpen, onClose, userProfile, updateUser }) {
    if(!isOpen) return null

    const [inputNome, setInputNome] = useState(userProfile?.nome ?? "")
    const [inputEmail, setInputEmail] = useState(userProfile?.email ?? "")

    function handleSubmit() {
        let editRequest = {}
        let changes = false

        if(inputNome !== userProfile?.nome) {
            editRequest = {...editRequest, nome: inputNome}
            changes = true
        }

        if(inputEmail !== userProfile?.email) {
            editRequest = {...editRequest, email: inputEmail}
            changes = true
        }

        if(changes) updateUser(editRequest)

        onClose()
    }

    return(
        <div className="modal">
            <div className="modal-header">
                <h3>Meu perfil</h3>
                <button className="modal-close" onClick={onClose}>✕</button>
            </div>
            <div className="modal-body">
                <div className="form-group">
                <label>Nome completo</label>
                <input 
                type="text" 
                id="perfil-nome"
                placeholder="Seu nome"
                value={inputNome}
                onChange={(e) => setInputNome(e.target.value)}
                />
                </div>
                <div className="form-group">
                <label>E-mail</label>
                <input 
                type="email" 
                id="perfil-email" 
                placeholder="seu@email.com" 
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                />
                </div>
            </div>
            <div className="modal-footer">
                <button className="btn-ghost" onClick={onClose}>Cancelar</button>
                <button className="btn-primary" onClick={handleSubmit}>Salvar alterações</button>
            </div>
        </div>
    )
}

export default ModalUser