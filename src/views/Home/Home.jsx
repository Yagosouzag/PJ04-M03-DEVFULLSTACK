import { useState } from 'react';
import './Home.css';
import PaletaLista from '../../components/PaletaLista/PaletaLista';
import AdicionaEditaPaletaModal from 'components/AdicionaEditaPaletaModal/AdicionaEditaPaletaModal';
import DeletaPaletaModal from 'components/DeletaPaletaModal/DeletaPaletaModal';
import { ActionMode } from 'constants/index';
import Navbar from 'components/Navbar/Navbar';
import SacolaModal from 'components/SacolaModal/SacolaModal';
import { SacolaService } from 'services/SacolaService';

function Home() {
  const [canShowAdicionaPaletaModal, setCanShowAdicionaPaletaModal] =
    useState(false);

  const [paletaEditada, setPaletaEditada] = useState();

  const [canOpenBag, setCanOpenBag] = useState();

  const [paletaParaAdicionar, setPaletaParaAdicionar] = useState();

  const [modoAtual, setModoAtual] = useState(ActionMode.NORMAL);
  const handleActions = (action) => {
    const novaAcao = modoAtual === action ? ActionMode.NORMAL : action;
    setModoAtual(novaAcao);
  };

  const [paletaRemovida, setPaletaRemovida] = useState();

  const [paletaParaEditar, setPaletaParaEditar] = useState();

  const [paletaParaDeletar, setPaletaParaDeletar] = useState();

  const abrirSacola = async () => {
    const lista = JSON.parse(localStorage.getItem('sacola'));
    const sacola = lista.filter((i) => i.quantidade > 0);

    await SacolaService.create(sacola);

    setCanOpenBag(true);
  };

  const handleDeletePaleta = (paletaToDelete) => {
    setPaletaParaDeletar(paletaToDelete);
  };

  const handleUpdatePaleta = (paletaToUpdate) => {
    setPaletaParaEditar(paletaToUpdate);
    setCanShowAdicionaPaletaModal(true);
  };

  const handleCloseModal = () => {
    setCanShowAdicionaPaletaModal(false);
    setPaletaParaAdicionar();
    setPaletaParaDeletar();
    setPaletaParaEditar();
    setModoAtual(ActionMode.NORMAL);
  };

  return (
    <div className="Home">
      <Navbar
        mode={modoAtual}
        createPaleta={() => setCanShowAdicionaPaletaModal(true)}
        deletePaleta={() => handleActions(ActionMode.DELETAR)}
        openBag={abrirSacola}
        updatePaleta={() => handleActions(ActionMode.ATUALIZAR)}
      />

      {canShowAdicionaPaletaModal && (
        <AdicionaEditaPaletaModal
          mode={modoAtual}
          paletaToUpdate={paletaParaEditar}
          closeModal={handleCloseModal}
          onCreatePaleta={(paleta) => setPaletaParaAdicionar(paleta)}
        />
      )}

      <div className="Home__container">
        <PaletaLista
          mode={modoAtual}
          paletaCriada={paletaParaAdicionar}
          paletaEditada={paletaEditada}
          paletaRemovida={paletaRemovida}
          deletePaleta={handleDeletePaleta}
          updatePaleta={handleUpdatePaleta}
        />
        {canOpenBag && <SacolaModal closeModal={() => setCanOpenBag(false)} />}
        {paletaParaDeletar && (
          <DeletaPaletaModal
            paletaParaDeletar={paletaParaDeletar}
            closeModal={handleCloseModal}
            onDeletePaleta={(paleta) => setPaletaRemovida(paleta)}
          />
        )}
        {canShowAdicionaPaletaModal && (
          <AdicionaEditaPaletaModal
            mode={modoAtual}
            paletaToUpdate={paletaParaEditar}
            onUpdatePaleta={(paleta) => setPaletaEditada(paleta)}
            closeModal={handleCloseModal}
            onCreatePaleta={(paleta) => setPaletaParaAdicionar(paleta)}
          />
        )}
      </div>
    </div>
  );
}

export default Home;
