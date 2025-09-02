import React from 'react';
import { Article } from '../data/articles';
import './ArticleModal.css';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
}

const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="article-modal-backdrop" onClick={handleBackdropClick}>
      <div className="article-modal">
        <div className="article-modal-header">
          <h2>Article {article.id}: {article.title}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="article-modal-content">
          <p className="article-main-content">{article.content}</p>
          
          {article.subsections && article.subsections.length > 0 && (
            <div className="article-subsections">
              <h3>Provisions</h3>
              {article.subsections.map((subsection) => (
                <div key={subsection.id} className="subsection">
                  <h4>{subsection.id}</h4>
                  <p>{subsection.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="article-modal-footer">
          <p className="source-note">AI Judge™ Rules of Procedure v3.2</p>
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;