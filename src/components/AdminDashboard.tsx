import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

interface ReasoningStep {
  step: number;
  title: string;
  thought: string;
  conclusion: string;
}

interface ReasoningData {
  disputeId: string;
  timestamp: string;
  inputData: any;
  promptSent: string;
  aiResponse: any;
  reasoningSteps: ReasoningStep[];
  processingTime: number;
}

interface DisputeSummary {
  disputeId: string;
  timestamp: string;
  category: string;
  claimantType: string;
  confidence: number;
}

const AdminDashboard: React.FC = () => {
  const [disputes, setDisputes] = useState<DisputeSummary[]>([]);
  const [selectedDispute, setSelectedDispute] = useState<string | null>(null);
  const [reasoningData, setReasoningData] = useState<ReasoningData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'steps' | 'prompt' | 'response'>('steps');

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/admin/disputes');
      setDisputes(response.data);
    } catch (error) {
      console.error('Error fetching disputes:', error);
    }
  };

  const fetchReasoningData = async (disputeId: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/api/admin/reasoning/${disputeId}`);
      setReasoningData(response.data);
      setSelectedDispute(disputeId);
    } catch (error) {
      console.error('Error fetching reasoning data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.75) return '#48bb78';
    if (score >= 0.60) return '#ed8936';
    return '#e53e3e';
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>🧠 AI Judge™ Admin Dashboard</h1>
        <p>Behind-the-scenes AI reasoning analysis</p>
      </header>

      <div className="dashboard-layout">
        <aside className="disputes-sidebar">
          <h2>Recent Disputes</h2>
          <div className="disputes-list">
            {disputes.map((dispute) => (
              <div
                key={dispute.disputeId}
                className={`dispute-item ${selectedDispute === dispute.disputeId ? 'active' : ''}`}
                onClick={() => fetchReasoningData(dispute.disputeId)}
              >
                <div className="dispute-header">
                  <span className="dispute-id">{dispute.disputeId}</span>
                  <span 
                    className="confidence-badge"
                    style={{ backgroundColor: getConfidenceColor(dispute.confidence) }}
                  >
                    {(dispute.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="dispute-meta">
                  <span>{dispute.category}</span>
                  <span>{dispute.claimantType}</span>
                </div>
                <div className="dispute-time">
                  {new Date(dispute.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="reasoning-main">
          {loading && <div className="loading">Loading reasoning data...</div>}
          
          {!loading && !reasoningData && (
            <div className="empty-state">
              <h3>Select a dispute to view AI reasoning</h3>
              <p>Click on any dispute from the list to see step-by-step analysis</p>
            </div>
          )}

          {!loading && reasoningData && (
            <>
              <div className="reasoning-header">
                <h2>Case Analysis: {reasoningData.disputeId}</h2>
                <div className="processing-time">
                  Processing time: {(reasoningData.processingTime / 1000).toFixed(2)}s
                </div>
              </div>

              <div className="tabs">
                <button
                  className={`tab ${activeTab === 'steps' ? 'active' : ''}`}
                  onClick={() => setActiveTab('steps')}
                >
                  Step-by-Step Reasoning
                </button>
                <button
                  className={`tab ${activeTab === 'prompt' ? 'active' : ''}`}
                  onClick={() => setActiveTab('prompt')}
                >
                  Full Prompt Sent
                </button>
                <button
                  className={`tab ${activeTab === 'response' ? 'active' : ''}`}
                  onClick={() => setActiveTab('response')}
                >
                  Raw AI Response
                </button>
              </div>

              <div className="tab-content">
                {activeTab === 'steps' && (
                  <div className="reasoning-steps">
                    {reasoningData.reasoningSteps && reasoningData.reasoningSteps.length > 0 ? (
                      reasoningData.reasoningSteps.map((step) => (
                        <div key={step.step} className="reasoning-step">
                          <div className="step-header">
                            <span className="step-number">Step {step.step}</span>
                            <h3>{step.title}</h3>
                          </div>
                          <div className="step-content">
                            <div className="thought-bubble">
                              <h4>AI Thought Process:</h4>
                              <p>{step.thought}</p>
                            </div>
                            <div className="conclusion-box">
                              <h4>Conclusion:</h4>
                              <p>{step.conclusion}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state">
                        <p>No reasoning steps available for this dispute.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'prompt' && (
                  <div className="prompt-view">
                    <h3>Complete Prompt Sent to AI:</h3>
                    <pre>{reasoningData.promptSent}</pre>
                  </div>
                )}

                {activeTab === 'response' && (
                  <div className="response-view">
                    <h3>Raw AI Response:</h3>
                    <pre>{JSON.stringify(reasoningData.aiResponse, null, 2)}</pre>
                  </div>
                )}
              </div>

              <div className="input-data-section">
                <h3>Original Input Data</h3>
                <div className="input-data-grid">
                  <div className="data-field">
                    <label>Claimant Type:</label>
                    <span>{reasoningData.inputData?.claimant_type || 'N/A'}</span>
                  </div>
                  <div className="data-field">
                    <label>Category:</label>
                    <span>{reasoningData.inputData?.dispute_category || 'N/A'}</span>
                  </div>
                  <div className="data-field">
                    <label>Amount:</label>
                    <span>${reasoningData.inputData?.dispute_amount || 'N/A'}</span>
                  </div>
                </div>
                <div className="claim-texts">
                  <div className="claim-section">
                    <h4>Statement of Claim:</h4>
                    <p>{reasoningData.inputData?.statement_of_claim || 'No statement of claim provided'}</p>
                  </div>
                  {reasoningData.inputData?.statement_of_defence && (
                    <div className="claim-section">
                      <h4>Statement of Defence:</h4>
                      <p>{reasoningData.inputData.statement_of_defence}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;