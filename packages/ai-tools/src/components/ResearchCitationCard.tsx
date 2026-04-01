interface ResearchCitationCardProps {
  source: string;
  finding: string;
  year: number;
  url?: string;
}

export default function ResearchCitationCard({
  source,
  finding,
  year,
  url,
}: ResearchCitationCardProps) {
  return (
    <div className="bg-white rounded-lg border border-light-gray p-4">
      <p className="text-sm font-medium text-dark mb-1">{source}</p>
      <p className="text-sm text-primary font-semibold">{finding}</p>
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-dark/40">{year}</p>
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline"
          >
            Read paper &rarr;
          </a>
        )}
      </div>
    </div>
  );
}
