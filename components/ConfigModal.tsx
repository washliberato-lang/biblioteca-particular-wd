
import React, { useState } from 'react';

interface ConfigModalProps {
  currentUrl: string;
  onSave: (url: string) => void;
  onClose: () => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({ currentUrl, onSave, onClose }) => {
  const [url, setUrl] = useState(currentUrl);
  const [shareLink, setShareLink] = useState('');

  const handleSave = () => {
    onSave(url);
  };

  const generateShareLink = () => {
    const baseUrl = window.location.href.split('?')[0];
    const fullLink = `${baseUrl}?sheet=${encodeURIComponent(url)}`;
    setShareLink(fullLink);
    navigator.clipboard.writeText(fullLink);
    alert('Link copiado para a área de transferência!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 serif">Conectar Google Sheets</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Instructions */}
          <div className="bg-indigo-50 p-4 rounded-lg text-sm text-indigo-800 border border-indigo-100 space-y-2">
            <p className="font-bold">Como conectar sua planilha:</p>
            <ol className="list-decimal list-inside space-y-1 ml-1">
              <li>Abra sua planilha no Google Sheets.</li>
              <li>Vá em <strong>Arquivo &gt; Compartilhar &gt; Publicar na Web</strong>.</li>
              <li>Selecione a aba da planilha e o formato <strong>Valores separados por vírgula (.csv)</strong>.</li>
              <li>Clique em Publicar e copie o link gerado.</li>
              <li>Cole o link abaixo.</li>
            </ol>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link CSV do Google Sheets</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/e/.../pub?output=csv"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition-colors"
            >
              Salvar e Sincronizar
            </button>
          </div>

          {/* Sharing Section */}
          {currentUrl && (
            <div className="pt-6 border-t border-gray-100">
              <h3 className="font-bold text-gray-800 mb-2">Compartilhar sua Biblioteca</h3>
              <p className="text-sm text-gray-500 mb-3">
                Envie este link para amigos. Eles poderão ver seus livros, mas não poderão editar.
              </p>
              <button
                onClick={generateShareLink}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-50 text-green-700 border border-green-200 rounded-lg font-medium hover:bg-green-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Gerar Link de Visita
              </button>
              {shareLink && (
                <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-500 break-all font-mono border border-gray-200">
                  {shareLink}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
