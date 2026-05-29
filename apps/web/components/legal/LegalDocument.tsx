import Link from 'next/link'
import type { LegalSection } from '@/content/legal/types'

interface RelatedLegalLink {
  href: string
  label: string
}

interface LegalDocumentProps {
  lastUpdated: string
  effectiveDate: string
  companyLegalName: string
  sections: readonly LegalSection[]
  relatedLink?: RelatedLegalLink
}

export function LegalDocument({
  lastUpdated,
  effectiveDate,
  companyLegalName,
  sections,
  relatedLink,
}: LegalDocumentProps) {
  return (
    <article className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-6 flex flex-col gap-1 border-b border-neutral-200 pb-4 text-xs text-neutral-500">
        <p>
          <span className="font-medium text-neutral-700">Last updated:</span> {lastUpdated}
        </p>
        <p>
          <span className="font-medium text-neutral-700">Effective date:</span> {effectiveDate}
        </p>
        <p>
          <span className="font-medium text-neutral-700">Operated by:</span> {companyLegalName}
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {sections.map(section => (
          <section key={section.id} aria-labelledby={`legal-${section.id}`}>
            <h2
              id={`legal-${section.id}`}
              className="text-sm font-semibold text-neutral-900"
            >
              {section.title}
            </h2>
            {section.paragraphs?.map((paragraph, index) => (
              <p key={index} className="mt-2 text-sm leading-relaxed text-neutral-600">
                {paragraph}
              </p>
            ))}
            {section.bullets && (
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-neutral-600">
                {section.bullets.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
            {section.closingParagraphs?.map((paragraph, index) => (
              <p key={`close-${index}`} className="mt-2 text-sm leading-relaxed text-neutral-600">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>

      {relatedLink && (
        <p className="mt-8 border-t border-neutral-200 pt-4 text-sm text-neutral-600">
          See also our{' '}
          <Link
            href={relatedLink.href}
            className="font-semibold text-primary-500 hover:text-primary-600"
          >
            {relatedLink.label}
          </Link>
          .
        </p>
      )}
    </article>
  )
}
