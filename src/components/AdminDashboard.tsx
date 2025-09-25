import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import DecisionDisplay from "./DecisionDisplay";
import { useAuth } from "../contexts/AuthContext";
import "./AdminDashboard.css";

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
  status: string;
  amount: number;
  userId?: string;
}

interface PaginationInfo {
  current_page: number;
  per_page: number;
  total_pages: number;
  total_items: number;
}

interface DisputeStats {
  totalDisputes: number;
  avgConfidence: number;
  avgAmount: number;
  avgProcessingTime: number;
  categoryBreakdown: Record<string, number>;
  claimantTypeBreakdown: Record<string, number>;
  statusBreakdown: Record<string, number>;
}

const AdminDashboard: React.FC = () => {
  const { token, isAuthenticated } = useAuth();
  const [disputes, setDisputes] = useState<DisputeSummary[]>([]);
  const [selectedDispute, setSelectedDispute] = useState<string | null>(null);
  const [reasoningData, setReasoningData] = useState<ReasoningData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "steps" | "prompt" | "response" | "formatted"
  >("overview");
  const [pagination, setPagination] = useState<PaginationInfo>({
    current_page: 1,
    per_page: 20,
    total_pages: 1,
    total_items: 0,
  });
  const [stats, setStats] = useState<DisputeStats | null>(null);

  const fetchDisputes = useCallback(
    async (page: number = 1) => {
      if (!token) {
        console.error("No authentication token available");
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/admin/disputes?page=${page}&limit=20`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDisputes(response.data.disputes || []);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      } catch (error) {
        console.error("Error fetching disputes:", error);
      }
    },
    [token]
  );

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/disputes/stats`
      );
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchReasoningData = async (disputeId: string) => {
    if (!token) {
      console.error("No authentication token available");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/reasoning/${disputeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReasoningData(response.data);
      setSelectedDispute(disputeId);
    } catch (error) {
      console.error("Error fetching reasoning data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchDisputes();
      fetchStats();
    }
  }, [isAuthenticated, token, fetchDisputes, fetchStats]);

  const getConfidenceColor = (score: number) => {
    if (score >= 0.75) return "#48bb78";
    if (score >= 0.6) return "#ed8936";
    return "#e53e3e";
  };

  // Show loading or authentication required message
  if (!isAuthenticated) {
    return (
      <div className="admin-dashboard">
        <div className="dashboard-layout">
          <div className="empty-state">
            <h3>Authentication Required</h3>
            <p>Please log in to access the admin dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <LoadingSpinner isVisible={loading} />
      <div className="dashboard-layout">
        <aside className="disputes-sidebar">
          <h2>Recent Disputes</h2>
          <div className="disputes-list">
            {disputes.map((dispute) => (
              <div
                key={dispute.disputeId}
                className={`dispute-item ${
                  selectedDispute === dispute.disputeId ? "active" : ""
                }`}
                onClick={() => fetchReasoningData(dispute.disputeId)}
              >
                <div className="dispute-header">
                  <span className="dispute-id">{dispute.disputeId}</span>
                  <span
                    className="confidence-badge"
                    style={{
                      backgroundColor: getConfidenceColor(dispute.confidence),
                    }}
                  >
                    {(dispute.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="dispute-meta">
                  <span>{dispute.category}</span>
                  <span>{dispute.claimantType}</span>
                  <span className={`status-badge status-${dispute.status}`}>
                    {dispute.status}
                  </span>
                </div>
                <div className="dispute-amount">
                  ${dispute.amount?.toFixed(2) || "0.00"}
                </div>
                <div className="dispute-time">
                  {new Date(dispute.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
            {pagination.total_pages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => fetchDisputes(pagination.current_page - 1)}
                  disabled={pagination.current_page <= 1}
                  className="pagination-btn"
                >
                  Previous
                </button>
                <span className="pagination-info">
                  Page {pagination.current_page} of {pagination.total_pages}
                </span>
                <button
                  onClick={() => fetchDisputes(pagination.current_page + 1)}
                  disabled={pagination.current_page >= pagination.total_pages}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </aside>

        <main className="reasoning-main">
          {loading && <div className="loading">Loading reasoning data...</div>}

          {!loading && !reasoningData && (
            <div className="empty-state">
              <h3>Select a dispute to view AI reasoning</h3>
              <p>
                Click on any dispute from the list to see step-by-step analysis
              </p>
            </div>
          )}

          {!loading && reasoningData && (
            <>
              <div className="reasoning-header">
                <h2>Case Analysis: {reasoningData.disputeId}</h2>
                <div className="processing-time">
                  Processing time:{" "}
                  {(reasoningData.processingTime / 1000).toFixed(2)}s
                </div>
              </div>

              <div className="tabs">
                <button
                  className={`tab ${activeTab === "overview" ? "active" : ""}`}
                  onClick={() => setActiveTab("overview")}
                >
                  Overview & Stats
                </button>
                <button
                  className={`tab ${activeTab === "steps" ? "active" : ""}`}
                  onClick={() => setActiveTab("steps")}
                >
                  Step-by-Step Reasoning
                </button>
                <button
                  className={`tab ${activeTab === "prompt" ? "active" : ""}`}
                  onClick={() => setActiveTab("prompt")}
                >
                  Full Prompt Sent
                </button>
                <button
                  className={`tab ${activeTab === "response" ? "active" : ""}`}
                  onClick={() => setActiveTab("response")}
                >
                  Raw AI Response
                </button>
                <button
                  className={`tab ${activeTab === "formatted" ? "active" : ""}`}
                  onClick={() => setActiveTab("formatted")}
                >
                  Formatted Decision
                </button>
              </div>

              <div className="tab-content">
                {activeTab === "overview" && (
                  <div className="overview-section">
                    <div className="dispute-overview">
                      <h3>Dispute Overview</h3>
                      <div className="overview-grid">
                        <div className="overview-item">
                          <label>Dispute ID:</label>
                          <span>{reasoningData.disputeId}</span>
                        </div>
                        <div className="overview-item">
                          <label>Category:</label>
                          <span>
                            {reasoningData.inputData?.dispute_category || "N/A"}
                          </span>
                        </div>
                        <div className="overview-item">
                          <label>Claimant:</label>
                          <span>
                            {reasoningData.inputData?.claimant_type || "N/A"}
                          </span>
                        </div>
                        <div className="overview-item">
                          <label>Amount:</label>
                          <span>
                            ${reasoningData.inputData?.dispute_amount || "N/A"}
                          </span>
                        </div>
                        <div className="overview-item">
                          <label>Processing Time:</label>
                          <span>
                            {(reasoningData.processingTime / 1000).toFixed(2)}s
                          </span>
                        </div>
                        <div className="overview-item">
                          <label>Confidence Score:</label>
                          <span
                            style={{
                              color: getConfidenceColor(
                                reasoningData.aiResponse?.decision
                                  ?.confidence_score || 0
                              ),
                              fontWeight: "bold",
                            }}
                          >
                            {(
                              (reasoningData.aiResponse?.decision
                                ?.confidence_score || 0) * 100
                            ).toFixed(0)}
                            %
                          </span>
                        </div>
                      </div>
                    </div>

                    {statsLoading ? (
                      <div className="system-stats">
                        <h3>System Statistics</h3>
                        <div className="loading">Loading statistics...</div>
                      </div>
                    ) : (
                      stats && (
                        <div className="system-stats">
                          <h3>System Statistics</h3>
                          <div className="stats-grid">
                            <div className="stat-card">
                              <h4>Total Disputes</h4>
                              <span className="stat-value">
                                {stats.totalDisputes}
                              </span>
                            </div>
                            <div className="stat-card">
                              <h4>Avg Confidence</h4>
                              <span className="stat-value">
                                {(stats.avgConfidence * 100).toFixed(0)}%
                              </span>
                            </div>
                            <div className="stat-card">
                              <h4>Avg Amount</h4>
                              <span className="stat-value">
                                ${stats.avgAmount.toFixed(2)}
                              </span>
                            </div>
                            <div className="stat-card">
                              <h4>Avg Processing</h4>
                              <span className="stat-value">
                                {(stats.avgProcessingTime / 1000).toFixed(1)}s
                              </span>
                            </div>
                          </div>

                          <div className="breakdown-section">
                            <div className="breakdown-card">
                              <h4>Categories</h4>
                              <div className="breakdown-items">
                                {Object.entries(stats.categoryBreakdown).map(
                                  ([category, count]) => (
                                    <div
                                      key={category}
                                      className="breakdown-item"
                                    >
                                      <span className="breakdown-label">
                                        {category}
                                      </span>
                                      <span className="breakdown-count">
                                        {count}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>

                            <div className="breakdown-card">
                              <h4>Status Distribution</h4>
                              <div className="breakdown-items">
                                {Object.entries(stats.statusBreakdown).map(
                                  ([status, count]) => (
                                    <div
                                      key={status}
                                      className="breakdown-item"
                                    >
                                      <span
                                        className={`breakdown-label status-${status}`}
                                      >
                                        {status}
                                      </span>
                                      <span className="breakdown-count">
                                        {count}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}

                {activeTab === "steps" && (
                  <div className="reasoning-steps">
                    {reasoningData.reasoningSteps &&
                    reasoningData.reasoningSteps.length > 0 ? (
                      reasoningData.reasoningSteps.map((step) => (
                        <div key={step.step} className="reasoning-step">
                          <div className="step-header">
                            <span className="step-number">
                              Step {step.step}
                            </span>
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

                {activeTab === "prompt" && (
                  <div className="prompt-view">
                    <h3>Complete Prompt Sent to AI:</h3>
                    <pre>{reasoningData.promptSent}</pre>
                  </div>
                )}

                {activeTab === "response" && (
                  <div className="response-view">
                    <h3>Raw AI Response:</h3>
                    <pre>
                      {JSON.stringify(reasoningData.aiResponse, null, 2)}
                    </pre>
                  </div>
                )}

                {activeTab === "formatted" && (
                  <div className="formatted-decision-view">
                    <h3>Formatted Decision:</h3>
                    <div className="decision-container">
                      <DecisionDisplay decision={reasoningData.aiResponse} />
                    </div>
                  </div>
                )}
              </div>

              <div className="input-data-section">
                <h3>Original Input Data</h3>
                <div className="input-data-grid">
                  <div className="data-field">
                    <label>Claimant Type:</label>
                    <span>
                      {reasoningData.inputData?.claimant_type || "N/A"}
                    </span>
                  </div>
                  <div className="data-field">
                    <label>Category:</label>
                    <span>
                      {reasoningData.inputData?.dispute_category || "N/A"}
                    </span>
                  </div>
                  <div className="data-field">
                    <label>Amount:</label>
                    <span>
                      ${reasoningData.inputData?.dispute_amount || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="claim-texts">
                  <div className="claim-section">
                    <h4>Statement of Claim:</h4>
                    <p>
                      {reasoningData.inputData?.statement_of_claim ||
                        "No statement of claim provided"}
                    </p>
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
