import React, { useState } from "react";
import axios from "axios";
import DecisionDisplay from "./DecisionDisplay";
import LoadingSpinner from "./LoadingSpinner";
import "./DisputeForm.css";

interface EvidenceItem {
  type: "photo" | "pdf" | "tracking_log" | "API_data" | "text_note";
  description: string;
  timestamp: string;
  sha256_hash: string;
  source: "Buyer" | "Seller";
  file?: File;
  fileName?: string;
}

interface DisputeFormData {
  claimant_type: "Buyer" | "Seller";
  dispute_amount: string;
  statement_of_claim: string;
  statement_of_defence: string;
  dispute_category: string;
  submitted_evidence: EvidenceItem[];
}

interface DisputeDecision {
  decision: {
    dispute_id: string;
    dispute_category: string;
    rules_applied: string[];
    confidence_score: number;
    finding_summary: string;
    remedy_awarded: {
      type: string;
      amount_usd: number;
      return_required: boolean;
      notes?: string;
    };
    compliance_deadline: string;
    misconduct_flag: {
      misleading_conduct: boolean;
      fraudulent_behavior: boolean;
      tier: string | null;
    };
    appealable: boolean;
  };
}

const DisputeForm: React.FC = () => {
  const [formData, setFormData] = useState<DisputeFormData>({
    claimant_type: "Buyer",
    dispute_amount: "",
    statement_of_claim: "",
    statement_of_defence: "",
    dispute_category: "Item not received",
    submitted_evidence: [],
  });

  const [loading, setLoading] = useState(false);
  const [decision, setDecision] = useState<DisputeDecision | null>(null);
  const [error, setError] = useState<string | null>(null);

  const disputeCategories = [
    "Item not received",
    "Item defective or damaged",
    "Incorrect Item sent",
    "Partial shipment or missing components",
    "Late delivery",
    "Service not rendered",
    "Unauthorized charge",
    "Buyer fraud or abuse",
    "Breach of stated cancellation or refund policy",
    "Counterfeit Item",
    "Warranty or functional failure within ninety (90) days",
    "Subscription Service cancellation errors",
    "Digital-content delivery or activation failure",
  ];

  const evidenceTypes = [
    "photo",
    "pdf",
    "tracking_log",
    "API_data",
    "text_note",
  ] as const;

  const generateSHA256 = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const validateFile = (file: File, evidenceType: string): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (file.size > maxSize) {
      return "File size must be less than 10MB";
    }

    const allowedTypes: Record<string, string[]> = {
      photo: ["image/jpeg", "image/png", "image/gif", "image/webp"],
      pdf: ["application/pdf"],
      tracking_log: ["text/plain", "text/csv", "application/json"],
      API_data: ["application/json", "text/plain"],
      text_note: ["text/plain", "text/markdown"],
    };

    if (
      allowedTypes[evidenceType] &&
      !allowedTypes[evidenceType].includes(file.type)
    ) {
      return `Invalid file type for ${evidenceType}. Allowed types: ${allowedTypes[
        evidenceType
      ].join(", ")}`;
    }

    return null;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addEvidenceItem = () => {
    const newEvidence: EvidenceItem = {
      type: "photo",
      description: "",
      timestamp: new Date().toISOString(),
      sha256_hash: "",
      source: "Buyer",
    };

    setFormData((prev) => ({
      ...prev,
      submitted_evidence: [...prev.submitted_evidence, newEvidence],
    }));
  };

  const removeEvidenceItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      submitted_evidence: prev.submitted_evidence.filter((_, i) => i !== index),
    }));
  };

  const handleEvidenceChange = (
    index: number,
    field: keyof EvidenceItem,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      submitted_evidence: prev.submitted_evidence.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleFileUpload = async (index: number, file: File) => {
    const evidence = formData.submitted_evidence[index];
    const validationError = validateFile(file, evidence.type);

    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      const sha256Hash = await generateSHA256(file);

      setFormData((prev) => ({
        ...prev,
        submitted_evidence: prev.submitted_evidence.map((item, i) =>
          i === index
            ? {
                ...item,
                file: file,
                fileName: file.name,
                sha256_hash: sha256Hash,
              }
            : item
        ),
      }));
    } catch (error) {
      console.error("Error processing file:", error);
      alert("Error processing file. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setDecision(null);

    try {
      const response = await axios.post("http://localhost:3001/api/dispute", {
        ...formData,
        startTime: Date.now(),
      });
      setDecision(response.data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.details ||
        err.message ||
        "Failed to process dispute. Please try again.";
      setError(errorMessage);
      console.error("Error:", err);
      console.error("Error response:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dispute-form-container">
      <LoadingSpinner isVisible={loading} />
      <form onSubmit={handleSubmit} className="dispute-form">
        <div className="form-group">
          <label htmlFor="claimant_type">Claimant Type</label>
          <select
            id="claimant_type"
            name="claimant_type"
            value={formData.claimant_type}
            onChange={handleChange}
            required
          >
            <option value="Buyer">Buyer</option>
            <option value="Seller">Seller</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="dispute_amount">Dispute Amount (USD)</label>
          <input
            type="number"
            id="dispute_amount"
            name="dispute_amount"
            value={formData.dispute_amount}
            onChange={handleChange}
            required
            min="0.01"
            max="1000.00"
            step="0.01"
            placeholder="e.g., 99.99"
          />
        </div>

        <div className="form-group">
          <label htmlFor="dispute_category">Dispute Category</label>
          <select
            id="dispute_category"
            name="dispute_category"
            value={formData.dispute_category}
            onChange={handleChange}
            required
          >
            {disputeCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="statement_of_claim">Statement of Claim</label>
          <textarea
            id="statement_of_claim"
            name="statement_of_claim"
            value={formData.statement_of_claim}
            onChange={handleChange}
            required
            rows={8}
            maxLength={2000}
            placeholder="Describe the buyer's or seller's claim (max 2000 words)"
          />
          <div className="char-count">
            {formData.statement_of_claim.length}/2000
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="statement_of_defence">
            Statement of Defence (optional)
          </label>
          <textarea
            id="statement_of_defence"
            name="statement_of_defence"
            value={formData.statement_of_defence}
            onChange={handleChange}
            rows={6}
            placeholder="Describe the opposing party's defence (if provided)"
          />
        </div>

        <div className="form-group">
          <label>Submitted Evidence</label>
          <div className="evidence-section">
            {formData.submitted_evidence.map((evidence, index) => (
              <div key={index} className="evidence-item">
                <div className="evidence-header">
                  <h4>Evidence Item {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeEvidenceItem(index)}
                    className="remove-evidence-btn"
                  >
                    ×
                  </button>
                </div>

                <div className="evidence-fields">
                  <div className="evidence-field">
                    <label>Type</label>
                    <select
                      value={evidence.type}
                      onChange={(e) =>
                        handleEvidenceChange(index, "type", e.target.value)
                      }
                      required
                    >
                      {evidenceTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="evidence-field">
                    <label>Description</label>
                    <input
                      type="text"
                      value={evidence.description}
                      onChange={(e) =>
                        handleEvidenceChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      required
                      placeholder="Describe the evidence"
                    />
                  </div>

                  <div className="evidence-field">
                    <label>Timestamp</label>
                    <input
                      type="datetime-local"
                      value={evidence.timestamp.slice(0, 16)}
                      onChange={(e) =>
                        handleEvidenceChange(
                          index,
                          "timestamp",
                          new Date(e.target.value).toISOString()
                        )
                      }
                      required
                    />
                  </div>

                  <div className="evidence-field">
                    <label>Upload File</label>
                    <div className="file-upload-container">
                      <input
                        type="file"
                        id={`file-upload-${index}`}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(index, file);
                          }
                        }}
                        className="file-input"
                        accept={
                          evidence.type === "photo"
                            ? "image/*"
                            : evidence.type === "pdf"
                            ? ".pdf"
                            : evidence.type === "tracking_log"
                            ? ".txt,.csv,.json"
                            : evidence.type === "API_data"
                            ? ".json,.txt"
                            : ".txt,.md"
                        }
                      />
                      <label
                        htmlFor={`file-upload-${index}`}
                        className="file-upload-btn"
                      >
                        📁 Choose File
                      </label>
                      {evidence.fileName && (
                        <span className="file-name">{evidence.fileName}</span>
                      )}
                    </div>
                  </div>

                  <div className="evidence-field">
                    <label>SHA256 Hash</label>
                    <input
                      type="text"
                      value={evidence.sha256_hash}
                      onChange={(e) =>
                        handleEvidenceChange(
                          index,
                          "sha256_hash",
                          e.target.value
                        )
                      }
                      required
                      placeholder={
                        evidence.fileName
                          ? "Auto-generated from uploaded file"
                          : "SHA256 hash of the evidence file"
                      }
                      readOnly={!!evidence.fileName}
                    />
                  </div>

                  <div className="evidence-field">
                    <label>Source</label>
                    <select
                      value={evidence.source}
                      onChange={(e) =>
                        handleEvidenceChange(index, "source", e.target.value)
                      }
                      required
                    >
                      <option value="Buyer">Buyer</option>
                      <option value="Seller">Seller</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addEvidenceItem}
              className="add-evidence-btn"
            >
              + Add Evidence Item
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? "Processing..." : "Submit Dispute"}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {decision && <DecisionDisplay decision={decision} />}

      <div className="bottom-hero">
        <img
          src="/HERO2.png"
          alt="Visual Processing Quote"
          className="bottom-hero-image"
        />
      </div>
    </div>
  );
};

export default DisputeForm;
