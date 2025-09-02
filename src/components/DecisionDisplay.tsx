import React, { useState } from 'react';
import './DecisionDisplay.css';
import ArticleModal from './ArticleModal';
import { getArticleById, getArticlePreview, Article } from '../data/articles';

interface DecisionProps {
  decision: any;
}

const DecisionDisplay: React.FC<DecisionProps> = ({ decision }) => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [hoveredArticle, setHoveredArticle] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const handleArticleClick = (articleId: string) => {
    const article = getArticleById(articleId);
    if (article) {
      setSelectedArticle(article);
    }
  };

  const handleArticleHover = (articleId: string, event: React.MouseEvent) => {
    setHoveredArticle(articleId);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const renderArticleReference = (articleText: string) => {
    // Extract article number from text like "Article 5.3" or "5.3"
    const match = articleText.match(/(?:Article\s+)?(\d+(?:\.\d+)?)/i);
    if (!match) return articleText;
    
    const articleId = match[1];
    const article = getArticleById(articleId);
    if (!article) return articleText;

    return (
      <span
        className="article-reference"
        onClick={() => handleArticleClick(articleId)}
        onMouseEnter={(e) => handleArticleHover(articleId, e)}
        onMouseLeave={() => setHoveredArticle(null)}
      >
        {articleText}
      </span>
    );
  };

  const renderRulesWithLinks = (rulesText: string) => {
    // Split by bullet points and process each rule
    const rules = rulesText.split('•').filter(r => r.trim());
    
    return rules.map((rule, index) => {
      // Find all article references in this rule
      const parts = rule.split(/(Article\s+\d+(?:\.\d+)?|\b\d+\.\d+\b)/gi);
      
      return (
        <p key={index} className="rule-item">
          • {parts.map((part, partIndex) => {
            if (part.match(/(?:Article\s+)?(\d+(?:\.\d+)?)/i)) {
              return <React.Fragment key={partIndex}>{renderArticleReference(part)}</React.Fragment>;
            }
            return <React.Fragment key={partIndex}>{part}</React.Fragment>;
          })}
        </p>
      );
    });
  };

  const formatDecisionText = (text: string) => {
    // Parse the text and format it into sections
    const sections = {
      timestamp: '',
      summary: '',
      facts: '',
      evidence: '',
      rules: '',
      reasoning: '',
      remedy: '',
      notes: ''
    };

    // Extract sections using regex for the enhanced format
    const timestampMatch = text.match(/Decision Rendered:\s*(.*?)(?:\n|$)/);
    const summaryMatch = text.match(/I\.\s*SUMMARY OF DISPUTE\s*(.*?)(?=II\.|$)/s);
    const factsMatch = text.match(/II\.\s*ESTABLISHED FACTS\s*(.*?)(?=III\.|$)/s);
    const evidenceMatch = text.match(/III\.\s*EVIDENCE CONSIDERED\s*(.*?)(?=IV\.|$)/s);
    const rulesMatch = text.match(/IV\.\s*APPLICABLE RULES\s*(.*?)(?=V\.|$)/s);
    const reasoningMatch = text.match(/V\.\s*TRIBUNAL REASONING\s*(.*?)(?=VI\.|$)/s);
    const remedyMatch = text.match(/VI\.\s*RULING AND REMEDY\s*(.*?)(?=VII\.|$)/s);
    const notesMatch = text.match(/VII\.\s*ADDITIONAL NOTES\s*(.*?)(?=---|$)/s);

    if (timestampMatch) sections.timestamp = timestampMatch[1].trim();
    if (summaryMatch) sections.summary = summaryMatch[1].trim();
    if (factsMatch) {
      // Extract content after "Based on the evidence provided, the Tribunal finds that:"
      const factsContent = factsMatch[1].trim();
      const afterFinds = factsContent.match(/Based on the evidence provided, the Tribunal finds that:\s*([\s\S]*)/);
      sections.facts = afterFinds ? afterFinds[1].trim() : factsContent;
    }
    if (evidenceMatch) {
      // Extract content after "The Tribunal assessed, inter alia:"
      const evidenceContent = evidenceMatch[1].trim();
      const afterAssessed = evidenceContent.match(/The Tribunal assessed, inter alia:\s*([\s\S]*)/);
      sections.evidence = afterAssessed ? afterAssessed[1].trim() : evidenceContent;
    }
    if (rulesMatch) {
      // Extract content after "This dispute is governed by the following provisions of the AI Judge™ Rules of Procedure:"
      const rulesContent = rulesMatch[1].trim();
      const afterGoverned = rulesContent.match(/This dispute is governed by the following provisions of the AI Judge™ Rules of Procedure:\s*([\s\S]*)/);
      sections.rules = afterGoverned ? afterGoverned[1].trim() : rulesContent;
    }
    if (reasoningMatch) sections.reasoning = reasoningMatch[1].trim();
    if (remedyMatch) sections.remedy = remedyMatch[1].trim();
    if (notesMatch) sections.notes = notesMatch[1].trim();

    return sections;
  };

  // Debug: Log the raw decision data
  console.log('Raw decision data:', decision);
  console.log('Finding summary:', decision.decision.finding_summary);
  
  const sections = formatDecisionText(decision.decision.finding_summary);
  const isLowConfidence = decision.decision.confidence_score < 0.60;
  
  // Debug: Log parsed sections
  console.log('Parsed sections:', sections);

  return (
    <>
      <div className="decision-display">
      <div className="decision-header">
        <div className="court-seal">⚖️</div>
        <h1>AI JUDGE™ TRIBUNAL</h1>
        <h2>BINDING ARBITRATION DECISION</h2>
        <div className="case-info">
          <p>Case No: {decision.decision.dispute_id}</p>
          <p>Date: {sections.timestamp ? new Date(sections.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p>Category: {decision.decision.dispute_category}</p>
        </div>
      </div>

      <div className="decision-body">
        <section className="decision-section">
          <h3>I. SUMMARY OF DISPUTE</h3>
          <p>{sections.summary}</p>
        </section>

        <section className="decision-section">
          <h3>II. ESTABLISHED FACTS</h3>
          <div className="facts-list">
            {sections.facts.split('•').filter(f => f.trim()).map((fact, index) => (
              <p key={index} className="fact-item">• {fact.trim()}</p>
            ))}
          </div>
        </section>

        <section className="decision-section">
          <h3>III. EVIDENCE CONSIDERED</h3>
          <div className="evidence-list">
            {sections.evidence.split('•').filter(e => e.trim()).map((evidence, index) => (
              <p key={index} className="evidence-item">• {evidence.trim()}</p>
            ))}
          </div>
        </section>

        <section className="decision-section">
          <h3>IV. APPLICABLE RULES</h3>
          <div className="rules-list">
            {renderRulesWithLinks(sections.rules)}
          </div>
        </section>

        <section className="decision-section">
          <h3>V. TRIBUNAL REASONING</h3>
          <p className="reasoning-text">{sections.reasoning}</p>
        </section>

        <section className="decision-section ruling">
          <h3>VI. RULING AND REMEDY</h3>
          <div className="ruling-box">
            <p className="ruling-text">{sections.remedy}</p>
            <div className="remedy-details">
              <p><strong>Remedy Type:</strong> {decision.decision.remedy_awarded.type.replace(/_/g, ' ').toUpperCase()}</p>
              {decision.decision.remedy_awarded.amount_usd > 0 && (
                <p><strong>Amount:</strong> USD ${decision.decision.remedy_awarded.amount_usd.toFixed(2)}</p>
              )}
              <p><strong>Compliance Deadline:</strong> {new Date(decision.decision.compliance_deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
        </section>

        <section className="decision-section">
          <h3>VII. ADDITIONAL NOTES</h3>
          <div className="notes-content">
            <p>{sections.notes}</p>
            <div className="confidence-info">
              <p><strong>Confidence Score:</strong> {decision.decision.confidence_score.toFixed(2)}</p>
              {isLowConfidence && (
                <div className="appeal-notice">
                  <p className="appeal-text">⚠️ LOW-CONFIDENCE DECISION</p>
                  <p>This decision may be appealed within 5 days pursuant to Article 6.4 of the AI Judge™ Rules of Procedure.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <div className="decision-footer">
        <div className="signature-section">
          <p>Electronically signed and issued by:</p>
          <p className="signature">AI Judge™ Tribunal</p>
          <p className="timestamp">{new Date().toISOString()}</p>
        </div>
        <div className="footer-text">
          <p>This decision is final and binding on all parties, subject only to appeal rights as stated above.</p>
          <p>Issued under the AI Judge™ Rules of Procedure v3.2</p>
        </div>
      </div>
      </div>

      {hoveredArticle && (
        <div 
          className="article-tooltip"
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y - 10
          }}
        >
          {getArticlePreview(hoveredArticle)}
        </div>
      )}

      <ArticleModal 
        article={selectedArticle} 
        onClose={() => setSelectedArticle(null)} 
      />
    </>
  );
};

export default DecisionDisplay;