export interface Article {
  id: string;
  title: string;
  content: string;
  subsections?: {
    id: string;
    content: string;
  }[];
}

export const articlesData: Record<string, Article> = {
  "1": {
    id: "1",
    title: "Definitions",
    content: "For purposes of these Rules, the terms below bear the following meanings; singular includes plural and vice-versa.",
    subsections: [
      { id: "1.1", content: "Buyer – a natural or legal person that has paid for an Item or Service." },
      { id: "1.2", content: "Seller – a natural or legal person that has received payment and undertakes to supply an Item or Service." },
      { id: "1.3", content: "Platform – the e-commerce website, mobile app, or payment facilitator through which the transaction was concluded and which integrates the Tribunal's API." },
      { id: "1.4", content: "Item – any movable, tangible good identified in the order confirmation." },
      { id: "1.5", content: "Service – any intangible performance, licence, subscription, or digital content provided for a fee." },
      { id: "1.6", content: "Delivery Window – the period from the earliest estimated delivery date to the latest guaranteed delivery date shown at checkout." },
      { id: "1.7", content: "Claim – a written demand for relief submitted pursuant to Article 3." },
      { id: "1.8", content: "Decision – a written determination rendered by the Tribunal disposing of a Claim." },
      { id: "1.9", content: "Remedy – the relief granted in a Decision, as listed in Article 8." },
      { id: "1.10", content: "Proof of Delivery (POD) – a carrier-issued electronic record marked delivered that includes carrier name, tracking number, timestamp, and geolocation or signature data." }
    ]
  },
  "2": {
    id: "2",
    title: "Scope and Hierarchy of Norms",
    content: "This article defines the jurisdiction and authority of the AI Judge Tribunal.",
    subsections: [
      { id: "2.1", content: "Monetary Ceiling. The Tribunal hears only Claims whose combined disputed amount—including item price, shipping, taxes, and platform fees—does not exceed USD 1,000 or the equivalent captured at payment." },
      { id: "2.2", content: "Covered Dispute Categories. The Tribunal has jurisdiction over: (a) Item not received; (b) Item defective or damaged; (c) Incorrect Item sent; (d) Partial shipment or missing components; (e) Late delivery; (f) Service not rendered; (g) Unauthorized charge; (h) Buyer fraud or abuse; (i) Breach of stated cancellation or refund policy; (j) Counterfeit Item; (k) Warranty or functional failure within ninety (90) days; (l) Subscription Service cancellation errors; and (m) Digital-content delivery or activation failure." },
      { id: "2.3", content: "Excluded Matters. Requests for punitive damages, personal-injury compensation, real-property remedies, or criminal adjudications are inadmissible." },
      { id: "2.4", content: "Hierarchy. Mandatory consumer or data-protection statute prevails over these Rules; these Rules prevail over Platform policy; Platform policy prevails over inconsistent pre-printed Seller terms." }
    ]
  },
  "3": {
    id: "3",
    title: "Consent and Commencement",
    content: "Procedures for initiating dispute resolution.",
    subsections: [
      { id: "3.1", content: "Consent is recorded through a standalone checkbox at checkout or a post-transaction opt-in link referencing these Rules." },
      { id: "3.2", content: "The Claimant starts proceedings by submitting a Statement of Claim within the limitation period specified in Article 7 and affirming its truthfulness." },
      { id: "3.3", content: "Upon receipt, the Tribunal assigns a dispute ID, opens a secure E-Locker for document exchange, and notifies the opposing party through the Platform's messaging system and registered e-mail." }
    ]
  },
  "4": {
    id: "4",
    title: "Pleadings and Service",
    content: "Requirements for statements and document service.",
    subsections: [
      { id: "4.1", content: "A Statement of Claim must include: (i) the order number; (ii) the dispute category in Article 2.2; (iii) a clear factual narrative not exceeding two-thousand words; (iv) the specific Remedy sought; (v) a list of supporting evidence files (order receipts, tracking screenshots, chat logs)." },
      { id: "4.2", content: "The Respondent files a Statement of Defence within seventy-two (72) hours of notice; the Tribunal may grant a single forty-eight-hour extension for good cause." },
      { id: "4.3", content: "Any document uploaded to the E-Locker is deemed served immediately; the Platform relays automated notifications." }
    ]
  },
  "5": {
    id: "5",
    title: "Evidence and Burden of Proof",
    content: "Rules governing evidence submission and proof standards.",
    subsections: [
      { id: "5.1", content: "All evidence files must carry a SHA-256 hash and metadata (upload time, file type, original source URL or device)." },
      { id: "5.2", content: "Admissible evidence includes—without limitation—carrier tracking logs, delivery photos with EXIF data, platform order screenshots, payment-gateway logs, API-verified activation tokens, and customer-service chat transcripts." },
      { id: "5.3", content: "The party asserting a fact bears the burden of proving that fact by a preponderance of evidence, unless these Rules impose a higher standard or shift the burden because only the other party controls the data (for example, warehouse scan logs)." },
      { id: "5.4", content: "When a party fails to produce evidence uniquely within their control, the Tribunal may draw an adverse inference against that party." },
      { id: "5.5", content: "Screenshots of online conversations are admissible if they include timestamps and platform verification; the Tribunal may request API confirmation." },
      { id: "5.6", content: "Evidence tampering (doctored images, forged logs) triggers automatic dismissal and Article 11 sanctions." }
    ]
  },
  "6": {
    id: "6",
    title: "Procedure and Deliberation",
    content: "Procedural rules for case handling and decision-making.",
    subsections: [
      { id: "6.1", content: "The Tribunal processes claims in FIFO order unless expedited handling is warranted for perishable goods or imminent financial harm." },
      { id: "6.2", content: "The Tribunal renders a Decision within five (5) Business Days of the later of: (i) Statement of Defence filing, or (ii) expiry of the Defence deadline." },
      { id: "6.3", content: "Decisions are generated by the AI Judge model, which weighs evidence, applies these Rules, and outputs a structured JSON including remedy type and confidence score." },
      { id: "6.4", content: "Low-Confidence Decisions trigger automatic human review if the Platform has enabled this feature; otherwise, they are flagged as appealable." }
    ]
  },
  "7": {
    id: "7",
    title: "Special Provisions by Category of Dispute",
    content: "Category-specific rules and deadlines for different dispute types.",
    subsections: [
      { id: "7.1", content: "Item not received: Claim must be filed between 3 days after the Delivery Window closes and 30 days thereafter; Seller proves delivery with valid POD." },
      { id: "7.2", content: "Item defective or damaged: Claim within 7 days of delivery; Buyer provides photos/video showing the defect and original packaging." },
      { id: "7.3", content: "Incorrect Item sent: Claim within 7 days; Buyer shows order confirmation versus received item; automatic full refund plus return shipping." },
      { id: "7.4", content: "Late delivery causing material harm: Buyer proves time-sensitive need communicated pre-purchase; partial refund (10-50% of item value) depending on delay duration." },
      { id: "7.5", content: "Service not rendered: For fixed-date services, claim immediately after non-performance; for ongoing services, claim after 48-hour non-response to activation request." },
      { id: "7.6", content: "Unauthorized charge: Claim within 60 days of statement date; Buyer denies authorizing the transaction and Platform checks for account compromise." },
      { id: "7.7", content: "Buyer fraud or abuse: Seller shows pattern of false claims, item-not-returned after refund, or credit-card chargeback after receiving goods." },
      { id: "7.8", content: "Counterfeit Item: Buyer provides brand authentication rejection or expert assessment; immediate full refund and Seller banned pending investigation." },
      { id: "7.9", content: "Digital content non-delivery: Claim within 48 hours of purchase; Platform checks activation servers; automatic re-delivery or refund." }
    ]
  },
  "8": {
    id: "8",
    title: "Catalogue of Remedies",
    content: "Available remedies the Tribunal may award.",
    subsections: [
      { id: "8.1", content: "Full refund: Return of entire payment including original shipping." },
      { id: "8.2", content: "Partial refund: Percentage reduction reflecting diminished value or delay." },
      { id: "8.3", content: "Replacement shipment: Seller sends correct/non-defective item at no extra charge." },
      { id: "8.4", content: "Repair or remediation: Seller fixes defect or completes partial performance." },
      { id: "8.5", content: "Return shipping label: Seller provides prepaid return for wrong/defective items." },
      { id: "8.6", content: "Extended warranty: Additional coverage period for items with early failure." },
      { id: "8.7", content: "Credit or discount code: For minor breaches where Buyer retains usable goods." },
      { id: "8.8", content: "Dismissal of claim: Where Claimant fails to meet burden of proof." },
      { id: "8.9", content: "Mutual release: Parties waive further claims arising from the transaction." }
    ]
  },
  "9": {
    id: "9",
    title: "Compliance and Enforcement",
    content: "Rules for enforcing tribunal decisions.",
    subsections: [
      { id: "9.1", content: "Remedies must be completed within 5 Business Days of Decision unless the Decision specifies otherwise." },
      { id: "9.2", content: "Platform auto-executes monetary remedies by reversing charges or debiting seller payouts." },
      { id: "9.3", content: "Non-compliance triggers Platform suspension and collection proceedings." }
    ]
  },
  "10": {
    id: "10",
    title: "Correction and Appeal",
    content: "Procedures for correcting errors and appealing decisions.",
    subsections: [
      { id: "10.1", content: "Manifest errors (wrong parties, amounts) may be corrected within 24 hours by Tribunal sua sponte." },
      { id: "10.2", content: "Appeals allowed only for Low-Confidence Decisions or newly discovered evidence proving fraud." },
      { id: "10.3", content: "Appeal window is 5 Business Days; human reviewer or enhanced AI model re-examines the case." }
    ]
  },
  "11": {
    id: "11",
    title: "Fraud and Sanctions",
    content: "Penalties for fraudulent behavior and abuse of the system.",
    subsections: [
      { id: "11.1", content: "Evidence of deliberate deception results in automatic judgment against the deceiving party." },
      { id: "11.2", content: "Repeat offenders face Platform bans and reporting to credit agencies where lawful." },
      { id: "11.3", content: "The Fraud Ledger tracks all findings of misconduct for pattern detection." }
    ]
  },
  "17": {
    id: "17",
    title: "Misleading Conduct and Partial Bad Faith",
    content: "Rules for identifying and sanctioning misleading conduct and bad faith behavior.",
    subsections: [
      { id: "17.1", content: "Misleading conduct includes false statements about product condition, delivery status, or return policies." },
      { id: "17.2", content: "Tier I Warning: Minor misconduct that does not warrant immediate sanctions but is recorded for pattern analysis." },
      { id: "17.3", content: "The Tribunal may impose sanctions for repeated misleading conduct including account restrictions and reporting to relevant authorities." }
    ]
  },
  "13": {
    id: "13", 
    title: "Record-Keeping and Audit",
    content: "Requirements for maintaining decision records and audit trails.",
    subsections: [
      { id: "13.1", content: "All decisions must include precise timestamps for audit logging and compliance tracking." },
      { id: "13.2", content: "Decision records must be maintained for a minimum of 7 years for regulatory compliance." },
      { id: "13.3", content: "Audit trails must include all evidence considered, rules applied, and reasoning methodology." }
    ]
  }
};

export function getArticleById(articleId: string): Article | undefined {
  // Handle both "Article X" and "X.Y" formats
  const match = articleId.match(/Article\s+(\d+(?:\.\d+)?)|^(\d+(?:\.\d+)?)/);
  if (match) {
    const id = match[1] || match[2];
    const [mainArticle, subSection] = id.split('.');
    
    if (subSection) {
      // Return subsection info
      const article = articlesData[mainArticle];
      if (article) {
        const subsection = article.subsections?.find(sub => sub.id === id);
        if (subsection) {
          return {
            id: id,
            title: `Article ${id}`,
            content: subsection.content
          };
        }
      }
    }
    
    return articlesData[mainArticle];
  }
  
  return undefined;
}

export function getArticlePreview(articleId: string): string {
  const article = getArticleById(articleId);
  if (!article) return "Article not found";
  
  // For subsections, return full content as it's usually short
  if (articleId.includes('.')) {
    return article.content;
  }
  
  // For main articles, return title and truncated content
  const preview = `${article.title}: ${article.content}`;
  return preview.length > 150 ? preview.substring(0, 147) + "..." : preview;
}