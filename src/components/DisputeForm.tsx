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
  // AI Analysis fields
  aiAnalysis?: string;
  analysisConfidence?: number;
  extractedText?: string;
  analysisSuccess?: boolean;
  isAnalyzing?: boolean;
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
    console.log("=== FILE UPLOAD STARTED ===");
    console.log("Evidence Index:", index);
    console.log("File Name:", file.name);
    console.log("File Size:", file.size, "bytes");
    console.log("File Type:", file.type);
    console.log(
      "File Last Modified:",
      new Date(file.lastModified).toISOString()
    );

    const evidence = formData.submitted_evidence[index];
    console.log("Evidence Type:", evidence.type);
    console.log("Evidence Source:", evidence.source);

    const validationError = validateFile(file, evidence.type);

    if (validationError) {
      console.error("File validation failed:", validationError);
      alert(validationError);
      return;
    }

    try {
      // Step 1: Set analyzing state and generate SHA256 hash
      console.log("Generating SHA256 hash...");
      const sha256Hash = await generateSHA256(file);
      console.log("SHA256 Hash generated:", sha256Hash);

      // Set the analyzing state to show spinner
      setFormData((prev) => ({
        ...prev,
        submitted_evidence: prev.submitted_evidence.map((item, i) =>
          i === index
            ? {
                ...item,
                file: file,
                fileName: file.name,
                sha256_hash: sha256Hash,
                isAnalyzing: true,
                aiAnalysis: "",
                analysisConfidence: 0,
                extractedText: "",
                analysisSuccess: false,
              }
            : item
        ),
      }));

      // Step 2: Upload file to server for AI analysis
      console.log("Uploading file to server for AI analysis...");
      const formDataUpload = new FormData();
      formDataUpload.append("evidenceFile", file);
      formDataUpload.append("evidenceType", evidence.type);
      formDataUpload.append("description", evidence.description);
      formDataUpload.append("source", evidence.source);

      const analysisResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/files/analyze`,
        formDataUpload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("✅ Server analysis completed:");
      console.log("- Analysis success:", analysisResponse.data.success);
      console.log("- File info:", analysisResponse.data.fileInfo);
      console.log(
        "- Analysis confidence:",
        analysisResponse.data.analysis?.confidence
      );
      console.log(
        "- Analysis length:",
        analysisResponse.data.analysis?.analysis?.length,
        "characters"
      );

      // Step 3: Update form data with analysis results
      setFormData((prev) => ({
        ...prev,
        submitted_evidence: prev.submitted_evidence.map((item, i) =>
          i === index
            ? {
                ...item,
                file: file,
                fileName: file.name,
                sha256_hash: sha256Hash,
                isAnalyzing: false,
                // Add AI analysis results
                aiAnalysis: analysisResponse.data.analysis?.analysis || "",
                analysisConfidence:
                  analysisResponse.data.analysis?.confidence || 0,
                extractedText:
                  analysisResponse.data.analysis?.extractedText || "",
                analysisSuccess:
                  analysisResponse.data.analysis?.success || false,
              }
            : item
        ),
      }));

      console.log("✅ File upload and analysis completed successfully");
      console.log("=============================================\n");
    } catch (error) {
      console.error("❌ Error during file upload/analysis:", error);

      // Fallback: just store file locally if server analysis fails
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
                  isAnalyzing: false,
                  aiAnalysis:
                    "⚠️ Server analysis failed - file stored locally only. The file will still be included as evidence but without AI analysis.",
                  analysisConfidence: 0,
                  extractedText: "",
                  analysisSuccess: false,
                }
              : item
          ),
        }));
      } catch (fallbackError) {
        console.error("Fallback processing also failed:", fallbackError);
        setFormData((prev) => ({
          ...prev,
          submitted_evidence: prev.submitted_evidence.map((item, i) =>
            i === index
              ? {
                  ...item,
                  isAnalyzing: false,
                  aiAnalysis:
                    "❌ Error processing file. Please try uploading again.",
                  analysisConfidence: 0,
                  extractedText: "",
                  analysisSuccess: false,
                }
              : item
          ),
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setDecision(null);

    console.log("=== DISPUTE FORM SUBMISSION ===");
    console.log("Timestamp:", new Date().toISOString());
    console.log("Form Data Overview:");
    console.log("- Claimant Type:", formData.claimant_type);
    console.log("- Dispute Amount:", formData.dispute_amount);
    console.log("- Category:", formData.dispute_category);
    console.log(
      "- Statement of Claim Length:",
      formData.statement_of_claim.length
    );
    console.log(
      "- Statement of Defence Length:",
      formData.statement_of_defence.length
    );
    console.log("- Evidence Items:", formData.submitted_evidence.length);

    // Log each evidence item in detail
    formData.submitted_evidence.forEach((item, index) => {
      console.log(`\nFrontend Evidence Item ${index + 1}:`);
      console.log("- Type:", item.type);
      console.log("- Description:", item.description);
      console.log("- Source:", item.source);
      console.log("- Timestamp:", item.timestamp);
      console.log("- SHA256 Hash:", item.sha256_hash);
      console.log("- File Name:", item.fileName);
      console.log("- Has File Object:", !!item.file);

      if (item.file) {
        console.log("- File Size:", item.file.size);
        console.log("- File Type:", item.file.type);
        console.log(
          "- File Last Modified:",
          new Date(item.file.lastModified).toISOString()
        );

        // Check if File object will be serialized
        console.log(
          "- File serialization test:",
          JSON.stringify(item.file) === "{}"
            ? "File object will NOT be serialized"
            : "File object will be serialized"
        );
      }
    });

    // Prepare the data that will be sent
    const submitData = {
      ...formData,
      startTime: Date.now(),
    };

    console.log("\n=== DATA BEING SENT TO SERVER ===");
    console.log("Payload size:", JSON.stringify(submitData).length, "bytes");
    console.log(
      "Serialized submitted_evidence:",
      JSON.stringify(submitData.submitted_evidence, null, 2)
    );
    console.log("================================\n");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/dispute`,
        submitData
      );

      console.log("✅ Server response received successfully");
      console.log("Response data keys:", Object.keys(response.data));
      setDecision(response.data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.details ||
        err.message ||
        "Failed to process dispute. Please try again.";
      setError(errorMessage);
      console.error("❌ Dispute submission error:", err);
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

                {/* AI Analysis Results Section */}
                {(evidence.isAnalyzing || evidence.aiAnalysis) && (
                  <div className="ai-analysis-section">
                    <h4>🤖 AI Analysis</h4>

                    {evidence.isAnalyzing ? (
                      <div className="analysis-loading">
                        <div className="analysis-spinner"></div>
                        <p>Analyzing file content with AI...</p>
                      </div>
                    ) : (
                      <div className="analysis-results">
                        {evidence.analysisSuccess && (
                          <div className="analysis-confidence">
                            <span className="confidence-label">
                              Confidence Score:
                            </span>
                            <span
                              className={`confidence-value ${
                                (evidence.analysisConfidence || 0) > 0.8
                                  ? "high"
                                  : (evidence.analysisConfidence || 0) > 0.6
                                  ? "medium"
                                  : "low"
                              }`}
                            >
                              {(
                                (evidence.analysisConfidence || 0) * 100
                              ).toFixed(0)}
                              %
                            </span>
                          </div>
                        )}

                        <div className="analysis-content">
                          <label>Analysis Results:</label>
                          <div className="analysis-text">
                            {evidence.aiAnalysis}
                          </div>
                        </div>

                        {evidence.extractedText && (
                          <div className="extracted-data">
                            <label>Extracted Data:</label>
                            <div className="extracted-text">
                              {evidence.extractedText}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
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
