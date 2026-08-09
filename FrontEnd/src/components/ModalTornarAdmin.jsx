function ModalTornarAdmin({ isOpen, onCancelar, onSubmit }) {
    if(!isOpen) return null
    
    return(
        <div className="modal modal-sm">
        <div className="modal-header">
            <h3>Confirmar update</h3>
            <button className="modal-close" onClick={onCancelar}>✕</button>
        </div>
        <div className="modal-body">
            <p id="confirm-msg">Tem certeza que deseja tornar este usuario um admin ?</p>
        </div>
        <div className="modal-footer">
            <button 
            className="btn-ghost"
            onClick={onCancelar}
            >Cancelar</button>
            <button 
            className="btn-primary" 
            id="confirm-btn"
            onClick={onSubmit}
            >Confirmar</button>
        </div>
        </div>
    )
}

export default ModalTornarAdmin