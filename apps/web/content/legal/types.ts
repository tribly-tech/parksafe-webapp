export interface LegalSection {
  id: string
  title: string
  paragraphs?: string[]
  bullets?: string[]
  /** Rendered after bullet list when a section needs a closing paragraph. */
  closingParagraphs?: string[]
}

export interface LegalDocumentMeta {
  lastUpdated: string
  effectiveDate: string
  companyLegalName: string
  productName: string
  websiteUrl: string
  supportEmail: string
  sections: readonly LegalSection[]
}
